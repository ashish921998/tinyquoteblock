// Function to toggle price column visibility
export const togglePriceColumn = (editor: any, isHidden: boolean) => {
	const quoteTable = editor.dom.select(".quote-table")[0];
	if (quoteTable) {
		// Create visibility object
		const visibility = {
			productName: true,
			quantity: true,
			discount: true,
			price: !isHidden, // Hide/show price based on parameter
			amount: true,
		};

		// Update table columns
		updateTableColumns(editor, visibility);

		console.log(`Price column ${isHidden ? "hidden" : "shown"}`);
	}
};

// Function to update table columns (simplified version)
const updateTableColumns = (editor: any, visibility: any) => {
	// Calculate the grid template based on visible columns
	let gridTemplate = "30px"; // Always show the drag handle column

	if (visibility.productName) {
		gridTemplate += " 3fr";
	}

	if (visibility.quantity) {
		gridTemplate += " 1fr";
	}

	if (visibility.discount) {
		gridTemplate += " 1fr";
	}

	if (visibility.price) {
		gridTemplate += " 1fr";
	}

	if (visibility.amount) {
		gridTemplate += " 1fr";
	}

	console.log("Grid template:", gridTemplate);

	// Apply the grid template to all rows
	const quoteTable = editor.dom.select(".quote-table")[0];
	if (quoteTable) {
		const header = editor.dom.select(".quote-header", quoteTable)[0];
		const rows = editor.dom.select(".quote-row", quoteTable);

		if (header) {
			header.style.gridTemplateColumns = gridTemplate;
		}

		rows.forEach((row: any) => {
			row.style.gridTemplateColumns = gridTemplate;
		});

		// Hide/show price header and cells
		const priceHeaders = editor.dom.select(".price-header", quoteTable);
		priceHeaders.forEach((header: any) => {
			header.style.display = visibility.price ? "" : "none";
		});

		const priceCells = editor.dom.select(".price-cell", quoteTable);
		priceCells.forEach((cell: any) => {
			cell.style.display = visibility.price ? "" : "none";
		});
	}
};
