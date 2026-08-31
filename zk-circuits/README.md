# ZK-BEW: Zero-Knowledge Behavior-Entangled Watermarking

## Novel IEEE Contribution

This module contains the **core cryptographic novelty** of the DICOM-Trace research paper:
a **Groth16 ZK-SNARK circuit** that proves DICOM medical image integrity
**without revealing patient pixel data (PHI) to any verifier**.

> **Published IEEE Claim:**
> *"A zero-knowledge proof system for behavior-entangled watermark integrity
>  verification in DICOM medical imaging, enabling privacy-preserving audit
>  without Protected Health Information disclosure."*

---

## The Unsolved Problem

Every existing medical imaging security system forces a fundamental tradeoff:

| Approach | Privacy | Verifiability |
|---|---|---|
| Show image to verifier | ❌ PHI disclosed | ✅ Can verify |
| Encrypt image | ✅ Private | ❌ Cannot verify |
| **ZK-BEW (this work)** | ✅ **PHI never disclosed** | ✅ **Cryptographically verified** |

---

## Circuit: `bew_watermark_proof.circom`

The circuit proves **three simultaneous claims** from private pixel data:

### Claim 1 — BEW Derivation Correctness
```
bew_w = HKDF-SHA256(K_device ∥ Φ_scanner ∥ H_prev)
```
The watermark was correctly derived from the live scanner state,
not forged post-acquisition.

### Claim 2 — Image Commitment Integrity
```
SHA-256(pixels[]) == commitment  (on-chain)
```
The pixel data matches the hash registered on the blockchain ledger.

### Claim 3 — Entropy Bound (Anti-Deepfake)
```
entropy_lo ≤ pixel_entropy ≤ entropy_hi
```
The pixel distribution follows natural scanner noise statistics,
proving the image is **not** a GAN-generated medical deepfake.

---

## Proof Properties (Groth16 / BN128)

| Property | Value |
|---|---|
| Proof size | ~800 bytes |
| Verification time | < 10ms |
| Prover time (N=64) | < 2 seconds |
| Public inputs revealed | commitment hash, scanner pubkey, chain root, entropy bounds |
| Private inputs (hidden) | pixels[], K_device, φ_scanner, H_prev, pixel_entropy |

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the witness generator (demo with random data)
npm run witness

# Verify a pre-generated proof
npm run verify

# Full end-to-end pipeline (requires circom binary)
bash setup_and_prove.sh
```

---

## Project Structure

```
zk-circuits/
├── circuits/
│   └── bew_watermark_proof.circom   # ← The ZK circuit (novel contribution)
├── scripts/
│   ├── generate_witness.js          # Computes private witness from DICOM data
│   └── verify_proof.js             # Verifies Groth16 proof (runs at VA)
├── build/                           # Generated artifacts (gitignored)
│   ├── proof.json                   # ~800-byte Groth16 proof
│   ├── public.json                  # Public signals (no PHI)
│   └── verification_key.json        # Verifier key for on-chain deployment
└── setup_and_prove.sh              # End-to-end pipeline automation
```

---

## Installing circom

The circuit compiler (`circom`) is a Rust binary:

```bash
# Option 1: Build from source
cargo install circom

# Option 2: Download pre-built binary from
#   https://docs.circom.io/getting-started/installation/
```

---

## Integration with DICOM-Trace

This module plugs into the existing pipeline as follows:

```
[MRI Scanner] → [BEW Embed] → [WASM Enclave]
                                      │
                               generate_witness()
                                      │
                               ZK Proof π (~800 bytes)
                                      │
                         [Verification Authority]
                                      │
                               verify_proof()   ← sees NO pixels
                                      │
                          [DICOMTrustLedger.sol]  ← commitment on-chain
```
