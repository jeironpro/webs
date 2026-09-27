"use strict";

const { test } = require("node:test");
const assert = require("node:assert");
const { crc32, buildZip } = require("../js/zip.js");

const enc = new TextEncoder();

function readU32(bytes, off) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(off, true);
}

test("crc32 es determinista y coincide con un valor conocido", () => {
    const data = enc.encode("123456789");
    assert.strictEqual(crc32(data), 0xCBF43926, "CRC-32 de '123456789' debe ser 0xCBF43926");
});

test("buildZip produce un archivo con las firmas de local header, central dir y EOCD", () => {
    const bytes = buildZip([
        { path: "api-demo/main.py", data: enc.encode("print('hola')\n") },
        { path: "api-demo/README.md", data: enc.encode("# demo\n") },
    ]);

    assert.strictEqual(readU32(bytes, 0), 0x04034b50, "firma del local file header");

    // El EOCD (firma 0x06054b50) está al final: busca su offset en los bytes 16..20 del EOCD.
    // Localizamos la firma del EOCD escaneando hacia atrás.
    let eocdOffset = -1;
    for (let i = bytes.length - 22; i >= 0; i--) {
        if (readU32(bytes, i) === 0x06054b50) { eocdOffset = i; break; }
    }
    assert.ok(eocdOffset >= 0, "debe existir el end of central directory");

    const entryCount = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        .getUint16(eocdOffset + 10, true);
    assert.strictEqual(entryCount, 2, "debe registrar 2 entradas");

    const centralDirOffset = readU32(bytes, eocdOffset + 16);
    assert.strictEqual(readU32(bytes, centralDirOffset), 0x02014b50, "firma del central directory header");
});

test("buildZip ordena las entradas alfabéticamente", () => {
    const bytes = buildZip([
        { path: "b.txt", data: enc.encode("b") },
        { path: "a.txt", data: enc.encode("a") },
    ]);
    // El primer local header va seguido del nombre: busca 'a.txt' antes que 'b.txt'.
    const text = new TextDecoder("latin1").decode(bytes);
    assert.ok(text.indexOf("a.txt") < text.indexOf("b.txt"), "a.txt debe aparecer antes que b.txt");
});

test("buildZip es determinista para las mismas entradas", () => {
    const entries = [{ path: "x/main.py", data: enc.encode("x = 1\n") }];
    const first = buildZip(entries);
    const second = buildZip(entries);
    assert.deepStrictEqual(Array.from(first), Array.from(second));
});
