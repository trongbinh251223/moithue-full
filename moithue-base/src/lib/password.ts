const ITERATIONS = 120_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;
const PREFIX = 'pbkdf2-sha256';

function b64encodeBytes(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

function b64encode(buf: ArrayBuffer): string {
  return b64encodeBytes(new Uint8Array(buf));
}

function b64decode(s: string): Uint8Array {
  const binary = atob(s);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

export async function hashPassword(plain: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(plain),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_BITS,
  );
  return `${PREFIX}$${ITERATIONS}$${b64encodeBytes(salt)}$${b64encode(bits)}`;
}

export async function verifyPassword(plain: string, stored: string | null): Promise<boolean> {
  if (!stored || !stored.startsWith(PREFIX + '$')) return false;
  const parts = stored.split('$');
  if (parts.length !== 4) return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations) || iterations < 1) return false;
  const salt = b64decode(parts[2]!);
  const expectedB64 = parts[3]!;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(plain),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_BITS,
  );
  return b64encode(bits) === expectedB64;
}
