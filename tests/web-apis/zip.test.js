import { describe, it, expect } from "vitest";
import "../../web-apis/js/zip.js";

const { crc32, buildZip } = globalThis.Zip;
const encoder = new TextEncoder();

function readU32(bytes, offset) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, true);
}

describe("zip", () => {
    it("crc32 es determinista y coincide con un valor conocido", () => {
        const data = encoder.encode("123456789");
        expect(crc32(data)).toBe(0xcbf43926);
    });

    it("buildZip produce las firmas de local header, central directory y EOCD", () => {
        const bytes = buildZip([
            { path: "api-demo/main.py", data: encoder.encode("print('hola')\n") },
            { path: "api-demo/README.md", data: encoder.encode("# demo\n") },
        ]);

        expect(readU32(bytes, 0)).toBe(0x04034b50);

        let eocdOffset = -1;
        for (let index = bytes.length - 22; index >= 0; index--) {
            if (readU32(bytes, index) === 0x06054b50) {
                eocdOffset = index;
                break;
            }
        }
        expect(eocdOffset).toBeGreaterThanOrEqual(0);

        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        expect(view.getUint16(eocdOffset + 10, true)).toBe(2);

        const centralDirectoryOffset = readU32(bytes, eocdOffset + 16);
        expect(readU32(bytes, centralDirectoryOffset)).toBe(0x02014b50);
    });

    it("buildZip ordena las entradas alfabéticamente", () => {
        const bytes = buildZip([
            { path: "b.txt", data: encoder.encode("b") },
            { path: "a.txt", data: encoder.encode("a") },
        ]);
        const text = new TextDecoder("latin1").decode(bytes);
        expect(text.indexOf("a.txt")).toBeLessThan(text.indexOf("b.txt"));
    });

    it("buildZip es determinista para las mismas entradas", () => {
        const entries = [{ path: "x/main.py", data: encoder.encode("x = 1\n") }];
        expect(Array.from(buildZip(entries))).toEqual(Array.from(buildZip(entries)));
    });
});
