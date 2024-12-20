import { test, expect, chromium, Page } from '@playwright/test';
import { navigateToLoginPage } from '../navigation-helpers';
import { BraindateLoginPage } from '../pages/LoginPage';
import { getGmailPage, randomText } from '../helpers';
import { links } from '../globals';

// Method to check for buttons availability on page
async function assertCommonElementsVisibleAndEnabled(page: Page, loginPage: BraindateLoginPage) {
    await expect(loginPage.continue_with_google_option_button).toBeVisible();
    await expect(loginPage.continue_with_google_option_button).toBeEnabled();

    await expect(loginPage.microsoft_option_button).toBeVisible();
    await expect(loginPage.microsoft_option_button).toBeEnabled();

    await expect(loginPage.slack_option_button).toBeVisible();
    await expect(loginPage.slack_option_button).toBeEnabled();

    await expect(loginPage.mail_me_a_magic_code_option).toBeVisible();
    await expect(loginPage.mail_me_a_magic_code_option).toBeEnabled();

}

test.describe('Login Tests', () => {
    test('Login with username/password', async ({ page }) => {
        await navigateToLoginPage(page)
        let loginPage = await BraindateLoginPage.getInstance(page)
        await expect(page.locator(loginPage.braindate_logo_selector)).toBeVisible(); // Checking for braindate logo
        await expect(loginPage.page_header).toContainText('Welcome to Braindate!')  // Checking for Welcome message on home screen

        await assertCommonElementsVisibleAndEnabled(page, loginPage);
        await expect(loginPage.login_with_password_link).toBeVisible();
        await expect(loginPage.login_with_password_link).toBeEnabled();

        await loginPage.login_with_password_link.click();
        // Validations on the Sign Page
        let usernameTextbox = await page.locator(loginPage.username_textbox_selector)
        let passwordTextbox = await page.locator(loginPage.password_textbox_selector)

        await expect(usernameTextbox).toBeVisible();
        await expect(usernameTextbox).toBeEditable();

        await expect(passwordTextbox).toBeVisible();
        await expect(passwordTextbox).toBeEditable();

        await assertCommonElementsVisibleAndEnabled(page, loginPage);
        await expect(loginPage.login_with_password_link).not.toBeVisible(); //Negative valiadtions
        await expect(loginPage.forgot_password_link).toBeVisible();
        await expect(loginPage.sign_in_button).toBeVisible();

        let username: string = 'qa@example.com'
        await expect(loginPage.wrong_username_Or_password_fieldbox).not.toBeVisible(); //Negative valiadtions
        await usernameTextbox.fill('')   // Checking for null calues
        await expect(usernameTextbox).not.toHaveValue(username)
        await usernameTextbox.fill(username)
        await expect(usernameTextbox).toHaveValue(username)
         
        let randomPassword = await randomText(8)  // Method created to generate randon string in pageobject file LoginPage.ts
        await passwordTextbox.fill(randomPassword)
        await expect(passwordTextbox).toHaveValue(randomPassword)

        await loginPage.sign_in_button.click();
        await expect(loginPage.wrong_username_Or_password_fieldbox).toBeVisible();  //.Verify user gets an error for unsuccessful login
    });

    test('Check Forgot Password', async ({ page }) => {
        await navigateToLoginPage(page)
        let loginPage = await BraindateLoginPage.getInstance(page)
        await expect(page.locator(loginPage.braindate_logo_selector)).toBeVisible();
        await expect(loginPage.page_header).toContainText('Welcome to Braindate!')

        await assertCommonElementsVisibleAndEnabled(page, loginPage);
        await expect(loginPage.login_with_password_link).toBeVisible();
        await expect(loginPage.login_with_password_link).toBeEnabled();

        await loginPage.login_with_password_link.click();
        let usernameTextbox = await page.locator(loginPage.username_textbox_selector)
        let passwordTextbox = await page.locator(loginPage.password_textbox_selector)

        await expect(usernameTextbox).toBeVisible();
        await expect(usernameTextbox).toBeEditable();

        await expect(passwordTextbox).toBeVisible();
        await expect(passwordTextbox).toBeEditable();

        await assertCommonElementsVisibleAndEnabled(page, loginPage);
        await expect(loginPage.login_with_password_link).not.toBeVisible();  // Negative validations
        await expect(loginPage.forgot_password_link).toBeVisible();
        await expect(loginPage.sign_in_button).toBeVisible();

        await loginPage.forgot_password_link.click();
        // Validations on the Password reset page
        await expect(page).not.toHaveURL(links.braindate.password_reset_page);
        let emailTextfield = await page.locator('[id="input"][placeholder="Email address"]')
        await expect(emailTextfield).toBeVisible();
        await expect(emailTextfield).toBeEditable();
        await expect(loginPage.reset_password_button).toBeVisible();
        await expect(loginPage.reset_password_button).toBeEnabled();
        let randomPassword = await randomText(8)

        await emailTextfield.fill('')   // Verification for the Null Email
        await loginPage.reset_password_button.click();
        await expect(page).not.toHaveURL(links.braindate.password_reset_succcessful);
        await expect(loginPage.password_reset_header).not.toContainText('We have sent you an email. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes.');
        
        await emailTextfield.fill(randomPassword)   // Verification for the Incorrect Email format
        await expect(emailTextfield).toHaveValue(randomPassword)
        await loginPage.reset_password_button.click();
        await expect(page).not.toHaveURL(links.braindate.password_reset_succcessful);
        await expect(loginPage.password_reset_header).not.toContainText('We have sent you an email. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes.');


        let dummyUserName: string = 'qa@example.com'  // Resetting using correct email address
        await emailTextfield.fill(dummyUserName)
        await expect(emailTextfield).toHaveValue(dummyUserName)
        await loginPage.reset_password_button.click();
        await expect(page).toHaveURL(links.braindate.password_reset_succcessful);
        await expect(loginPage.password_reset_header).toBeVisible();
        await expect(loginPage.password_reset_header).toContainText('We have sent you an email. If you have not received it please check your spam folder. Otherwise contact us if you do not receive it in a few minutes.');

    });


    test('Login with gmail', async () => {
        const gmailPage = await getGmailPage();  // Get the Gmail page for this test
        await navigateToLoginPage(gmailPage)

        let loginPage = await BraindateLoginPage.getInstance(gmailPage)
        await expect(gmailPage.locator(loginPage.braindate_logo_selector)).toBeVisible();
        await expect(loginPage.page_header).toContainText('Welcome to Braindate!')

        await assertCommonElementsVisibleAndEnabled(gmailPage, loginPage);
        await expect(loginPage.login_with_password_link).toBeVisible();
        await expect(loginPage.login_with_password_link).toBeEnabled();

        await loginPage.continue_with_google_option_button.click();
        await expect(gmailPage.locator('[aria-label="Email or phone"]')).toBeVisible();
        await expect(gmailPage.getByRole('button', { name: 'Next' })).toBeVisible();
    });
});
