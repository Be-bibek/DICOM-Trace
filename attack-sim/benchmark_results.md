# SentinelMark Performance & Quality Benchmarks

> Measured across 50 iterations on a 512 KB uncompressed 16-bit DICOM frame.

| Benchmark Metric | Measured Value | Target Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Watermark Embedding Latency** | `0.039 ms` | `< 10.0 ms` | PASS |
| **Watermark Extraction Latency** | `0.011 ms` | `< 5.0 ms` | PASS |
| **Pipeline Encryption Latency** | `2.495 ms` | `< 15.0 ms` | PASS |
| **Pipeline Verification Latency** | `0.022 ms` | `< 15.0 ms` | PASS |
| **Ingest Throughput** | `200.38 MB/s` | `> 25.0 MB/s` | PASS |
| **Post-Watermark PSNR** | `129.76 dB` | `>= 48.0 dB` | PASS |

## PSNR Quality Analysis
- **Measured PSNR**: `129.76 dB`
- **Clinical Significance**: PSNR > 48.0 dB represents near-lossless pixel fidelity where fragile LSB modifications are imperceptible to medical imaging algorithms and human radiologists.
