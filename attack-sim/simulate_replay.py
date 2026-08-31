import base64
import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "verify-py"))
from app.schemas.telemetry import IngestRequest, BehaviorTelemetryRequest, VerifyRequest
from app.verification.pipeline import process_ingest_pipeline, process_verify_pipeline

def run_replay_simulation():
    print("=== [ATTACK SIMULATION 2: REPLAY & EXPIRED TIMESTAMP] ===")
    master_key_hex = "55" * 32
    dev_id_hex = "33" * 32
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

    verify_req = VerifyRequest(
        envelope=env,
        telemetry=ingest_req.telemetry,
        master_key_hex=master_key_hex
    )

    # First verification: Pass
    res1 = process_verify_pipeline(verify_req)
    assert res1.verified, "First verification attempt must succeed"

    # Second verification with SAME nonce: Replay Attack!
    res2 = process_verify_pipeline(verify_req)
    print(f"Replay Attempt Result Status: {res2.status}")
    print(f"Verified: {res2.verified}")
    print(f"Trust Score: {res2.trust_score}")

    assert not res2.verified, "Replayed payload must fail verification!"
    assert res2.status == "REPLAYED", f"Expected status REPLAYED, got {res2.status}"

    # Expired Timestamp Check (-60 seconds)
    expired_env = dict(env)
    expired_env["timestamp"] = now_ts - 60
    expired_env["nonce"] = base64.b64encode(b"\xFF" * 12).decode("utf-8")

    verify_req_exp = VerifyRequest(
        envelope=expired_env,
        telemetry=ingest_req.telemetry,
        master_key_hex=master_key_hex
    )
    res_exp = process_verify_pipeline(verify_req_exp)
    print(f"Expired Attempt Result Status: {res_exp.status}")
    assert not res_exp.verified
    assert res_exp.status == "REPLAYED"

    print(">>> SUCCESS: Replay & expiration attacks cleanly detected & rejected!\n")

if __name__ == "__main__":
    run_replay_simulation()
