// Tests de la lógica pura de paginación (js/paginacion.js) con node --test.
// Se ejecutan con: npm test

import assert from "node:assert/strict";
import test from "node:test";
import { pageNumbers, paginate, PER_PAGE } from "./paginacion.js";

test("paginate corta la lista por página", () => {
    const list = Array.from({ length: 81 }, (_, i) => i + 1);
    const first = paginate(list, 1);
    assert.equal(first.items.length, PER_PAGE);
    assert.equal(first.page, 1);
    assert.equal(first.totalPages, 7);
    assert.equal(first.from, 1);
    assert.equal(first.to, 12);
    assert.equal(first.total, 81);

    const last = paginate(list, 7);
    assert.equal(last.items.length, 9);
    assert.equal(last.from, 73);
    assert.equal(last.to, 81);
});

test("paginate acota la página fuera de rango", () => {
    const list = Array.from({ length: 10 }, (_, i) => i + 1);
    assert.equal(paginate(list, 0).page, 1);
    assert.equal(paginate(list, 99).page, 1);
});

test("paginate con lista vacía no rompe", () => {
    const result = paginate([], 1);
    assert.equal(result.items.length, 0);
    assert.equal(result.totalPages, 1);
    assert.equal(result.from, 0);
    assert.equal(result.to, 0);
});

test("pageNumbers muestra todas las páginas si hay pocas", () => {
    const sequence = pageNumbers(4, 7);
    assert.deepEqual(
        sequence.map((entry) => (entry.type === "ellipsis" ? "…" : entry.number)),
        [1, 2, 3, 4, 5, 6, 7]
    );
});

test("pageNumbers usa elipsis para rangos largos", () => {
    const sequence = pageNumbers(10, 20);
    assert.deepEqual(
        sequence.map((entry) => (entry.type === "ellipsis" ? "…" : entry.number)),
        [1, "…", 9, 10, 11, "…", 20]
    );
});

test("pageNumbers siempre incluye primera y última página", () => {
    const sequence = pageNumbers(1, 20);
    const numbers = sequence.filter((entry) => entry.type === "page").map((entry) => entry.number);
    assert.equal(numbers[0], 1);
    assert.equal(numbers[numbers.length - 1], 20);
});
