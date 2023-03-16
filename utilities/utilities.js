import { ClientFunction, userVariables, t } from "testcafe";
import axios from "axios";

// Retrieve the current page's URL
export const getLocation = ClientFunction(() => document.location.href);

/**
 * Generate a random string of specified length
 * @param {number} length - The desired length of the random string.
 * @param {string} chars - The set of characters to use for generating the random string.
 * @returns {string} result - The generated random string.
 */
export function randomString(
	length = 10,
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
) {
	var result = "";
	for (var i = length; i > 0; --i)
		result += chars[Math.floor(Math.random() * chars.length)];
	return result;
}

/**
 * Scroll down the page until the target element is visible or the maximum scroll time is reached.
 * @param {Selector} targetElement - The TestCafe Selector for the target element.
 */
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

// Retrieve the base URL for the application
export function baseUrl() {
	return process.env.SITE_URL || userVariables.baseURL;
}

// Retrieve the username for authentication
export function username() {
	return process.env.USERNAME || userVariables.username;
}

// Retrieve the password for authentication
export function password() {
	return process.env.PASSWORD || userVariables.password;
}

/**
 * Obtain a Bearer Token for authentication
 * @param {string} username - The username to authenticate with.
 * @param {string} password - The password to authenticate with.
 * @returns {string} - The Bearer Token.
 */
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

/**
 * Create a new employee with the provided data
 * @param {string} token - The Bearer Token for authentication.
 * @param {Object} employeeData - The data for the new employee.
 * @returns {Object} - The created employee data.
 */
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

/**
 * Adds a new employee to the system.
 *
 * @function
 * @async
 * @param {Object} params - Employee data to be added.
 * @param {string} params.firstName - Employee's first name.
 * @param {string} params.lastName - Employee's last name.
 * @param {string} params.email - Employee's email.
 * @param {string} params.phoneNumber - Employee's phone number.
 * @param {string} [params.hireDate="2023-03-01T14:01:00.000Z"] - Employee's hire date (ISO 8601 format).
 * @param {number} [params.salary=10000] - Employee's salary.
 * @param {number} [params.commissionPct=12345] - Employee's commission percentage.
 * @param {number} [params.department=1] - Employee's department ID.
 * @param {number} [params.manager=1] - Employee's manager ID.
 * @returns {Promise<Object>} Created employee object.
 * @throws {Error} If an error occurs while creating the employee.
 */
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
		// Get the authentication token.
		const token = await getBearerToken(username(), password());

		// Build the employee data object.
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

		// Send the request to create the employee.
		const createdEmployee = await createEmployee(token, employeeData);

		// Return the created employee object.
		return createdEmployee;
	} catch (error) {
		// Log and re-throw the error.
		console.error("Error:", error.message);
		throw error;
	}
}

/**
 * Retrieves an employee's information by their ID from the API
 *
 * @param {string} employeeId - The ID of the employee to retrieve
 * @returns {number} The status code of the API response
 */
export async function getEmployeeById(employeeId) {
	try {
	  // Get a bearer token to authenticate the API request
	  const token = await getBearerToken(username(), password());
  
	  // Make a GET request to the API with the employee ID and bearer token
	  const response = await axios.get(
		`${baseUrl()}api/employees/${employeeId}`,
		{
		  headers: {
			Accept: "application/json",
			Authorization: `Bearer ${token}`,
		  },
		}
	  );
  
	  // Return the status code of the API response
	  return response.status;
	} catch (error) {
	  // If the API responds with an error, return the status code of the error
	  if (error.response) {
		return error.response.status;
	  } else {
		// If there is a network error or other issue, log an error message and return null
		console.error("Error:", error.message);
		return null;
	  }
	}
}  

/**
 * Retrieves medicines from the API that match the given name and description.
 *
 * @param {string} medicineName - The name of the medicine to search for.
 * @param {string} medicineDescription - The description of the medicine to search for.
 * @returns {number} The number of medicines that match the search criteria.
 */
export async function getMedicinesByNameAndDescription(
	medicineName,
	medicineDescription
  ) {
	try {
	  // Get a bearer token to authenticate the API request
	  const token = await getBearerToken(username(), password());
  
	  // Make a GET request to the API to retrieve all medicines
	  const response = await axios.get(`${baseUrl()}api/medicines`, {
		headers: {
		  Accept: "application/json",
		  Authorization: `Bearer ${token}`,
		},
	  });
  
	  // Filter the response data to only include medicines that match the search criteria
	  const matchedMedicines = response.data.filter((medicine) => {
		return (
		  medicine.medicineName === medicineName &&
		  medicine.medicineDescription === medicineDescription
		);
	  });
  
	  // Return the number of matched medicines
	  return matchedMedicines.length;
	} catch (error) {
	  // If there is a network error or other issue, log an error message and return 0
	  console.error("Error:", error.message);
	  return 0;
	}
}  
