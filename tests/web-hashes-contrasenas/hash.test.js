import { describe, expect, test } from "vitest";
import { hashTexts, md5Hex, sha256Hex } from "../../web-hashes-contrasenas/js/modules/hash.js";

describe("SHA-256", () => {
    test("coincide con los vectores de referencia", () => {
        expect(sha256Hex("")).toBe(
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
        expect(sha256Hex("abc")).toBe(
            "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
        );
        expect(sha256Hex("The quick brown fox jumps over the lazy dog")).toBe(
            "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592"
        );
    });

    test("procesa UTF-8 y bloques de varios tamaños", () => {
        expect(sha256Hex("ñ")).toBe(
            "024bb90888ca89a15a19e9bdd8c712bfb070465fce1ef25e43c170ea44fc5e5f"
        );
        expect(sha256Hex("🌍")).toBe(
            "8cba3282fe37fa6054ce64531ce17410a1404e2bc4afbf113824097037b1e498"
        );
        expect(sha256Hex("a".repeat(56))).toBe(
            "b35439a4ac6f0948b6d6f9e3c6af0f5f590ce20f1bde7090ef7970686ec6738a"
        );
        expect(sha256Hex("a".repeat(1000))).toBe(
            "41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3"
        );
    });
});

describe("MD5", () => {
    test("coincide con los vectores de referencia", () => {
        expect(md5Hex("")).toBe("d41d8cd98f00b204e9800998ecf8427e");
        expect(md5Hex("abc")).toBe("900150983cd24fb0d6963f7d28e17f72");
        expect(md5Hex("The quick brown fox jumps over the lazy dog")).toBe(
            "9e107d9d372bb6826bd81d3542a419d6"
        );
    });

    test("procesa UTF-8 y bloques de varios tamaños", () => {
        expect(md5Hex("ñ")).toBe("94e9342ecbb1458b6043ecd3bfcbc192");
        expect(md5Hex("🌍")).toBe("b60e8108aa184f9f8cfd1e6afb44ad8b");
        expect(md5Hex("a".repeat(56))).toBe("3b0c8ac703f828b04c6c197006d17218");
        expect(md5Hex("a".repeat(1000))).toBe("cabe45dcc9ae5b66ba86600cca6b8ba8");
    });
});

describe("hashTexts", () => {
    test("devuelve ambas huellas del mismo texto", () => {
        expect(hashTexts("Bóveda local · 2026")).toEqual({
            sha256: "f29f6c766f621c73167200933fc118d707a80e2f9ecb903bfb1227b9249a447a",
            md5: "3261e75e80fb2c2959754bf0e32734e6",
        });
    });
});
