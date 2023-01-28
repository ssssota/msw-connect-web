import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
	await page.goto("http://localhost:5173/");
	await page.getByRole("button", { name: "say" }).click();
	await expect(page.getByRole("log")).toHaveText("Test");
});
