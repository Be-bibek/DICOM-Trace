#!/usr/bin/env node
/**
 * ZK-BEW Witness Generator
 * ─────────────────────────────────────────────────────────────────
 * Computes the private witness (secret inputs) for the
 * BEWWatermarkProof ZK circuit.
 *
 * In the IEEE paper, this runs inside the WASM enclave (core-rs)
 * on the sender's browser, ensuring PHI never leaves the client.
 *
 * Usage:
 *   node scripts/generate_witness.js --pixels <hex> --k-device <hex>
 *                                    --phi <hex> --h-prev <hex>
 *                                    --entropy <float>
 *                                    --entropy-mu <float> --entropy-sigma <float>
 */

const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');

// ── Helpers ─────────────────────────────────────────────────────

/** Convert a hex string to an array of bit values (MSB first) */
function hexToBits(hex) {
    return Array.from(Buffer.from(hex, 'hex'))
        .flatMap(byte => Array.from({length: 8}, (_, i) => (byte >> (7 - i)) & 1));
}

/** Convert a Buffer/Uint8Array to a bit array */
function bufToBits(buf) {
    return Array.from(buf)
        .flatMap(byte => Array.from({length: 8}, (_, i) => (byte >> (7 - i)) & 1));
}

/** Compute SHA-256 and return bit array */
function sha256Bits(data) {
    const hash = crypto.createHash('sha256').update(data).digest();
    return bufToBits(hash);
}

/** Compute HKDF-SHA256 approximation: SHA256(K_device || phi || H_prev) */
function hkdfApprox(kDeviceHex, phiHex, hPrevHex) {
    const kBuf   = Buffer.from(kDeviceHex, 'hex');
    const phiBuf = Buffer.from(phiHex, 'hex');
    const hBuf   = Buffer.from(hPrevHex, 'hex');
    const concat = Buffer.concat([kBuf, phiBuf, hBuf]);
    return crypto.createHash('sha256').update(concat).digest();
}

/** Compute Shannon entropy of a pixel array, scaled to integer */
function computePixelEntropy(pixels, scale = 1000) {
    const counts = {};
    for (const p of pixels) { counts[p] = (counts[p] || 0) + 1; }
    const n = pixels.length;
    let entropy = 0;
    for (const count of Object.values(counts)) {
        const p = count / n;
        if (p > 0) entropy -= p * Math.log2(p);
    }
    return Math.round(entropy * scale);
}

// ── Main witness generation ──────────────────────────────────────

/**
 * Generate a witness object for the BEWWatermarkProof circuit.
 * @param {object} params
 * @param {number[]} params.pixels    - array of pixel values (0-255)
 * @param {string}  params.kDevice   - 32-byte hex scanner key
 * @param {string}  params.phi       - 32-byte hex scanner fingerprint
 * @param {string}  params.hPrev     - 32-byte hex previous scan hash
 * @param {number}  params.entropyMu - baseline entropy mean
 * @param {number}  params.entropySigma - baseline entropy std-dev
 * @returns {object} witness suitable for snarkjs circuit input
 */
function generateWitness({ pixels, kDevice, phi, hPrev, entropyMu, entropySigma }) {
    const SCALE = 1000;

    // Derive the BEW watermark
    const bewBuf   = hkdfApprox(kDevice, phi, hPrev);
    const bewBits  = bufToBits(bewBuf);

    // Compute pixel SHA-256 commitment
    const pixelBuf    = Buffer.from(pixels);
    const commitBits  = sha256Bits(pixelBuf);

    // Compute entropy
    const pixelEntropy = computePixelEntropy(pixels, SCALE);

    // Z-score bounds (μ ± 3σ), scaled
    const entropy_lo = Math.floor((entropyMu - 3 * entropySigma) * SCALE);
    const entropy_hi = Math.ceil ((entropyMu + 3 * entropySigma) * SCALE);

    // Scanner pubkey: SHA-256(kDevice) as a proxy for pubkey derivation
    const scannerPubkeyBits = sha256Bits(Buffer.from(kDevice, 'hex'));

    // Chain root: SHA-256(hPrev) as a deterministic Merkle root proxy
    const chainRootBits = sha256Bits(Buffer.from(hPrev, 'hex'));

    const witness = {
        // ── Public inputs ──
        commitment:     commitBits,
        scanner_pubkey: scannerPubkeyBits,
        chain_root:     chainRootBits,
        entropy_lo:     entropy_lo,
        entropy_hi:     entropy_hi,

        // ── Private witness ──
        pixels:         pixels,
        K_device:       hexToBits(kDevice),
        phi_scanner:    hexToBits(phi),
        H_prev:         hexToBits(hPrev),
        bew_w:          bewBits,
        pixel_entropy:  pixelEntropy,
    };

    return witness;
}

// ── CLI entry point ──────────────────────────────────────────────

if (require.main === module) {
    // Demo: generate a sample witness with random test data
    const pixels    = Array.from({length: 64}, () => Math.floor(Math.random() * 256));
    const kDevice   = crypto.randomBytes(32).toString('hex');
    const phi       = crypto.randomBytes(32).toString('hex');
    const hPrev     = crypto.randomBytes(32).toString('hex');
    const entropyMu    = 6.5;   // typical 8-bit grayscale entropy
    const entropySigma = 0.4;

    console.log('\n🔐 ZK-BEW Witness Generator');
    console.log('─────────────────────────────────────────');
    console.log(`  Pixels (${pixels.length}x 8-bit):  [${pixels.slice(0, 8).join(', ')}... ]`);
    console.log(`  K_device (32 bytes):      ${kDevice.slice(0, 16)}...`);
    console.log(`  Scanner φ (32 bytes):     ${phi.slice(0, 16)}...`);
    console.log(`  H_prev (32 bytes):        ${hPrev.slice(0, 16)}...`);

    const witness = generateWitness({ pixels, kDevice, phi, hPrev, entropyMu, entropySigma });

    const derived_watermark_hex = Buffer.from(witness.bew_w.reduce((acc, bit, i) => {
        const byteIdx = Math.floor(i / 8);
        acc[byteIdx] = (acc[byteIdx] || 0) | (bit << (7 - (i % 8)));
        return acc;
    }, new Array(32).fill(0))).toString('hex');

    console.log(`\n✅ BEW Watermark derived:   ${derived_watermark_hex.slice(0, 32)}...`);
    console.log(`✅ Pixel entropy (scaled):  ${witness.pixel_entropy}`);
    console.log(`✅ Entropy bounds:          [${witness.entropy_lo}, ${witness.entropy_hi}]`);
    console.log(`✅ In-bounds:               ${witness.pixel_entropy >= witness.entropy_lo && witness.pixel_entropy <= witness.entropy_hi}`);

    // Write witness to file for snarkjs
    const outPath = path.join(__dirname, '..', 'build', 'witness_input.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(witness, null, 2));
    console.log(`\n📝 Witness written to: ${outPath}`);
    console.log('\n   Next: run `npm run compile` then `npm run prove`');
}

module.exports = { generateWitness, hexToBits, bufToBits, sha256Bits, computePixelEntropy };
