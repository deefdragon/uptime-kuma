const { genSecret } = require("../src/util");

beforeAll(() => {

});

describe("Test genSecret", () => {

    it("should be correct length", () => {
        let secret = genSecret(-1);
        expect(secret).toEqual("");

        secret = genSecret(0);
        expect(secret).toEqual("");

        secret = genSecret(1);
        expect(secret.length).toEqual(1);

        secret = genSecret(2);
        expect(secret.length).toEqual(2);

        secret = genSecret(64);
        expect(secret.length).toEqual(64);

        secret = genSecret(9000);
        expect(secret.length).toEqual(9000);

        secret = genSecret(90000);
        expect(secret.length).toEqual(90000);
    });

    it("should contain first and last possible chars", () => {
        let secret = genSecret(90000);
        expect(secret).toContain("A");
        expect(secret).toContain("9");
    });
});
