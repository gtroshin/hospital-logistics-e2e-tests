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
	t.ctx.random = randomString();
	t.ctx.medicineName = "Name" + t.ctx.random;
	t.ctx.medicineDescription = "Description" + t.ctx.random;

	await mainPage.signIn(username(), password());
});

test.meta("opt", "true")(
	"I should be able to add a new medicine with all required information and verify it in the system (database)",
	async (t) => {
		await mainPage.openEntity("medicine");

		await medicinePage.createMedicine(
			t.ctx.medicineName,
			t.ctx.medicineDescription
		);

		await medicinePage.verifyMedicine(
			t.ctx.medicineName,
			t.ctx.medicineDescription
		);

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
