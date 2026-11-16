/**
 * SHA-256 y MD5 sobre texto UTF-8, en JavaScript puro.
 * Los vectores de `tests/web-hashes-contrasenas/` comprueban ambas salidas.
 */

const SHA256_INITIAL = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);

const SHA256_CONSTANTS = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const MD5_SHIFTS = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
];

const MD5_CONSTANTS = new Uint32Array(64);
for (let index = 0; index < 64; index += 1) {
    MD5_CONSTANTS[index] = Math.floor(Math.abs(Math.sin(index + 1)) * 0x100000000) >>> 0;
}

function rotateRight(value, bits) {
    return (value >>> bits) | (value << (32 - bits));
}

function rotateLeft(value, bits) {
    return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function paddedBuffer(bytes) {
    const length = Math.ceil((bytes.length + 9) / 64) * 64;
    const buffer = new Uint8Array(length);
    buffer.set(bytes);
    buffer[bytes.length] = 0x80;
    return buffer;
}

function toHex(value) {
    return (value >>> 0).toString(16).padStart(8, "0");
}

/**
 * Calcula el SHA-256 de un texto UTF-8.
 * @param {string} text
 * @returns {string} 64 caracteres hexadecimales
 */
export function sha256Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const buffer = paddedBuffer(bytes);
    const view = new DataView(buffer.buffer);
    const bitLength = bytes.length * 8;

    view.setUint32(buffer.length - 8, Math.floor(bitLength / 0x100000000), false);
    view.setUint32(buffer.length - 4, bitLength >>> 0, false);

    const schedule = new Uint32Array(64);
    const state = new Uint32Array(SHA256_INITIAL);

    for (let offset = 0; offset < buffer.length; offset += 64) {
        for (let index = 0; index < 16; index += 1) {
            schedule[index] = view.getUint32(offset + index * 4, false);
        }

        for (let index = 16; index < 64; index += 1) {
            const previous = schedule[index - 15];
            const recent = schedule[index - 2];
            const sigma0 = rotateRight(previous, 7) ^ rotateRight(previous, 18) ^ (previous >>> 3);
            const sigma1 = rotateRight(recent, 17) ^ rotateRight(recent, 19) ^ (recent >>> 10);
            schedule[index] = (schedule[index - 16] + sigma0 + schedule[index - 7] + sigma1) >>> 0;
        }

        let a = state[0];
        let b = state[1];
        let c = state[2];
        let d = state[3];
        let e = state[4];
        let f = state[5];
        let g = state[6];
        let h = state[7];

        for (let index = 0; index < 64; index += 1) {
            const bigSigma1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
            const choose = (e & f) ^ (~e & g);
            const temp1 =
                (h + bigSigma1 + choose + SHA256_CONSTANTS[index] + schedule[index]) >>> 0;
            const bigSigma0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
            const majority = (a & b) ^ (a & c) ^ (b & c);
            const temp2 = (bigSigma0 + majority) >>> 0;

            h = g;
            g = f;
            f = e;
            e = (d + temp1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (temp1 + temp2) >>> 0;
        }

        state[0] = (state[0] + a) >>> 0;
        state[1] = (state[1] + b) >>> 0;
        state[2] = (state[2] + c) >>> 0;
        state[3] = (state[3] + d) >>> 0;
        state[4] = (state[4] + e) >>> 0;
        state[5] = (state[5] + f) >>> 0;
        state[6] = (state[6] + g) >>> 0;
        state[7] = (state[7] + h) >>> 0;
    }

    return Array.from(state, toHex).join("");
}

function md5WordToHex(word) {
    return [0, 8, 16, 24]
        .map((shift) => ((word >>> shift) & 0xff).toString(16).padStart(2, "0"))
        .join("");
}

/**
 * Calcula el MD5 de un texto UTF-8.
 * @param {string} text
 * @returns {string} 32 caracteres hexadecimales
 */
export function md5Hex(text) {
    const bytes = new TextEncoder().encode(text);
    const buffer = paddedBuffer(bytes);
    const view = new DataView(buffer.buffer);
    const bitLength = bytes.length * 8;

    view.setUint32(buffer.length - 8, bitLength >>> 0, true);
    view.setUint32(buffer.length - 4, Math.floor(bytes.length / 0x20000000), true);

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    const words = new Uint32Array(16);

    for (let offset = 0; offset < buffer.length; offset += 64) {
        for (let index = 0; index < 16; index += 1) {
            words[index] = view.getUint32(offset + index * 4, true);
        }

        let a = a0;
        let b = b0;
        let c = c0;
        let d = d0;

        for (let index = 0; index < 64; index += 1) {
            let mix;
            let wordIndex;

            if (index < 16) {
                mix = (b & c) | (~b & d);
                wordIndex = index;
            } else if (index < 32) {
                mix = (d & b) | (~d & c);
                wordIndex = (5 * index + 1) % 16;
            } else if (index < 48) {
                mix = b ^ c ^ d;
                wordIndex = (3 * index + 5) % 16;
            } else {
                mix = c ^ (b | ~d);
                wordIndex = (7 * index) % 16;
            }

            const sum = (a + mix + MD5_CONSTANTS[index] + words[wordIndex]) >>> 0;
            a = d;
            d = c;
            c = b;
            b = (b + rotateLeft(sum, MD5_SHIFTS[index])) >>> 0;
        }

        a0 = (a0 + a) >>> 0;
        b0 = (b0 + b) >>> 0;
        c0 = (c0 + c) >>> 0;
        d0 = (d0 + d) >>> 0;
    }

    return [a0, b0, c0, d0].map(md5WordToHex).join("");
}

/**
 * Devuelve ambas huellas de un texto.
 * @param {string} text
 * @returns {{sha256: string, md5: string}}
 */
export function hashTexts(text) {
    return {
        sha256: sha256Hex(text),
        md5: md5Hex(text),
    };
}
