import { ClientFunction, userVariables, t } from 'testcafe';
import axios from 'axios';

export const getLocation = ClientFunction(() => document.location.href)

export function randomString(length=10, chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
  var result = ''
  for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

export async function scrollDownUntilExists(targetElement) {
  const isTargetVisible = async () => (await targetElement.exists);

  const scrollDown = ClientFunction(() => {
      window.scrollBy(0, 1000); // Increase the scroll amount for bigger leaps
  });

  while (!(await isTargetVisible())) {
      await scrollDown();
      await t.wait(300); // Adjust the waiting time if needed
  }

  await t.scrollIntoView(targetElement)
}

export function baseUrl() {
  return process.env.SITE_URL || userVariables.baseURL
}

export function username() {
  return process.env.USERNAME || userVariables.username
}

export function password() {
  return process.env.PASSWORD || userVariables.password
}

// Function to obtain the Bearer Token
async function getBearerToken(username, password) {
  const response = await axios.post(`${baseUrl()}api/authenticate`, {
    username: username,
    password: password,
    rememberMe: false
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data.id_token;
}

// Function to create an employee
async function createEmployee(token, employeeData) {
  const response = await axios.post(`${baseUrl()}api/employees`, employeeData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data;
}

export async function addNewEmployee({
    firstName,
    lastName,
    email,
    phoneNumber,
    hireDate='2023-03-01T14:01:00.000Z',
    salary=10000,
    commissionPct=12345,
    department=1,
    manager=1
}) {
  try {
    const token = await getBearerToken('user', 'user');

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
        departmentName: 'Intensive care unit',
        location: null,
        employees: null
      },
      manager: {
        id: manager,
        firstName: 'Ramiro',
        lastName: 'Gaylord',
        email: 'Leonora51@hotmail.com',
        phoneNumber: 'Borders',
        hireDate: '2019-11-04T17:55:36.000Z',
        salary: 19427,
        commissionPct: 64996,
        department: null,
        jobs: null,
        manager: null
      }
    };

    const createdEmployee = await createEmployee(token, employeeData);
    await t.eval(() => location.reload(true));
  } catch (error) {
    console.error('Error:', error.message);
  }
}
