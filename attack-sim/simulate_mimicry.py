import base64
import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "verify-py"))
from app.schemas.telemetry import IngestRequest, BehaviorTelemetryRequest, VerifyRequest
from app.verification.pipeline import process_ingest_pipeline, process_verify_pipeline

def run_mimicry_simulation():
    print("=== [ATTACK SIMULATION 3: TELEMETRY MIMICRY ATTACK] ===")
    master_key_hex = "55" * 32
    dev_id_hex = "44" * 32
    base_ts = int(time.time())

    pixels_b64 = base64.b64encode(b"\x40\x40" * 512).decode("utf-8")

    # Generate 12 events with identical, static jitter = 50ns (Zero-Variance Mimicry Pattern)
    res = None
    for seq in range(1, 13):
        ts = base_ts + seq
        ingest_req = IngestRequest(
            telemetry=BehaviorTelemetryRequest(
                device_id_hex=dev_id_hex,
                timestamp=ts,
                cpu_freq_mhz=3000,
                thread_count=8,
                jitter_ns=50, # Static constant jitter
                sequence_id=seq
            ),
            master_key_hex=master_key_hex,
            raw_pixels_base64=pixels_b64,
            bits_allocated=16,
            transfer_syntax_uid="1.2.840.10008.1.2.1"
        )
        ingest_res = process_ingest_pipeline(ingest_req)
        env = ingest_res["envelope"].model_dump()

        verify_req = VerifyRequest(
            envelope=env,
            telemetry=ingest_req.telemetry,
            master_key_hex=master_key_hex
        )

        res = process_verify_pipeline(verify_req)

    print(f"Mimicry Simulation Final Status: {res.status}")
    print(f"Verified: {res.verified}")
    print(f"Trust Score: {res.trust_score}")
    print(f"Anomaly Status: {res.anomaly_status}")

    assert res.status == "SUSPICIOUS_MIMICRY", f"Expected status SUSPICIOUS_MIMICRY, got {res.status}"
    assert not res.verified, "Mimicry telemetry must fail verification!"
    print(">>> SUCCESS: Zero-variance mimicry attack cleanly detected & flagged!\n")

if __name__ == "__main__":
    run_mimicry_simulation()
