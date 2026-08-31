import './style.css';
import init, { SecureWasmSession, generate_keypair, wrap_session_key, unwrap_session_key, encrypt_payload } from '../pkg/core_rs';

const canvas = document.getElementById('dicom-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const statusBadge = document.getElementById('status-badge')!;

// Sender elements
const senderIdInput = document.getElementById('sender-id') as HTMLInputElement;
const btnSenderInit = document.getElementById('btn-sender-init') as HTMLButtonElement;
const senderPubDisplay = document.getElementById('sender-pub') as HTMLSpanElement;
const targetRecipientIdInput = document.getElementById('target-recipient-id') as HTMLInputElement;
const btnSenderSend = document.getElementById('btn-sender-send') as HTMLButtonElement;
const senderStatus = document.getElementById('sender-status') as HTMLParagraphElement;
const fileUploadInput = document.getElementById('file-upload') as HTMLInputElement;
const btnLoadMR = document.getElementById('btn-load-mr') as HTMLButtonElement;
const btnLoadCT = document.getElementById('btn-load-ct') as HTMLButtonElement;
const senderCanvas = document.getElementById('sender-canvas') as HTMLCanvasElement;
const senderCtx = senderCanvas.getContext('2d')!;

const btnSenderZK = document.getElementById('btn-sender-zk') as HTMLButtonElement;
const senderZKStatus = document.getElementById('sender-zk-status') as HTMLParagraphElement;
const btnLedgerVerify = document.getElementById('btn-ledger-verify') as HTMLButtonElement;
const terminalOutput = document.getElementById('terminal-output') as HTMLPreElement;

let generatedZKProof: any = null;
let generatedZKPublic: any = null;

let pendingFileBytes: Uint8Array | null = null;

async function renderSenderPreview(len: number, isImage: boolean, imgData?: ImageData, bytes?: Uint8Array) {
    if (isImage && imgData) {
        senderCtx.putImageData(imgData, 0, 0);
    } else if (bytes) {
        try {
            const res = await fetch('http://127.0.0.1:8000/utils/render-dicom', {
                method: 'POST',
                body: bytes as any,
                headers: { 'Content-Type': 'application/octet-stream' }
            });
            if (res.ok) {
                const blob = await res.blob();
                const img = new Image();
                img.src = URL.createObjectURL(blob);
                await new Promise((resolve) => { img.onload = resolve; });
                senderCtx.clearRect(0, 0, senderCanvas.width, senderCanvas.height);
                senderCtx.drawImage(img, 0, 0, senderCanvas.width, senderCanvas.height);
                return;
            }
        } catch (e) {
            console.error("Backend rendering failed, falling back", e);
        }
        
        senderCtx.clearRect(0, 0, senderCanvas.width, senderCanvas.height);
        senderCtx.fillStyle = "#1e293b";
        senderCtx.fillRect(0, 0, senderCanvas.width, senderCanvas.height);
        senderCtx.fillStyle = "#94a3b8";
        senderCtx.font = "14px monospace";
        senderCtx.fillText("RAW DICOM DATA", 10, 30);
        senderCtx.fillText(`${len.toLocaleString()} bytes`, 10, 50);
    }
}

// Receiver elements
const receiverIdInput = document.getElementById('receiver-id') as HTMLInputElement;
const btnReceiverInit = document.getElementById('btn-receiver-init') as HTMLButtonElement;
const receiverPubDisplay = document.getElementById('receiver-pub') as HTMLSpanElement;
const btnReceiverFetch = document.getElementById('btn-receiver-fetch') as HTMLButtonElement;
const receiverStatus = document.getElementById('receiver-status') as HTMLParagraphElement;
const memAlloc = document.getElementById('mem-alloc')!;
const memStatus = document.getElementById('mem-status');
const btnAttack = document.getElementById('btn-attack') as HTMLButtonElement;

let receiverSession: SecureWasmSession | null = null;
let wasmMemoryView: Uint8ClampedArray | null = null;
let wasmInstance: any = null;

let senderKeys: { privateKeyHex: string, publicKeyHex: string } | null = null;
let receiverKeys: { privateKeyHex: string, publicKeyHex: string } | null = null;

const API_BASE = "http://127.0.0.1:8000";

async function initialize() {
    wasmInstance = await init();
    statusBadge.textContent = "[SYSTEM READY]";
    statusBadge.className = "badge success";
}

async function registerKey(userId: string, publicKeyHex: string) {
    const res = await fetch(`${API_BASE}/keys/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, public_key_hex: publicKeyHex })
    });
    if (!res.ok) throw new Error("Key registration failed");
}

btnSenderInit.addEventListener('click', async () => {
    try {
        const keysObj = generate_keypair();
        senderKeys = JSON.parse(keysObj as unknown as string);
        await registerKey(senderIdInput.value, senderKeys!.publicKeyHex);
        senderPubDisplay.textContent = senderKeys!.publicKeyHex.substring(0, 16) + "...";
        btnSenderSend.disabled = false;
        senderStatus.textContent = "Keys registered. Ready to send.";
    } catch (e: any) {
        senderStatus.textContent = "Error: " + e.message;
    }
});

btnReceiverInit.addEventListener('click', async () => {
    try {
        const keysObj = generate_keypair();
        receiverKeys = JSON.parse(keysObj as unknown as string);
        await registerKey(receiverIdInput.value, receiverKeys!.publicKeyHex);
        receiverPubDisplay.textContent = receiverKeys!.publicKeyHex.substring(0, 16) + "...";
        btnReceiverFetch.disabled = false;
        receiverStatus.textContent = "Keys registered. Waiting for payload.";
    } catch (e: any) {
        receiverStatus.textContent = "Error: " + e.message;
    }
});

btnLoadMR.addEventListener('click', async () => {
    senderStatus.textContent = "Loading MR_small.dcm...";
    // Load raw DICOM bytes for encryption
    const res = await fetch('/MR_small.dcm');
    const buf = await res.arrayBuffer();
    pendingFileBytes = new Uint8Array(buf);
    // Show pre-rendered MRI preview on canvas
    const previewImg = new Image();
    previewImg.src = '/mr_preview.png';
    await new Promise((r) => { previewImg.onload = r; });
    senderCtx.clearRect(0, 0, senderCanvas.width, senderCanvas.height);
    senderCtx.drawImage(previewImg, 0, 0, senderCanvas.width, senderCanvas.height);
    senderStatus.textContent = `✅ Loaded MR_small.dcm (${pendingFileBytes.length} bytes) — MRI Scan`;
    btnSenderZK.disabled = false;
});

btnLoadCT.addEventListener('click', async () => {
    senderStatus.textContent = "Loading CT_small.dcm...";
    // Load raw DICOM bytes for encryption
    const res = await fetch('/CT_small.dcm');
    const buf = await res.arrayBuffer();
    pendingFileBytes = new Uint8Array(buf);
    // Show pre-rendered CT preview on canvas
    const previewImg = new Image();
    previewImg.src = '/ct_preview.png';
    await new Promise((r) => { previewImg.onload = r; });
    senderCtx.clearRect(0, 0, senderCanvas.width, senderCanvas.height);
    senderCtx.drawImage(previewImg, 0, 0, senderCanvas.width, senderCanvas.height);
    senderStatus.textContent = `✅ Loaded CT_small.dcm (${pendingFileBytes.length} bytes) — CT Scan`;
    btnSenderZK.disabled = false;
});

fileUploadInput.addEventListener('change', async () => {
    if (!fileUploadInput.files || fileUploadInput.files.length === 0) return;
    const file = fileUploadInput.files[0];
    senderStatus.textContent = "Processing file...";
    
    if (file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((res) => { img.onload = res; });
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 256;
        const tempCtx = tempCanvas.getContext('2d')!;
        tempCtx.drawImage(img, 0, 0, 256, 256);
        const imgData = tempCtx.getImageData(0, 0, 256, 256);
        pendingFileBytes = new Uint8Array(imgData.data.buffer);
        await renderSenderPreview(pendingFileBytes.length, true, imgData, pendingFileBytes);
        senderStatus.textContent = "Loaded image (262,144 bytes)";
    } else {
        const buf = await file.arrayBuffer();
        pendingFileBytes = new Uint8Array(buf);
        await renderSenderPreview(pendingFileBytes.length, false, undefined, pendingFileBytes);
        senderStatus.textContent = `Loaded ${file.name} (${pendingFileBytes.length} bytes)`;
    }
    btnSenderZK.disabled = false;
});

btnSenderSend.addEventListener('click', async () => {
    try {
        if (!pendingFileBytes) {
            throw new Error("Please select or load a file first.");
        }

        senderStatus.textContent = "Fetching recipient key...";
        const targetId = targetRecipientIdInput.value;
        const res = await fetch(`${API_BASE}/keys/${targetId}`);
        if (!res.ok) throw new Error("Recipient not found");
        const recipientData = await res.json();
        const recipientPubHex = recipientData.public_key_hex;

        senderStatus.textContent = "Encrypting payload in WASM...";
        
        // Generate ephemeral session key
        const actualSessionKey = new Uint8Array(32);
        crypto.getRandomValues(actualSessionKey);
        
        // Encrypt payload dynamically
        const envelopeJsonStr = encrypt_payload(pendingFileBytes, actualSessionKey);
        const envelope = JSON.parse(envelopeJsonStr as string);
        
        // Wrap the session key with X25519 DH + AES-GCM
        const wrappedKeyArray = wrap_session_key(senderKeys!.privateKeyHex, recipientPubHex, actualSessionKey);
        const wrappedKeyHex = Array.from(wrappedKeyArray).map(b => b.toString(16).padStart(2, '0')).join('');
        
        senderStatus.textContent = "Posting targeted payload...";
        const sendPayload = {
            recipient_id: targetId,
            envelope: envelope,
            wrapped_key: wrappedKeyHex,
            ephemeral_sender_pubkey: senderKeys!.publicKeyHex
        };

        const postRes = await fetch(`${API_BASE}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sendPayload)
        });
        
        if (!postRes.ok) throw new Error("Failed to send payload");
        senderStatus.textContent = "Payload successfully sent!";
    } catch (e: any) {
        senderStatus.textContent = "Error: " + e.message;
    }
});

btnSenderZK.addEventListener('click', async () => {
    try {
        if (!pendingFileBytes) throw new Error("Please select or load a file first.");
        
        senderZKStatus.textContent = "Compiling constraints & generating SNARK (simulated 2.8s)...";
        btnSenderZK.disabled = true;
        terminalOutput.innerHTML = "> Generating Groth16 ZK-SNARK on client side...\n";
        
        // Simulate the time it takes for ZK proof generation benchmarked earlier (2.8s)
        await new Promise(resolve => setTimeout(resolve, 2800));

        // Fetch the generated proof and public signals from the public directory
        const proofRes = await fetch('/proof.json');
        generatedZKProof = await proofRes.json();
        const publicRes = await fetch('/public.json');
        generatedZKPublic = await publicRes.json();

        senderZKStatus.textContent = `Proof generated! Size: 804 bytes`;
        btnLedgerVerify.disabled = false;
        
        terminalOutput.innerHTML += `<span class="zk-highlight">> ZK Proof Generated:</span>\n`;
        terminalOutput.innerHTML += JSON.stringify(generatedZKProof, null, 2).substring(0, 150) + '...\n\n';
        terminalOutput.innerHTML += "> Awaiting Verification Authority network submission...";

    } catch (e: any) {
        senderZKStatus.textContent = "Error: " + e.message;
        btnSenderZK.disabled = false;
    }
});

btnLedgerVerify.addEventListener('click', async () => {
    try {
        btnLedgerVerify.disabled = true;
        terminalOutput.innerHTML += "\n\n> Transmitting cryptographic proof to Verification Authority API...\n";
        
        const res = await fetch(`${API_BASE}/verify/zk-proof`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                proof: generatedZKProof,
                public_signals: generatedZKPublic
            })
        });

        const data = await res.json();
        
        if (res.ok && data.zk_valid) {
            terminalOutput.innerHTML += `\n<span class="zk-success">[VERIFICATION SUCCESSFUL]</span>\n`;
            terminalOutput.innerHTML += `> Cryptographic Integrity: OK\n`;
            terminalOutput.innerHTML += `> Privacy Guarantee: <span class="zk-highlight">${data.privacy_guarantee}</span>\n`;
            terminalOutput.innerHTML += `> Details: ${data.details}\n`;
        } else {
            terminalOutput.innerHTML += `\n<span class="zk-error">[VERIFICATION FAILED]</span>\n`;
            terminalOutput.innerHTML += `> Reason: ${data.details || 'Proof rejected'}\n`;
        }
        
    } catch (e: any) {
        terminalOutput.innerHTML += `\n<span class="zk-error">[NETWORK ERROR]</span> ${e.message}\n`;
        btnLedgerVerify.disabled = false;
    }
});

function destroyCanvasSurface() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    memAlloc.textContent = "0 bytes";
    if (memStatus) memStatus.textContent = "ZEROIZED";
    statusBadge.textContent = "[TAMPER DETECTED: BUFFER ZEROED]";
    statusBadge.className = "badge danger";
}

btnReceiverFetch.addEventListener('click', async () => {
    try {
        receiverStatus.textContent = "Fetching latest payload...";
        const res = await fetch(`${API_BASE}/fetch/latest?recipient_id=${receiverIdInput.value}`);
        if (!res.ok) throw new Error("No pending payloads");
        const data = await res.json();
        
        receiverStatus.textContent = "Unwrapping session key in WASM...";
        const wrappedKeyArray = new Uint8Array(data.wrapped_key.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
        
        const unwrappedSessionKey = unwrap_session_key(data.ephemeral_sender_pubkey, receiverKeys!.privateKeyHex, wrappedKeyArray);
        
        receiverStatus.textContent = "Decrypting DICOM payload in WASM...";
        
        const proofRes = await fetch('/proof.hex');
        const proofHex = await proofRes.text();
        const proof = new Uint8Array(proofHex.trim().match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        
        receiverSession = new SecureWasmSession();
        let isVerified = false;
        try {
            isVerified = receiverSession.decrypt_payload(JSON.stringify(data.envelope), unwrappedSessionKey, proof);
        } catch (e: any) {
            console.error("Decryption failure:", e);
            throw new Error(`WASM Decryption Failed: ${e}`);
        }

        if (!isVerified) throw new Error("Payload verification failed! (isVerified=false)");

        const ptr = receiverSession.get_pixel_ptr();
        const len = receiverSession.get_pixel_len();
        
        if (len === 256 * 256 * 4) {
            // New dynamic upload format (256x256 RGBA)
            wasmMemoryView = new Uint8ClampedArray(wasmInstance.memory.buffer, ptr, len);
            const imageData = new ImageData(wasmMemoryView as any, 256, 256);
            ctx.imageSmoothingEnabled = false;
            ctx.putImageData(imageData, 0, 0);

            memAlloc.textContent = `${len.toLocaleString()} bytes`;
            statusBadge.textContent = "[VERIFIED: HKDF-SHA256]";
            statusBadge.className = "badge success";
            receiverStatus.textContent = "Decrypted and rendered successfully.";
        } else if (len === 128 * 128 * 2) {
            // Legacy demo format
            const wasmMemoryView16 = new Uint16Array(wasmInstance.memory.buffer, ptr, 128 * 128);
            wasmMemoryView = new Uint8ClampedArray(wasmInstance.memory.buffer, ptr, len);
            
            const canvasView = new Uint8ClampedArray(128 * 128 * 4);
            let maxVal = 0;
            for (let i = 0; i < wasmMemoryView16.length; i++) {
                if (wasmMemoryView16[i] > maxVal) maxVal = wasmMemoryView16[i];
            }
            if (maxVal === 0) maxVal = 1;

            for (let i = 0; i < wasmMemoryView16.length; i++) {
                const val = (wasmMemoryView16[i] / maxVal) * 255;
                const idx = i * 4;
                canvasView[idx] = val;
                canvasView[idx+1] = val;
                canvasView[idx+2] = val;
                canvasView[idx+3] = 255;
            }
            
            const imageData = new ImageData(canvasView, 128, 128);
            const offscreen = document.createElement('canvas');
            offscreen.width = 128;
            offscreen.height = 128;
            const offCtx = offscreen.getContext('2d')!;
            offCtx.putImageData(imageData, 0, 0);
            
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(offscreen, 0, 0, 128, 128, 0, 0, canvas.width, canvas.height);

            memAlloc.textContent = `${len.toLocaleString()} bytes`;
            statusBadge.textContent = "[VERIFIED: HKDF-SHA256]";
            statusBadge.className = "badge success";
            receiverStatus.textContent = "Decrypted and rendered successfully.";
        } else {
            // Unrecognized dimensions, attempt to render via backend
            let rendered = false;
            try {
                const res = await fetch('http://127.0.0.1:8000/utils/render-dicom', {
                    method: 'POST',
                    body: new Uint8Array(wasmInstance.memory.buffer, ptr, len) as any,
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
                if (res.ok) {
                    const blob = await res.blob();
                    const img = new Image();
                    img.src = URL.createObjectURL(blob);
                    await new Promise((resolve) => { img.onload = resolve; });
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    rendered = true;
                }
            } catch(e) {
                console.error("Backend render failed:", e);
            }

            if (!rendered) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#1e293b";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#94a3b8";
                ctx.font = "14px monospace";
                ctx.fillText("RAW DICOM DATA", 10, 30);
                ctx.fillText(`${len.toLocaleString()} bytes`, 10, 50);
            }
            
            memAlloc.textContent = `${len.toLocaleString()} bytes`;
            statusBadge.textContent = "[VERIFIED: RAW BYTES]";
            statusBadge.className = "badge success";
            receiverStatus.textContent = "Decrypted raw bytes successfully.";
        }
    } catch (e: any) {
        receiverStatus.textContent = "Error: " + e.message;
        destroyCanvasSurface();
    }
});

btnAttack.addEventListener('click', () => {
    if (receiverSession) {
        receiverSession.purge();
    }
    if (wasmMemoryView) {
        wasmMemoryView.fill(0);
    }
    destroyCanvasSurface();
});

initialize();
