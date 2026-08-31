import base64
import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "verify-py"))
from app.schemas.telemetry import IngestRequest, BehaviorTelemetryRequest, VerifyRequest
from app.verification.pipeline import process_ingest_pipeline, process_verify_pipeline

def run_tamper_simulation():
    print("=== [ATTACK SIMULATION 1: PAYLOAD TAMPERING] ===")
    master_key_hex = "55" * 32
    dev_id_hex = "22" * 32
    now_ts = int(time.time())

    pixels_b64 = base64.b64encode(b"\x40\x40" * 512).decode("utf-8")
    ingest_req = IngestRequest(
        telemetry=BehaviorTelemetryRequest(
            device_id_hex=dev_id_hex,
            timestamp=now_ts,
            cpu_freq_mhz=3500,
            thread_count=16,
            jitter_ns=120,
            sequence_id=1
        ),
        master_key_hex=master_key_hex,
        raw_pixels_base64=pixels_b64,
        bits_allocated=16,
        transfer_syntax_uid="1.2.840.10008.1.2.1"
    )

    ingest_res = process_ingest_pipeline(ingest_req)
    env = ingest_res["envelope"].model_dump()

    # 1. Flip bit in ciphertext
    ciphertext_bytes = bytearray(base64.b64decode(env["ciphertext"]))
    ciphertext_bytes[5] ^= 0xFF
    env["ciphertext"] = base64.b64encode(ciphertext_bytes).decode("utf-8")

    verify_req = VerifyRequest(
        envelope=env,
        telemetry=ingest_req.telemetry,
        master_key_hex=master_key_hex
    )

    res = process_verify_pipeline(verify_req)
    print(f"Tamper Attempt Result Status: {res.status}")
    print(f"Verified: {res.verified}")
    print(f"Trust Score: {res.trust_score}")

    assert not res.verified, "Tampered payload must fail verification!"
    assert res.status in ("TAMPERED", "VERIFICATION_FAILED"), f"Expected status TAMPERED, got {res.status}"
    print(">>> SUCCESS: Tampering attack cleanly detected & rejected!\n")

if __name__ == "__main__":
    run_tamper_simulation()
