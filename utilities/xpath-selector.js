import { Selector } from "testcafe";

/**
 * A custom Selector function that takes an XPath expression as input
 * and returns an array of matching DOM elements.
 *
 * @param {string} xpath - The XPath expression to evaluate.
 * @returns {Array} items - An array of DOM elements matching the provided XPath expression.
 */
const elementByXPath = Selector((xpath) => {
	const iterator = document.evaluate(
		xpath,
		document,
		null,
		XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
		null
	);
	const items = [];

	let item = iterator.iterateNext();

	while (item) {
		items.push(item);
		item = iterator.iterateNext();
	}

	return items;
});

/**
 * A utility function that wraps the custom Selector function (elementByXPath)
 * and takes an XPath expression as input. It returns a TestCafe Selector
 * with the matching DOM elements.
 *
 * @param {string} xpath - The XPath expression to be used for the custom Selector.
 * @returns {Selector} - A TestCafe Selector containing the DOM elements that match the XPath expression.
 */
export default function (xpath) {
	return Selector(elementByXPath(xpath));
}
