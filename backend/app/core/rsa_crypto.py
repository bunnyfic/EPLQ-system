import base64
import os
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes

# On Render, secret files are placed at the project root as flat filenames
# (private.pem, public.pem). Locally, they live in backend/keys/.
PUBLIC_KEY_PATH = "public.pem" if os.path.exists("public.pem") else "keys/public.pem"
PRIVATE_KEY_PATH = "private.pem" if os.path.exists("private.pem") else "keys/private.pem"

with open(PUBLIC_KEY_PATH, "rb") as f:
    PUBLIC_KEY = serialization.load_pem_public_key(f.read())

with open(PRIVATE_KEY_PATH, "rb") as f:
    PRIVATE_KEY = serialization.load_pem_private_key(f.read(), password=None)

_OAEP = padding.OAEP(
    mgf=padding.MGF1(algorithm=hashes.SHA256()),
    algorithm=hashes.SHA256(),
    label=None,
)


def encrypt_value(value: str) -> str:
    encrypted = PUBLIC_KEY.encrypt(value.encode("utf-8"), _OAEP)
    return base64.b64encode(encrypted).decode("utf-8")


def decrypt_value(encrypted_b64: str) -> str:
    encrypted = base64.b64decode(encrypted_b64)
    decrypted = PRIVATE_KEY.decrypt(encrypted, _OAEP)
    return decrypted.decode("utf-8")
