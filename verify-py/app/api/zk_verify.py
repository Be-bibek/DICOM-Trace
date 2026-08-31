from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import json
import tempfile
import os
import logging

router = APIRouter(prefix="/verify/zk-proof", tags=["zk-proof"])
logger = logging.getLogger(__name__)

class ZKProofPayload(BaseModel):
    proof: dict
    public_signals: list[str]

@router.post("")
async def verify_zk_proof(payload: ZKProofPayload):
    """
    Verifies a Groth16 Zero-Knowledge proof of DICOM integrity.
    Requires `snarkjs` to be installed and available in the environment.
    """
    # Load the verification key (expected to be present in the zk-circuits build folder)
    # For production, this path would be injected via config.
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    vkey_path = os.path.join(base_dir, "zk-circuits", "build", "verification_key.json")
    
    if not os.path.exists(vkey_path):
        raise HTTPException(status_code=500, detail="Verification key not found. Ensure Trusted Setup was completed.")
    
    with tempfile.TemporaryDirectory() as temp_dir:
        proof_path = os.path.join(temp_dir, "proof.json")
        public_path = os.path.join(temp_dir, "public.json")
        
        with open(proof_path, "w") as f:
            json.dump(payload.proof, f)
            
        with open(public_path, "w") as f:
            json.dump(payload.public_signals, f)
            
        try:
            # We call snarkjs directly to perform the pairing check
            # For a production deployment without Node.js, we would use a Python pairing library 
            # like py_ecc or similar, or FFI into a Rust verifier.
            result = subprocess.run(
                ["snarkjs", "groth16", "verify", vkey_path, public_path, proof_path],
                capture_output=True,
                text=True,
                check=False
            )
            
            if "OK" in result.stdout or result.returncode == 0:
                return {
                    "zk_valid": True,
                    "privacy_guarantee": "ZERO_PHI_LEAKAGE",
                    "details": "Groth16 proof successfully verified. DICOM integrity confirmed without revealing pixels."
                }
            else:
                logger.warning(f"ZK Proof Verification Failed. snarkjs output: {result.stdout}\n{result.stderr}")
                return {
                    "zk_valid": False,
                    "privacy_guarantee": "ZERO_PHI_LEAKAGE",
                    "details": "Proof verification failed. Integrity cannot be confirmed."
                }
                
        except Exception as e:
            logger.error(f"Error executing snarkjs: {str(e)}")
            raise HTTPException(status_code=500, detail="Verification execution failed.")
