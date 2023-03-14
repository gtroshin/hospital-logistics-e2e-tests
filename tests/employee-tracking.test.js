import { baseUrl, username, password } from "../utilities/utilities";
import mainPage from "../pages/main.page";

fixture `Employee Tracking`
    .page `${baseUrl()}`
    .beforeEach(async t => {
        // todo: add login
    });

test('all employees are correctly tracked in the system', async t => {
    await mainPage.signIn(username(), password());

    await t.debug();
});