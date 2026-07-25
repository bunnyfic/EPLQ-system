import base64
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization, hashes

with open("keys/public.pem", "rb") as f:
    PUBLIC_KEY = serialization.load_pem_public_key(f.read())

with open("keys/private.pem", "rb") as f:
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