import { describe, expect, test } from "vitest";
import { pageNumbers, paginate, PER_PAGE } from "../../web-javarcises/js/pagination.js";

describe("pagination", () => {
    test("slices the list by page", () => {
        const list = Array.from({ length: 81 }, (_, index) => index + 1);
        const first = paginate(list, 1);
        expect(first.items).toHaveLength(PER_PAGE);
        expect(first.page).toBe(1);
        expect(first.totalPages).toBe(7);
        expect(first.from).toBe(1);
        expect(first.to).toBe(12);
        expect(first.total).toBe(81);

        const last = paginate(list, 7);
        expect(last.items).toHaveLength(9);
        expect(last.from).toBe(73);
        expect(last.to).toBe(81);
    });

    test("clamps out-of-range pages", () => {
        const list = Array.from({ length: 10 }, (_, index) => index + 1);
        expect(paginate(list, 0).page).toBe(1);
        expect(paginate(list, 99).page).toBe(1);
    });

    test("handles an empty list", () => {
        const result = paginate([], 1);
        expect(result.items).toHaveLength(0);
        expect(result.totalPages).toBe(1);
        expect(result.from).toBe(0);
        expect(result.to).toBe(0);
    });

    test("shows every page when there are few", () => {
        const sequence = pageNumbers(4, 7);
        expect(sequence.map((entry) => (entry.type === "ellipsis" ? "…" : entry.number))).toEqual([
            1, 2, 3, 4, 5, 6, 7,
        ]);
    });

    test("uses ellipses for long ranges", () => {
        const sequence = pageNumbers(10, 20);
        expect(sequence.map((entry) => (entry.type === "ellipsis" ? "…" : entry.number))).toEqual([
            1,
            "…",
            9,
            10,
            11,
            "…",
            20,
        ]);
    });

    test("always includes the first and last page", () => {
        const sequence = pageNumbers(1, 20);
        const numbers = sequence
            .filter((entry) => entry.type === "page")
            .map((entry) => entry.number);
        expect(numbers[0]).toBe(1);
        expect(numbers[numbers.length - 1]).toBe(20);
    });
});
