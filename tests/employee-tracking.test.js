import { userVariables} from "testcafe";
import {
	baseUrl,
	username,
	password,
	randomString,
	addNewEmployee,
	getEmployeeById,
} from "../utilities/utilities";
import mainPage from "../pages/main.page";
import employeesPage from "../pages/employees.page";

fixture`As a manager`.page`${baseUrl()}`.beforeEach(async (t) => {
	// Generate random values for each test run and save them to the test context
	t.ctx.random = randomString();
	t.ctx.firstName = "John" + t.ctx.random;
	t.ctx.lastName = "Doe" + t.ctx.random;
	t.ctx.email = t.ctx.random + "@test.com";

	// Sign in to the application before each test
	await mainPage.signIn(username(), password());
});

test.meta("opt", "true")(
	"I should be able to add a new employee to the system with all required information and verify it",
	async (t) => {
		await mainPage.openEntity("employee");

		// Create a new employee with the generated values and check that it was created successfully
		await employeesPage.createEmployee({
			firstName: t.ctx.firstName,
			lastName: t.ctx.lastName,
			email: t.ctx.email,
			phoneNumber: userVariables.phoneNumber,
			hireDate: userVariables.hireDate,
			salary: userVariables.salary,
			commissionPct: userVariables.commissionPct,
			department: userVariables.department,
			manager: userVariables.manager
		});

		await employeesPage.verifyEmployee(
			t.ctx.firstName,
			t.ctx.lastName,
			t.ctx.email
		);
	}
);

test("I should be able to update the information of an existing employee and verify that the information is updated correctly", async (t) => {
	let firstName = "API" + t.ctx.firstName;
	let lastName = "API" + t.ctx.lastName;

	// Programmatically create a new employee
	await addNewEmployee({
		firstName: firstName,
		lastName: lastName,
		email: t.ctx.email,
		phoneNumber: userVariables.phoneNumber,
	});

	await mainPage.openEntity("employee");

	await employeesPage.verifyEmployee(firstName, lastName, t.ctx.email);
	
	// Update the employee's first name and verify that the update was successful
	let newFirstName = firstName + "_new";

	await employeesPage.updateEmployee({
		email: t.ctx.email,
		firstName: newFirstName,
	});

	await employeesPage.verifyEmployee(newFirstName, lastName, t.ctx.email);
});

test("I should be able to delete an employee from the system and verify that the employee is removed from the system", async (t) => {
	let firstName = "API" + t.ctx.firstName;
	let lastName = "API" + t.ctx.lastName;

	// Programmatically create a new employee
	const createdEmployee = await addNewEmployee({
		firstName: firstName,
		lastName: lastName,
		email: t.ctx.email,
		phoneNumber: userVariables.phoneNumber,
	});

	const employeeId = createdEmployee.id;

	await mainPage.openEntity("employee");

	await employeesPage.verifyEmployee(firstName, lastName, t.ctx.email);

	// Delete the employee and verify that the delete was successful
	await employeesPage.deleteEmployee({
		email: t.ctx.email,
	});

	// Verify that the employee was successfully deleted from the system
	const statusCode = await getEmployeeById(employeeId);

	await t.expect(statusCode).eql(404, "Employee was not deleted");
});
