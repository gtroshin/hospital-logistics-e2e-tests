import { t, Selector } from "testcafe";
import XPathSelector from "../utilities/xpath-selector";
import { scrollDownUntilExists } from "../utilities/utilities";

class Medicine {
	constructor() {
		this.createNew = Selector("#jh-create-entity");
		this.medicineNameInput = Selector("#field_medicineName");
		this.medicineDescriptionInput = Selector("#field_medicineDescription");
		this.saveButton = Selector("#save-entity");
		this.cancelSaveButton = Selector("#cancel-save");
		this.rowContaining = (medicineName, medicineDescription) =>
			XPathSelector(
				`//tr[./td[contains(., '${medicineName}')] and ./td[contains(., '${medicineDescription}')]]`
			);
		this.rowAction = ({ medicineName, action }) =>
			Selector("td")
				.withText(medicineName)
				.parent("tr")
				.find(
					`button:has(span[jhitranslate='entity.action.${action}'])`
				);
	}

	async createMedicine(medicineName, medicineDescription) {
		await t
			.expect(this.createNew.visible).ok()
			.click(this.createNew)
			.expect(this.medicineNameInput.visible).ok()
			.typeText(this.medicineNameInput, medicineName)
			.expect(this.medicineDescriptionInput.visible).ok()
			.typeText(this.medicineDescriptionInput, medicineDescription)
			.click(this.saveButton);
	}

	async verifyMedicine(medicineName, medicineDescription) {
		await scrollDownUntilExists(
			this.rowContaining(medicineName, medicineDescription)
		);

		await t
			.expect(
				this.rowContaining(medicineName, medicineDescription).visible
			).ok();
	}
}

export default new Medicine();
