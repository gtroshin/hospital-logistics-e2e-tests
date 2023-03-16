import { baseUrl, username, password, randomString, addNewEmployee, getEmployeeById } from "../utilities/utilities";
import mainPage from "../pages/main.page";
import employeesPage from "../pages/employees.page";

fixture `As a manager`
    .page `${baseUrl()}`
    .beforeEach(async t => {
        t.ctx.random = randomString();
        t.ctx.firstName = 'John' +  t.ctx.random;
        t.ctx.lastName = 'Doe' +  t.ctx.random;
        t.ctx.email = t.ctx.random + '@test.com';

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

test('I should be able to update the information of an existing employee and verify that the information is updated correctly', async t => {
    let firstName = 'API' + t.ctx.firstName
    let lastName = 'API' + t.ctx.lastName

    // Programmatically create a new employee
    await addNewEmployee({
        firstName: firstName,
        lastName: lastName,
        email: t.ctx.email,
        phoneNumber: '+46769099901'
    })

    await mainPage.openEntity('employee')

    await employeesPage.verifyEmployee(firstName, lastName, t.ctx.email);

    let newFirstName = firstName + '_new'

    await employeesPage.updateEmployee({
        email: t.ctx.email,
        firstName: newFirstName
    });

    await employeesPage.verifyEmployee(newFirstName, lastName, t.ctx.email);
});

test('I should be able to delete an employee from the system and verify that the employee is removed from the system', async t => {
    let firstName = 'API' + t.ctx.firstName
    let lastName = 'API' + t.ctx.lastName

    // Programmatically create a new employee
    const createdEmployee = await addNewEmployee({
        firstName: firstName,
        lastName: lastName,
        email: t.ctx.email,
        phoneNumber: '+46769099901'
    })

    const employeeId = createdEmployee.id;

    await mainPage.openEntity('employee')

    await employeesPage.verifyEmployee(firstName, lastName, t.ctx.email);

    await employeesPage.deleteEmployee({
        email: t.ctx.email
    });

    const statusCode = await getEmployeeById(employeeId);

    await t
        .expect(statusCode).eql(404, 'Employee was not deleted')
});
