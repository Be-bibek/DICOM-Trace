import fs from 'fs';
import { generate_keypair, wrap_session_key, unwrap_session_key, encrypt_payload, SecureWasmSession } from './pkg/core_rs.js';

try {
    // 1. Generate Sender Keys
    const senderKeys = JSON.parse(generate_keypair());
    console.log("Sender Public Key:", senderKeys.publicKeyHex);

    // 2. Generate Receiver Keys
    const receiverKeys = JSON.parse(generate_keypair());
    console.log("Receiver Public Key:", receiverKeys.publicKeyHex);

    // 3. Fake File Bytes (MRI data)
    const pendingFileBytes = new Uint8Array(256 * 256 * 4);
    pendingFileBytes.fill(128); // dummy image

    // 4. Generate Session Key
    const actualSessionKey = new Uint8Array(32);
    for (let i = 0; i < 32; i++) actualSessionKey[i] = i;

    // 5. Encrypt Payload
    console.log("Encrypting payload...");
    const envelopeJsonStr = encrypt_payload(pendingFileBytes, actualSessionKey);
    const envelope = JSON.parse(envelopeJsonStr);
    
    // 6. Wrap Session Key
    console.log("Wrapping session key...");
    const wrappedKeyArray = wrap_session_key(senderKeys.privateKeyHex, receiverKeys.publicKeyHex, actualSessionKey);

    // 7. Unwrap Session Key
    console.log("Unwrapping session key...");
    const unwrappedSessionKey = unwrap_session_key(senderKeys.publicKeyHex, receiverKeys.privateKeyHex, wrappedKeyArray);
    
    // 8. Decrypt Payload
    console.log("Decrypting payload...");
    const proofHex = fs.readFileSync('./public/proof.hex', 'utf-8');
    const proof = new Uint8Array(proofHex.trim().match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    const receiverSession = new SecureWasmSession();
    let isVerified = receiverSession.decrypt_payload(JSON.stringify(envelope), unwrappedSessionKey, proof);
    
    console.log("Verification result:", isVerified);
    console.log("ALL TESTS PASSED.");
} catch (e) {
    console.error("TEST FAILED:", e);
}
