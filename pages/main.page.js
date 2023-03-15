import { t, Selector } from 'testcafe';

class Main {
    constructor () {
        this.accountMenu = Selector('#account-menu');
        this.entityMenu = Selector('#entity-menu');
        this.entityItem = (x) => Selector('a.dropdown-item').withAttribute('href', '/' + x);
        this.loginButton = Selector('#login');
        this.usernameInput = Selector('#username');
        this.passwordInput = Selector('#password');
        this.submitLoginFromButton = Selector('button.btn.btn-primary[type="submit"]');
    }

    async openMainMenu() {
        await t
            .expect(this.accountMenu.visible).ok()
            .click(this.accountMenu)
    }

    async openSignIn() {
        await t
            .expect(this.loginButton.visible).ok()
            .click(this.loginButton)
    }

    async signIn(username, password) {
        this.openMainMenu();
        this.openSignIn();

        await t
            .expect(this.usernameInput.visible).ok()
            .typeText(this.usernameInput, username)
            .expect(this.passwordInput.visible).ok()
            .typeText(this.passwordInput, password)
            .expect(this.submitLoginFromButton.visible).ok()
            .click(this.submitLoginFromButton)
    }

    async openEntity(entity) {
        await t
            .expect(this.entityMenu.visible).ok()
            .click(this.entityMenu)
            .expect(this.entityItem(entity).visible).ok()
            .click(this.entityItem(entity))
    }
}

export default new Main();
