import { expect, test } from "vitest";
import { SayHello } from "../src";

test("check if it says hello", async () => {
	expect(SayHello()).toBe("Hello, World!");
});
