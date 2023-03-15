import { baseUrl, username, password, randomString } from "../utilities/utilities";
import mainPage from "../pages/main.page";
import employeesPage from "../pages/employees.page";

fixture `As the manager`
    .page `${baseUrl()}`
    .beforeEach(async t => {
        let random = randomString();
        t.ctx.firstName = 'John' + random;
        t.ctx.lastName = 'Doe' + random;
        t.ctx.email = random + '@test.com';

        await mainPage.signIn(username(), password());
    });

test('I should be able to add a new employee to the system with all required information and verify it', async t => {
    await mainPage.openEntity('employee')

    await employeesPage.createEmployee({
        firstName: t.ctx.firstName,
        lastName: t.ctx.lastName,
        email: t.ctx.email,
        phoneNumber: '+46769099901',
        hireDate: '2021-03-15T11:50',
        salary: '10000',
        commissionPct: '12345',
        department: '2',
        manager: '2'
    });

    await employeesPage.verifyEmployee(t.ctx.firstName, t.ctx.lastName, t.ctx.email);
});
