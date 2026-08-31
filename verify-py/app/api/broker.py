from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(tags=["Broker"])

# In-memory storage for the E2E demo
keys_db: Dict[str, str] = {}
messages_db: Dict[str, dict] = {}

class KeyRegister(BaseModel):
    user_id: str
    public_key_hex: str

class SendPayload(BaseModel):
    recipient_id: str
    envelope: dict
    wrapped_key: str
    ephemeral_sender_pubkey: str

@router.post("/keys/register")
async def register_key(data: KeyRegister):
    keys_db[data.user_id] = data.public_key_hex
    return {"status": "ok"}

@router.get("/keys/{user_id}")
async def get_key(user_id: str):
    if user_id not in keys_db:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"public_key_hex": keys_db[user_id]}

@router.post("/send")
async def send_payload(data: SendPayload):
    messages_db[data.recipient_id] = {
        "envelope": data.envelope,
        "wrapped_key": data.wrapped_key,
        "ephemeral_sender_pubkey": data.ephemeral_sender_pubkey
    }
    return {"status": "ok"}

@router.get("/fetch/latest")
async def fetch_latest(recipient_id: str):
    if recipient_id not in messages_db:
        raise HTTPException(status_code=404, detail="No pending payloads")
    return messages_db[recipient_id]
