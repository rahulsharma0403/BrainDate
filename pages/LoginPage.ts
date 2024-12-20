import { Locator, Page } from "@playwright/test"

export class BraindateLoginPage {
    private page: Page
    braindate_logo_selector: string = '[aria-label="Braindate logo"]'
    username_textbox_selector: string = '[id="input"][placeholder="Username or email"]'
    password_textbox_selector: string = '[id="input"][placeholder="Password"]'

    email_textbox: Locator
    password_textbox: Locator
    login_button: Locator
    continue_with_google_option_button: Locator
    microsoft_option_button: Locator
    slack_option_button: Locator
    mail_me_a_magic_code_option: Locator
    login_with_password_link: Locator
    sign_in_button: Locator
    forgot_password_link: Locator
    page_header: Locator
    wrong_username_Or_password_fieldbox: Locator
    reset_password_button: Locator
    password_reset_header: Locator


    public constructor(page: Page){
        this.page = page
    }

    private async initialize(){
        this.continue_with_google_option_button = await this.page.getByRole('button', { name: 'Continue with Google' })
        this.microsoft_option_button = await this.page.getByRole('button', {name: 'Microsoft'})
        this.slack_option_button = await this.page.getByRole('button', {name: 'Slack'})
        this.mail_me_a_magic_code_option = await this.page.getByRole('button', {name: 'Mail me a magic code'})
        this.login_with_password_link =await this.page.getByRole('link', { name: 'Or log in with a password' })
        this.sign_in_button = await this.page.getByRole('button', {name: 'Sign in'})
        this.forgot_password_link = await this.page.getByRole('link', { name: 'Forgot your password?' })
        this.page_header = await this.page.getByRole('heading', { name: 'Welcome to Braindate!' })
        this.wrong_username_Or_password_fieldbox = await this.page.getByRole('alert').locator('div').nth(1)
        this.reset_password_button = await this.page.getByRole('button', {name: 'Reset my password'})
        this.password_reset_header = await this.page.locator('[class="stack"]').first();

    }

    static async getInstance(page){
        const instance = new BraindateLoginPage(page);
        await instance.initialize();
        return instance;
    }
}