import {
	baseUrl,
	username,
	password,
	randomString,
	getMedicinesByNameAndDescription,
} from "../utilities/utilities";
import mainPage from "../pages/main.page";
import medicinePage from "../pages/medicine.page";

fixture`As a manager`.page`${baseUrl()}`.beforeEach(async (t) => {
	// Generate random values for each test run and save them to the test context
	t.ctx.random = randomString();
	t.ctx.medicineName = "Name" + t.ctx.random;
	t.ctx.medicineDescription = "Description" + t.ctx.random;

	// Sign in to the application before each test
	await mainPage.signIn(username(), password());
});

test.meta("opt", "true")(
	"I should be able to add a new medicine with all required information and verify it in the system (database)",
	async (t) => {
		// Navigate to the "Medicine" page
		await mainPage.openEntity("medicine");

		// Create a new medicine with the generated values and check that it was created successfully
		await medicinePage.createMedicine(
			t.ctx.medicineName,
			t.ctx.medicineDescription
		);

		await medicinePage.verifyMedicine(
			t.ctx.medicineName,
			t.ctx.medicineDescription
		);

		// Get the number of medicines that match the search criteria and verify that there is only one
		const numberOfMatchedMedicines = await getMedicinesByNameAndDescription(
			t.ctx.medicineName,
			t.ctx.medicineDescription
		);

		await t
			.expect(numberOfMatchedMedicines)
			.eql(
				1,
				"There should be only one medicine with the provided name and description"
			);
	}
);
