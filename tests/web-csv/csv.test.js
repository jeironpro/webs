import { describe, expect, test } from "vitest";
import {
    detectDelimiter,
    filterRows,
    paginateRows,
    parseCsv,
    sortRows,
    toCsv,
} from "../../web-csv/js/modules/csv.js";

describe("detectDelimiter", () => {
    test("reconoce coma, punto y coma y tabulador", () => {
        expect(detectDelimiter("a,b\n1,2")).toBe(",");
        expect(detectDelimiter("nombre;precio;total\nAna;1,5;2,5")).toBe(";");
        expect(detectDelimiter("a\tb\n1\t2")).toBe("\t");
    });
});

describe("parseCsv", () => {
    test("lee cabeceras y filas simples", () => {
        const result = parseCsv("nombre,ciudad\nAna,Madrid\nLuis,Valencia");
        expect(result.ok).toBe(true);
        expect(result.headers).toEqual(["nombre", "ciudad"]);
        expect(result.rows).toEqual([
            ["Ana", "Madrid"],
            ["Luis", "Valencia"],
        ]);
        expect(result.delimiter).toBe(",");
    });

    test("respeta comas y comillas escapadas dentro de campos", () => {
        const result = parseCsv('nombre,nota\n"Pérez, Ana","Dijo ""hola"""');
        expect(result.rows[0]).toEqual(["Pérez, Ana", 'Dijo "hola"']);
    });

    test("conserva saltos de línea dentro de un campo entrecomillado", () => {
        const result = parseCsv('id,texto\n1,"línea 1\nlínea 2"');
        expect(result.rows[0][1]).toBe("línea 1\nlínea 2");
    });

    test("elimina el BOM y acepta finales CRLF", () => {
        const result = parseCsv("\uFEFFa,b\r\n1,2\r\n");
        expect(result.headers).toEqual(["a", "b"]);
        expect(result.rows).toEqual([["1", "2"]]);
    });

    test("detecta punto y coma sin romper decimales con coma", () => {
        const result = parseCsv("nombre;precio\nAna;1,5");
        expect(result.delimiter).toBe(";");
        expect(result.rows[0]).toEqual(["Ana", "1,5"]);
    });

    test("rellena filas cortas y añade cabeceras para columnas extra", () => {
        const result = parseCsv("a,b\n1\n2,3,4");
        expect(result.headers).toEqual(["a", "b", "Columna 3"]);
        expect(result.rows).toEqual([
            ["1", "", ""],
            ["2", "3", "4"],
        ]);
    });

    test("normaliza cabeceras vacías o duplicadas", () => {
        const result = parseCsv("a,,a\n1,2,3");
        expect(result.headers).toEqual(["a", "Columna 2", "a (2)"]);
    });

    test("rechaza un documento vacío", () => {
        expect(parseCsv(" \n ")).toMatchObject({ ok: false });
        expect(parseCsv("").error).toContain("vacío");
    });

    test("avisa de una comilla sin cerrar sin perder los datos", () => {
        const result = parseCsv('a,b\n"uno,2');
        expect(result.ok).toBe(true);
        expect(result.warning).toContain("comilla");
        expect(result.rows[0]).toEqual(["uno,2", ""]);
    });

    test("descarta líneas en blanco y el salto final", () => {
        const result = parseCsv("a,b\n\n1,2\n\n");
        expect(result.rows).toEqual([["1", "2"]]);
    });
});

describe("filterRows", () => {
    const rows = [
        ["Ana", "Madrid"],
        ["Luis", "Málaga"],
        ["Elena", "Madrid"],
    ];
    const headers = ["nombre", "ciudad"];

    test("busca sin distinguir mayúsculas ni acentos", () => {
        expect(filterRows(rows, headers, { query: "MALAGA" })).toEqual([["Luis", "Málaga"]]);
        expect(filterRows(rows, headers, { query: "ana" })).toEqual([["Ana", "Madrid"]]);
    });

    test("combina filtros de columna", () => {
        expect(filterRows(rows, headers, { filters: ["a", "madrid"] })).toEqual([
            ["Ana", "Madrid"],
            ["Elena", "Madrid"],
        ]);
        expect(filterRows(rows, headers, { filters: ["ana", "valencia"] })).toEqual([]);
    });

    test("sin filtros devuelve todas las filas", () => {
        expect(filterRows(rows, headers, { filters: ["", ""] })).toEqual(rows);
    });
});

describe("sortRows", () => {
    test("ordena números de forma ascendente y descendente", () => {
        const rows = [["10"], ["2"], ["1"]];
        expect(sortRows(rows, 0, "asc")).toEqual([["1"], ["2"], ["10"]]);
        expect(sortRows(rows, 0, "desc")).toEqual([["10"], ["2"], ["1"]]);
    });

    test("ordena texto con números naturales", () => {
        const rows = [["item 10"], ["item 2"], ["item 1"]];
        expect(sortRows(rows, 0)).toEqual([["item 1"], ["item 2"], ["item 10"]]);
    });

    test("deja los valores vacíos al final y mantiene el orden estable", () => {
        const rows = [
            ["b", "1"],
            ["", "2"],
            ["a", "3"],
            ["", "4"],
        ];
        expect(sortRows(rows, 0, "asc").map((row) => row[0])).toEqual(["a", "b", "", ""]);
        expect(sortRows(rows, 0, "desc").map((row) => row[0])).toEqual(["b", "a", "", ""]);
    });
});

describe("toCsv", () => {
    test("escapa comas, comillas y saltos de línea", () => {
        const output = toCsv(
            ["a", "b"],
            [
                ["x,y", 'dijo "hola"'],
                ["línea\n2", ""],
            ]
        );
        expect(output).toBe('a,b\r\n"x,y","dijo ""hola"""\r\n"línea\n2",');
    });

    test("usa el delimitador solicitado", () => {
        expect(toCsv(["a", "b"], [["uno;dos", "tres"]], ";")).toBe('a;b\r\n"uno;dos";tres');
    });
});

describe("paginateRows", () => {
    test("calcula páginas, recorta el índice y limita la página", () => {
        const rows = Array.from({ length: 25 }, (_, index) => [String(index)]);
        const page = paginateRows(rows, 2, 10);
        expect(page.page).toBe(2);
        expect(page.totalPages).toBe(3);
        expect(page.start).toBe(10);
        expect(page.rows).toHaveLength(10);
        expect(paginateRows(rows, 99, 10).page).toBe(3);
        expect(paginateRows([], 5, 25)).toMatchObject({ page: 1, totalPages: 1, rows: [] });
    });
});
