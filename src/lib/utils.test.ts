import { describe, expect, it } from "vitest";
import { cn } from "./utils.ts";

describe("cn", () => {
	it("should merge class names", () => {
		expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
	});

	it("should handle conditional class names", () => {
		expect(cn("bg-red-500", true && "text-white", false && "hidden")).toBe(
			"bg-red-500 text-white",
		);
	});

	it("should handle object inputs", () => {
		expect(cn({ "bg-red-500": true, "text-white": false })).toBe("bg-red-500");
	});

	it("should handle array inputs", () => {
		expect(cn(["bg-red-500", "text-white"])).toBe("bg-red-500 text-white");
	});

	it("should merge tailwind classes correctly", () => {
		// This test depends on tailwind-merge being functional
		expect(cn("px-2 py-2", "p-4")).toBe("p-4");
	});

	it("should handle empty inputs", () => {
		expect(cn()).toBe("");
		expect(cn(undefined, null, false, "")).toBe("");
	});

	it("should handle nested arrays", () => {
		expect(cn(["bg-red-500", ["text-white", "font-bold"]])).toBe(
			"bg-red-500 text-white font-bold",
		);
	});
});
