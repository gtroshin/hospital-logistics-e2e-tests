import { ClientFunction, userVariables, t } from "testcafe";
import axios from "axios";

export const getLocation = ClientFunction(() => document.location.href);

export function randomString(
	length = 10,
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
	var result = "";
	for (var i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

export async function scrollDownUntilExists(targetElement) {
	const isTargetVisible = async () => await targetElement.exists;

	const scrollDown = ClientFunction(() => {
		window.scrollBy(0, 1000); // Increase the scroll amount for bigger leaps
	});

	const maxScrollTime = 25000; // Maximum scroll time in milliseconds
	const startTime = Date.now();

	while (
		!(await isTargetVisible()) &&
		Date.now() - startTime < maxScrollTime
	) {
		await scrollDown();
		await t.wait(300); // Adjust the waiting time if needed
	}

	if (await isTargetVisible()) {
		await t.scrollIntoView(targetElement);
	} else {
		throw new Error(
			"Target element not found within the maximum scroll time."
		);
	}
}

export function baseUrl() {
	return process.env.SITE_URL || userVariables.baseURL;
}

export function username() {
	return process.env.USERNAME || userVariables.username;
}

export function password() {
	return process.env.PASSWORD || userVariables.password;
}

// Function to obtain the Bearer Token
async function getBearerToken(username, password) {
	const response = await axios.post(
		`${baseUrl()}api/authenticate`,
		{
			username: username,
			password: password,
			rememberMe: false,
		},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	return response.data.id_token;
}

// Function to create an employee
async function createEmployee(token, employeeData) {
	const response = await axios.post(
		`${baseUrl()}api/employees`,
		employeeData,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	);

	return response.data;
}

export async function addNewEmployee({
	firstName,
	lastName,
	email,
	phoneNumber,
	hireDate = "2023-03-01T14:01:00.000Z",
	salary = 10000,
	commissionPct = 12345,
	department = 1,
	manager = 1,
}) {
	try {
		const token = await getBearerToken(username(), password());

		const employeeData = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phoneNumber: phoneNumber,
			hireDate: hireDate,
			salary: salary,
			commissionPct: commissionPct,
			department: {
				id: department,
				departmentName: "Intensive care unit",
				location: null,
				employees: null,
			},
			manager: {
				id: manager,
				firstName: "Ramiro",
				lastName: "Gaylord",
				email: "Leonora51@hotmail.com",
				phoneNumber: "Borders",
				hireDate: "2019-11-04T17:55:36.000Z",
				salary: 19427,
				commissionPct: 64996,
				department: null,
				jobs: null,
				manager: null,
			},
		};

		const createdEmployee = await createEmployee(token, employeeData);

		return createdEmployee;
	} catch (error) {
		console.error("Error:", error.message);
	}
}

export async function getEmployeeById(employeeId) {
	try {
		const token = await getBearerToken(username(), password());

		const response = await axios.get(
			`${baseUrl()}api/employees/${employeeId}`,
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		return response.status;
	} catch (error) {
		if (error.response) {
			return error.response.status;
		} else {
			console.error("Error:", error.message);
			return null;
		}
	}
}

export async function getMedicinesByNameAndDescription(
	medicineName,
	medicineDescription
) {
	try {
		const token = await getBearerToken(username(), password());

		const response = await axios.get(`${baseUrl()}api/medicines`, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		const matchedMedicines = response.data.filter((medicine) => {
			return (
				medicine.medicineName === medicineName &&
				medicine.medicineDescription === medicineDescription
			);
		});

		return matchedMedicines.length;
	} catch (error) {
		console.error("Error:", error.message);
		return 0;
	}
}
