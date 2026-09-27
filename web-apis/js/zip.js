/* ZIP builder (método STORE, sin compresión) en JS puro. Sin dependencias.
 * Expone `Zip` como global en el navegador y como `module.exports` en Node.
 *
 * Solo necesita un array de entradas { path, data(Uint8Array) } y devuelve
 * un Uint8Array con un .zip válido, de modo que el portal puede empaquetar
 * cada API en el cliente, sin backend.
 */
(function (global) {
    "use strict";

    const CRC_TABLE = (function () {
        const table = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) {
                c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            }
            table[n] = c >>> 0;
        }
        return table;
    })();

    function crc32(bytes) {
        let c = 0xFFFFFFFF;
        for (let i = 0; i < bytes.length; i++) {
            c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
        }
        return (c ^ 0xFFFFFFFF) >>> 0;
    }

    function dosDateTime(d) {
        const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
        const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
        return { time, date };
    }

    /**
     * @param {{path: string, data: Uint8Array}[]} entries
     * @returns {Uint8Array}
     */
    function buildZip(entries) {
        const encoder = new TextEncoder();
        const now = new Date();
        const { time, date } = dosDateTime(now);
        const sorted = entries.slice().sort((a, b) => (a.path < b.path ? -1 : 1));

        const local = [];
        const central = [];
        let offset = 0;

        for (const entry of sorted) {
            const name = encoder.encode(entry.path);
            const data = entry.data;
            const crc = crc32(data);
            const size = data.length;

            // Local file header (30 bytes)
            const lh = new Uint8Array(30);
            const lv = new DataView(lh.buffer);
            lv.setUint32(0, 0x04034b50, true);   // firma
            lv.setUint16(4, 20, true);           // versión necesaria
            lv.setUint16(6, 0x0800, true);       // flags: nombres UTF-8
            lv.setUint16(8, 0, true);            // método: store
            lv.setUint16(10, time, true);
            lv.setUint16(12, date, true);
            lv.setUint32(14, crc, true);
            lv.setUint32(18, size, true);
            lv.setUint32(22, size, true);
            lv.setUint16(26, name.length, true);
            lv.setUint16(28, 0, true);           // extra length
            local.push(lh, name, data);

            // Central directory header (46 bytes)
            const ch = new Uint8Array(46);
            const cv = new DataView(ch.buffer);
            cv.setUint32(0, 0x02014b50, true);
            cv.setUint16(4, 20, true);           // version made by
            cv.setUint16(6, 20, true);           // version needed
            cv.setUint16(8, 0x0800, true);       // UTF-8
            cv.setUint16(10, 0, true);           // método
            cv.setUint16(12, time, true);
            cv.setUint16(14, date, true);
            cv.setUint32(16, crc, true);
            cv.setUint32(20, size, true);
            cv.setUint32(24, size, true);
            cv.setUint16(28, name.length, true);
            cv.setUint32(38, 0, true);           // atributos externos
            cv.setUint32(42, offset, true);      // offset del local header
            central.push(ch, name);

            offset += 30 + name.length + size;
        }

        let centralSize = 0;
        for (const part of central) centralSize += part.length;

        // End of central directory (22 bytes)
        const end = new Uint8Array(22);
        const ev = new DataView(end.buffer);
        ev.setUint32(0, 0x06054b50, true);
        ev.setUint16(8, sorted.length, true);
        ev.setUint16(10, sorted.length, true);
        ev.setUint32(12, centralSize, true);
        ev.setUint32(16, offset, true);

        const parts = local.concat(central, [end]);
        let total = 0;
        for (const part of parts) total += part.length;

        const out = new Uint8Array(total);
        let pos = 0;
        for (const part of parts) {
            out.set(part, pos);
            pos += part.length;
        }
        return out;
    }

    const Zip = { crc32, buildZip };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = Zip;
    }
    global.Zip = Zip;
})(typeof globalThis !== "undefined" ? globalThis : this);
