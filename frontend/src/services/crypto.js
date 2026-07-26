function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN (.*)-----/, "")
    .replace(/-----END (.*)-----/, "")
    .replace(/\s/g, "");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

let privateKeyPromise = null;

function getPrivateKey() {
  if (!privateKeyPromise) {
   const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// inside getPrivateKey():
privateKeyPromise = fetch(`${API_BASE}/keys/private-demo`)
      .then((r) => r.text())
      .then((pem) =>
        crypto.subtle.importKey(
          "pkcs8",
          pemToArrayBuffer(pem),
          { name: "RSA-OAEP", hash: "SHA-256" },
          false,
          ["decrypt"]
        )
      );
  }
  return privateKeyPromise;
}

export async function decryptValue(base64Encrypted) {
  const key = await getPrivateKey();
  const binary = atob(base64Encrypted);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const decrypted = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, bytes.buffer);
  return new TextDecoder().decode(decrypted);
}
