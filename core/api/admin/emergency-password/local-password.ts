/**
 * Local Master Password Generator
 *
 * Client-side generation of 8-digit master passwords for offline booth recovery.
 * Uses PBKDF2-SHA256 and HMAC-SHA256 algorithms.
 *
 * Algorithm:
 * 1. privateKey = PBKDF2(baseSecret + macAddress, salt, 100000 iterations, 32 bytes)
 * 2. nonce = random 4-digit number (0000-9999)
 * 3. hmac = HMAC-SHA256(privateKey, nonce + macAddress)
 * 4. code = hmac as uint32 % 10000
 * 5. password = nonce + code (both zero-padded to 4 digits)
 */

const SALT = "PhotoBoothX.MasterPassword.v1";
const ITERATIONS = 100000;
const KEY_LENGTH = 32; // 256 bits

/**
 * Convert ArrayBuffer to hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Convert string to Uint8Array
 */
function stringToBuffer(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Normalize MAC address to uppercase with colons
 * Accepts formats: AA:BB:CC:DD:EE:FF, AA-BB-CC-DD-EE-FF, AABBCCDDEEFF
 */
export function normalizeMacAddress(mac: string): string {
  // Remove all separators and convert to uppercase
  const cleaned = mac.replace(/[:\-\s]/g, "").toUpperCase();

  // Validate length
  if (cleaned.length !== 12 || !/^[0-9A-F]+$/.test(cleaned)) {
    throw new Error("Invalid MAC address format");
  }

  // Format with colons
  return cleaned.match(/.{2}/g)!.join(":");
}

/**
 * Validate base secret meets minimum requirements
 */
export function validateBaseSecret(secret: string): boolean {
  return secret.length >= 32;
}

/**
 * Derive private key using PBKDF2-SHA256
 */
async function derivePrivateKey(
  baseSecret: string,
  macAddress: string
): Promise<CryptoKey> {
  const password = stringToBuffer(baseSecret + macAddress);
  const salt = stringToBuffer(SALT);

  // Import the password as a key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    password,
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive the key using PBKDF2
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: KEY_LENGTH * 8 },
    true,
    ["sign"]
  );
}

/**
 * Generate HMAC-SHA256
 */
async function generateHmac(key: CryptoKey, message: string): Promise<ArrayBuffer> {
  const data = stringToBuffer(message);
  return crypto.subtle.sign("HMAC", key, data);
}

/**
 * Generate a random 4-digit nonce
 */
function generateNonce(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const nonce = array[0] % 10000;
  return nonce.toString().padStart(4, "0");
}

/**
 * Extract 4-digit code from HMAC
 */
function extractCode(hmacBuffer: ArrayBuffer): string {
  const view = new DataView(hmacBuffer);
  // Use first 4 bytes as uint32 and take modulo 10000
  const uint32 = view.getUint32(0, false); // big-endian
  const code = uint32 % 10000;
  return code.toString().padStart(4, "0");
}

/**
 * Generate a local master password
 *
 * @param baseSecret - The base secret configured during booth setup (32+ chars)
 * @param macAddress - The booth's MAC address
 * @returns 8-digit password string
 *
 * @example
 * const password = await generateLocalMasterPassword(
 *   "my-super-secret-base-key-that-is-long",
 *   "AA:BB:CC:DD:EE:FF"
 * );
 * // Returns something like "12347891"
 */
export async function generateLocalMasterPassword(
  baseSecret: string,
  macAddress: string
): Promise<{ password: string; nonce: string; code: string }> {
  // Validate inputs
  if (!validateBaseSecret(baseSecret)) {
    throw new Error("Base secret must be at least 32 characters");
  }

  // Normalize MAC address
  const normalizedMac = normalizeMacAddress(macAddress);

  // Derive the private key
  const privateKey = await derivePrivateKey(baseSecret, normalizedMac);

  // Generate random nonce
  const nonce = generateNonce();

  // Generate HMAC
  const hmacBuffer = await generateHmac(privateKey, nonce + normalizedMac);

  // Extract 4-digit code
  const code = extractCode(hmacBuffer);

  // Combine nonce and code
  const password = nonce + code;

  return { password, nonce, code };
}

/**
 * Verify a local master password (for testing purposes)
 *
 * @param password - The 8-digit password to verify
 * @param baseSecret - The base secret
 * @param macAddress - The booth's MAC address
 * @returns true if password is valid
 */
export async function verifyLocalMasterPassword(
  password: string,
  baseSecret: string,
  macAddress: string
): Promise<boolean> {
  if (password.length !== 8 || !/^\d{8}$/.test(password)) {
    return false;
  }

  const nonce = password.slice(0, 4);
  const providedCode = password.slice(4, 8);

  try {
    const normalizedMac = normalizeMacAddress(macAddress);
    const privateKey = await derivePrivateKey(baseSecret, normalizedMac);
    const hmacBuffer = await generateHmac(privateKey, nonce + normalizedMac);
    const expectedCode = extractCode(hmacBuffer);

    return providedCode === expectedCode;
  } catch {
    return false;
  }
}
