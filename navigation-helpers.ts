import { expect, Page } from "@playwright/test";
import { links } from "./globals";

async function navigateToPage(page: Page, url: string) {
    await page.goto(url)
    await page.waitForURL(url)
    await page.waitForLoadState('networkidle')

    // Assertion to check if the current URL matches the expected URL
    await expect(page).toHaveURL(url);
}

async function navigateToLoginPage(page: Page, link = links.braindate.loginpage) {
    await navigateToPage(page, links.braindate.loginpage)
}
export {
    navigateToPage,
    navigateToLoginPage
}