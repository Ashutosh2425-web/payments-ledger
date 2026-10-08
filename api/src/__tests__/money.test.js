const {
    rupeesToPaise,
    paiseToRupees
} = require("../utils/money");

describe("Money utilities", () => {
    test("converts rupees to paise", () => {
        expect(rupeesToPaise(100)).toBe(10000);
    });

    test("converts rupees with decimal value to paise", () => {
        expect(rupeesToPaise(100.50)).toBe(10050);
    });

    test("converts paise to rupees", () => {
        expect(paiseToRupees(10000)).toBe(100);
    });

    test("converts paise with decimal rupee result", () => {
        expect(paiseToRupees(10050)).toBe(100.5);
    });

    test("rejects zero amount", () => {
        expect(() => rupeesToPaise(0))
            .toThrow("Amount must be greater than zero");
    });

    test("rejects negative amount", () => {
        expect(() => rupeesToPaise(-10))
            .toThrow("Amount must be greater than zero");
    });

    test("rejects more than two decimal places", () => {
        expect(() => rupeesToPaise(100.123))
            .toThrow("Amount can have at most two decimal places");
    });
});