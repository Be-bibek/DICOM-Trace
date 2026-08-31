# ZK-BEW Verification Benchmark Report

This automated benchmark was generated to support the empirical claims in the IEEE research paper.

## Empirical Measurements

| Metric | Measured Value | Notes |
|---|---|---|
| **Proof System** | Groth16 (BN128) | Zero-Knowledge SNARK |
| **Circuit Constraints** | 1,19,565 R1CS | Handles SHA-256 (N=64 pixel blocks) |
| **Proof Generation Time** | 2820.84 ms | Measured via snarkjs (Prover/Client side) |
| **Verification Time** | 1181.34 ms | Measured via snarkjs (Verification Authority side) |
| **Proof Payload Size** | 804 bytes | Transmission size to blockchain/verifier |
| **PHI Leakage** | 0 bits | Raw DICOM pixels are never transmitted |

## Analysis

The ZK-BEW system achieves integrity verification in **< 1182 ms**, making it highly suitable for real-time PACS interception. 
The proof size of **~800 bytes** represents a massive data reduction compared to transmitting full DICOM images (which often exceed 50 MB) to the verification authority, significantly saving bandwidth while strictly adhering to HIPAA privacy constraints.
