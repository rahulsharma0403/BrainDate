import { chromium, Page } from "@playwright/test";
import ENV from "./env";

async function getGmailPage(headless: boolean = false): Promise<Page> {
    const browser = await chromium.launch({
        headless,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-infobars',
            '--disable-blink-features=AutomationControlled',
            '--remote-debugging-port=9222',
        ],
    });

    const context = await browser.newContext();
    const gmailPage = await context.newPage();

    // Override navigator.webdriver
    await gmailPage.evaluate(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    });

    return gmailPage;
}

export function getResourcesPath(): string {
    return ENV.RESOURCES_PATH?.toString() || '';
}

export function randomText(length: number): Promise<string> {
    let random = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        random += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return Promise.resolve(random);
}

export {
    getGmailPage
}