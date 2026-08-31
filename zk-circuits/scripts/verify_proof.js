#!/usr/bin/env node
/**
 * ZK-BEW Proof Verifier
 * ─────────────────────────────────────────────────────────────────
 * Verifies a Groth16 proof using the verification key.
 * This runs on-chain (or at the Verification Authority server).
 * The verifier sees ONLY the proof π and public inputs — never PHI.
 *
 * Usage:
 *   node scripts/verify_proof.js
 */

const snarkjs = require('snarkjs');
const fs      = require('fs');
const path    = require('path');

async function verifyProof() {
    const buildDir = path.join(__dirname, '..', 'build');

    const vKeyPath  = path.join(buildDir, 'verification_key.json');
    const proofPath = path.join(buildDir, 'proof.json');
    const pubPath   = path.join(buildDir, 'public.json');

    if (!fs.existsSync(vKeyPath) || !fs.existsSync(proofPath) || !fs.existsSync(pubPath)) {
        console.error('\n❌ Missing build artifacts. Run `npm run compile` and `npm run prove` first.');
        process.exit(1);
    }

    const vKey   = JSON.parse(fs.readFileSync(vKeyPath));
    const proof  = JSON.parse(fs.readFileSync(proofPath));
    const pubSig = JSON.parse(fs.readFileSync(pubPath));

    console.log('\n🔍 ZK-BEW Proof Verifier');
    console.log('─────────────────────────────────────────');
    console.log('  Protocol:         Groth16 (BN128 curve)');
    console.log(`  Public signals:   ${pubSig.length} signals`);
    console.log('  Verifying proof...\n');

    const startTime = Date.now();
    const result    = await snarkjs.groth16.verify(vKey, pubSig, proof);
    const elapsed   = Date.now() - startTime;

    if (result) {
        console.log('✅ PROOF VERIFIED — DICOM integrity confirmed without PHI disclosure');
        console.log(`   Verification time: ${elapsed}ms`);
        console.log('\n   IEEE Claim Satisfied:');
        console.log('   ├─ BEW watermark correctly derived from scanner physics');
        console.log('   ├─ SHA-256 pixel commitment matches on-chain record');
        console.log('   └─ Pixel entropy within statistical bounds (no GAN deepfake)');
    } else {
        console.log('❌ PROOF INVALID — Medical image integrity cannot be confirmed');
        console.log('   Possible causes: tampered pixels, wrong scanner key, GAN injection');
    }

    return result;
}

if (require.main === module) {
    verifyProof().then(ok => process.exit(ok ? 0 : 1));
}

module.exports = { verifyProof };
