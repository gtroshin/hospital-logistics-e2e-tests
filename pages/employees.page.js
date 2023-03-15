import { t, Selector } from 'testcafe';
import XPathSelector from '../utilities/xpath-selector';
import { scrollDownUntilExists } from '../utilities/utilities';

class Employees {
    constructor () {
        this.top = Selector('#page-heading');
        this.createNew = Selector('#jh-create-entity');
        this.firstNameInput = Selector('#field_firstName');
        this.lastNameInput = Selector('#field_lastName');
        this.emailInput = Selector('#field_email');
        this.phoneNumberInput = Selector('#field_phoneNumber');
        this.hireDate = Selector('#field_hireDate');
        this.salaryInput = Selector('#field_salary');
        this.commissionPctInput = Selector('#field_commissionPct');
        this.departmentSelector = Selector('#field_department');
        this.managerSelector = Selector('#field_manager');
        this.saveButton = Selector('#save-entity');
        this.cancelSaveButton = Selector('#cancel-save');
        // this.rowContaining = (x) => Selector('jhi-main td').withText(x);      // //tr[./td[contains(.,'JohnhjVYHCUCLA')] and ./td[contains(.,'DoehjVYHCUCLA')] and ./td[contains(.,'hjVYHCUCLA@test.com')]]
        this.rowContaining = (firstName, lastName, email) => XPathSelector(
            `//tr[./td[contains(., '${firstName}')] and ./td[contains(., '${lastName}')] and ./td[contains(.,'${email}')]]`);
    }

    async hireDate(field, text) {
        await t
            .expect(this.hireDateInput(field).visible).ok()
            .typeText(this.hireDateInput(field), text)
    }

    async selectDepartment(department) {
        const option = this.departmentSelector.find('option')

        await t
            .expect(this.departmentSelector.visible).ok()
            .click(this.departmentSelector)
            .expect(option.withText(department).visible).ok()
            .click(option.withText(department))
    }

    async selectManager(manager) {
        const option = this.managerSelector.find('option')

        await t
            .expect(this.managerSelector.visible).ok()
            .click(this.managerSelector)
            .expect(option.withText(manager).visible).ok()
            .click(option.withText(manager))
    }

    

    async createEmployee({firstName, lastName, email, phoneNumber, hireDate, salary, commissionPct, department, manager, save=true}) {
        await t
            .expect(this.createNew.visible).ok()
            .click(this.createNew)
            .expect(this.firstNameInput.visible).ok()
            .typeText(this.firstNameInput, firstName)
            .expect(this.lastNameInput.visible).ok()
            .typeText(this.lastNameInput, lastName)
            .expect(this.emailInput.visible).ok()
            .typeText(this.emailInput, email)
            .expect(this.phoneNumberInput.visible).ok()
            .typeText(this.phoneNumberInput, phoneNumber)
            .expect(this.hireDate.visible).ok()
            .typeText(this.hireDate, hireDate)
            .expect(this.salaryInput.visible).ok()
            .typeText(this.salaryInput, salary)
            .expect(this.commissionPctInput.visible).ok()
            .typeText(this.commissionPctInput, commissionPct)

        this.selectDepartment(department);
        this.selectManager(manager);

        if (save) {
            await t
                .expect(this.saveButton.visible).ok()
                .click(this.saveButton)
        }
    }

    async verifyEmployee(firstName, lastName, email) {
        await scrollDownUntilExists(this.rowContaining(firstName, lastName, email));

        await t
            .expect(this.rowContaining(firstName, lastName, email).visible).ok()
    }
}

export default new Employees();