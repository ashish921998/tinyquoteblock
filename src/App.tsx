import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useState, useEffect } from "react";
import "./App.css";

interface ProductFormData {
	productName: string;
	description: string;
	quantity: string;
	price: string;
	rowId?: string;
}

interface QuoteSummary {
	subtotal: number;
	taxRate: number;
	taxAmount: number;
	total: number;
}

interface MockProduct {
	id: string;
	productName: string;
	description: string;
	price: string;
	category: string;
	sku: string;
	stock: number;
}

interface ColumnVisibility {
	productName: boolean;
	description: boolean;
	quantity: boolean;
	price: boolean;
}

// Define product selection types
type ProductSelectionType = "all-mandatory" | "all-optional" | "only-one";

// Mock data with categories
const SAMPLE_PRODUCTS: MockProduct[] = [
	{
		id: "1",
		productName: "MacBook Pro M2",
		description: "14-inch MacBook Pro with M2 chip, 16GB RAM, 512GB SSD",
		price: "1999.99",
		category: "Laptops",
		sku: "LAP-MB-001",
		stock: 15,
	},
	{
		id: "2",
		productName: "Dell XPS 15",
		description: "15-inch Dell XPS with Intel i9, 32GB RAM, 1TB SSD",
		price: "1799.99",
		category: "Laptops",
		sku: "LAP-DL-002",
		stock: 8,
	},
	{
		id: "3",
		productName: 'LG 32" 4K Monitor',
		description: "32-inch 4K UHD Monitor with HDR support",
		price: "699.99",
		category: "Monitors",
		sku: "MON-LG-001",
		stock: 20,
	},
	{
		id: "4",
		productName: 'Samsung 27" Gaming Monitor',
		description: "27-inch 165Hz Gaming Monitor with G-Sync",
		price: "449.99",
		category: "Monitors",
		sku: "MON-SM-002",
		stock: 12,
	},
	{
		id: "5",
		productName: "Logitech MX Master 3",
		description: "Wireless Performance Mouse with customizable buttons",
		price: "99.99",
		category: "Accessories",
		sku: "ACC-LG-001",
		stock: 30,
	},
	{
		id: "6",
		productName: "Keychron K3",
		description: "Low-profile Mechanical Keyboard with RGB",
		price: "89.99",
		category: "Accessories",
		sku: "ACC-KC-002",
		stock: 25,
	},
	{
		id: "7",
		productName: "iPhone 15 Pro",
		description: "256GB iPhone 15 Pro with A17 Pro chip",
		price: "1199.99",
		category: "Phones",
		sku: "PHN-IP-001",
		stock: 10,
	},
	{
		id: "8",
		productName: "Samsung S24 Ultra",
		description: "512GB S24 Ultra with S Pen and AI features",
		price: "1299.99",
		category: "Phones",
		sku: "PHN-SS-002",
		stock: 15,
	},
];

function ProductListDrawer({
	isOpen,
	onClose,
	onImport,
}: {
	isOpen: boolean;
	onClose: () => void;
	onImport: (products: ProductFormData[]) => void;
}) {
	const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
		new Set(),
	);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("All");

	const categories = [
		"All",
		...new Set(SAMPLE_PRODUCTS.map((p) => p.category)),
	];

	const filteredProducts = SAMPLE_PRODUCTS.filter((product) => {
		const matchesSearch =
			product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.sku.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory =
			selectedCategory === "All" || product.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const handleImport = () => {
		const productsToImport = SAMPLE_PRODUCTS.filter((p) =>
			selectedProducts.has(p.id),
		).map((p) => ({
			productName: p.productName,
			description: p.description,
			quantity: "1",
			price: p.price,
		}));
		onImport(productsToImport);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="drawer-overlay"
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "flex-end",
				zIndex: 1000,
			}}
		>
			<div
				className="drawer"
				style={{
					width: "800px",
					backgroundColor: "white",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
				}}
			>
				<div
					style={{
						padding: "24px 24px 0 24px",
					}}
				>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							marginBottom: "24px",
						}}
					>
						<h2 style={{ margin: 0 }}>Import Products</h2>
						<button
							onClick={onClose}
							style={{
								background: "none",
								border: "none",
								fontSize: "24px",
								cursor: "pointer",
								padding: "4px 8px",
							}}
						>
							×
						</button>
					</div>

					<div style={{ marginBottom: "20px", display: "flex", gap: "12px" }}>
						<input
							type="text"
							placeholder="Search products..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							style={{
								flex: 1,
								padding: "8px 12px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								fontSize: "14px",
							}}
						/>
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							style={{
								padding: "8px 12px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								fontSize: "14px",
							}}
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>

				<div
					style={{
						flex: 1,
						overflowY: "auto",
						margin: "0 24px 20px 24px",
						border: "1px solid #eee",
						borderRadius: "4px",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "auto 2fr 1fr 1fr 1fr",
							padding: "12px",
							background: "#f8f9fa",
							borderBottom: "2px solid #eee",
							position: "sticky",
							top: 0,
						}}
					>
						<div style={{ width: "24px" }}></div>
						<div style={{ fontWeight: "600" }}>Product</div>
						<div style={{ fontWeight: "600" }}>SKU</div>
						<div style={{ fontWeight: "600", textAlign: "right" }}>Stock</div>
						<div style={{ fontWeight: "600", textAlign: "right" }}>Price</div>
					</div>
					<div style={{ overflowY: "auto" }}>
						{filteredProducts.map((product) => (
							<div
								key={product.id}
								style={{
									display: "grid",
									gridTemplateColumns: "auto 2fr 1fr 1fr 1fr",
									padding: "12px",
									borderBottom: "1px solid #eee",
									alignItems: "center",
									background: selectedProducts.has(product.id)
										? "#f0f7ff"
										: "white",
								}}
							>
								<input
									type="checkbox"
									checked={selectedProducts.has(product.id)}
									onChange={(e) => {
										const newSelected = new Set(selectedProducts);
										if (e.target.checked) {
											newSelected.add(product.id);
										} else {
											newSelected.delete(product.id);
										}
										setSelectedProducts(newSelected);
									}}
									style={{ width: "16px", height: "16px" }}
								/>
								<div>
									<div style={{ fontWeight: "500" }}>{product.productName}</div>
									<div style={{ color: "#666", fontSize: "13px" }}>
										{product.description}
									</div>
									<div
										style={{
											color: "#0066cc",
											fontSize: "12px",
											marginTop: "4px",
										}}
									>
										{product.category}
									</div>
								</div>
								<div style={{ color: "#666" }}>{product.sku}</div>
								<div
									style={{
										textAlign: "right",
										color: product.stock < 10 ? "#dc3545" : "#28a745",
									}}
								>
									{product.stock} units
								</div>
								<div
									style={{
										color: "#333",
										fontWeight: "500",
										textAlign: "right",
									}}
								>
									${product.price}
								</div>
							</div>
						))}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						gap: "12px",
						justifyContent: "space-between",
						borderTop: "1px solid #eee",
						padding: "20px 24px",
						backgroundColor: "white",
					}}
				>
					<div style={{ color: "#666" }}>
						{selectedProducts.size} products selected
					</div>
					<div style={{ display: "flex", gap: "12px" }}>
						<button
							onClick={onClose}
							style={{
								padding: "8px 16px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								background: "white",
								cursor: "pointer",
							}}
						>
							Cancel
						</button>
						<button
							onClick={handleImport}
							disabled={selectedProducts.size === 0}
							style={{
								padding: "8px 16px",
								border: "none",
								borderRadius: "4px",
								background: selectedProducts.size === 0 ? "#ccc" : "#4CAF50",
								color: "white",
								cursor: selectedProducts.size === 0 ? "not-allowed" : "pointer",
							}}
						>
							Import Selected ({selectedProducts.size})
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function ProductDrawer({
	isOpen,
	onClose,
	onSubmit,
	editData,
}: {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ProductFormData) => void;
	editData?: ProductFormData;
}) {
	const [formData, setFormData] = useState<ProductFormData>(
		editData || {
			productName: "",
			description: "",
			quantity: "",
			price: "",
		},
	);

	// Reset form when editData changes
	useEffect(() => {
		if (editData) {
			setFormData(editData);
		}
	}, [editData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ productName: "", description: "", quantity: "", price: "" });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="drawer-overlay"
			style={{
				position: "fixed",
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				display: "flex",
				justifyContent: "flex-end",
				zIndex: 1000,
			}}
		>
			<div
				className="drawer"
				style={{
					width: "400px",
					backgroundColor: "white",
					height: "100%",
					padding: "24px",
					boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.15)",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "24px",
					}}
				>
					<h2 style={{ margin: 0 }}>
						{editData ? "Edit Product" : "Add Product"}
					</h2>
					<button
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							fontSize: "24px",
							cursor: "pointer",
							padding: "4px 8px",
						}}
					>
						×
					</button>
				</div>
				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: "16px" }}>
						<label style={{ display: "block", marginBottom: "8px" }}>
							Product Name
						</label>
						<input
							type="text"
							value={formData.productName}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									productName: e.target.value,
								}))
							}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
							required
						/>
					</div>
					<div style={{ marginBottom: "16px" }}>
						<label style={{ display: "block", marginBottom: "8px" }}>
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									description: e.target.value,
								}))
							}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								minHeight: "100px",
							}}
						/>
					</div>
					<div style={{ marginBottom: "16px" }}>
						<label style={{ display: "block", marginBottom: "8px" }}>
							Quantity
						</label>
						<input
							type="number"
							value={formData.quantity}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, quantity: e.target.value }))
							}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
							required
						/>
					</div>
					<div style={{ marginBottom: "24px" }}>
						<label style={{ display: "block", marginBottom: "8px" }}>
							Price
						</label>
						<input
							type="number"
							step="0.01"
							value={formData.price}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, price: e.target.value }))
							}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
							required
						/>
					</div>
					<div
						style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
					>
						<button
							type="button"
							onClick={onClose}
							style={{
								padding: "8px 16px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								background: "white",
								cursor: "pointer",
							}}
						>
							Cancel
						</button>
						<button
							type="submit"
							style={{
								padding: "8px 16px",
								border: "none",
								borderRadius: "4px",
								background: "#4CAF50",
								color: "white",
								cursor: "pointer",
							}}
						>
							{editData ? "Update Product" : "Add Product"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function App() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isProductListOpen, setIsProductListOpen] = useState(false);
	const [currentEditor, setCurrentEditor] = useState<TinyMCEEditor | null>(
		null,
	);
	const [editingProduct, setEditingProduct] = useState<
		ProductFormData | undefined
	>();
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
		productName: true,
		description: true,
		quantity: true,
		price: true,
	});
	const [taxRate, setTaxRate] = useState<number>(10); // Default tax rate of 10%
	const [productSelectionType, setProductSelectionType] =
		useState<ProductSelectionType>("all-mandatory");

	const updateTableColumns = (
		editor: TinyMCEEditor,
		visibility: ColumnVisibility,
	) => {
		// Create grid template based on visible columns
		let gridTemplate = "30px"; // Start with drag handle column
		if (visibility.productName) gridTemplate += " 3fr"; // Increased to 3fr since it includes description
		if (visibility.quantity) gridTemplate += " 1fr";
		if (visibility.price) gridTemplate += " 1fr";
		gridTemplate += " 80px"; // Actions column

		// Update header
		const header = editor.dom.select(".quote-header")[0] as HTMLElement;
		if (header) {
			header.style.gridTemplateColumns = gridTemplate;

			// Show/hide header cells
			const cells = Array.from(header.children) as HTMLElement[];
			let cellIndex = 1; // Start at 1 to skip the empty drag handle cell

			if (visibility.productName) {
				cells[cellIndex].style.display = "block";
				cells[cellIndex].textContent = "Product Name"; // Update header text
				cellIndex++;
			} else {
				cells[cellIndex].style.display = "none";
				cellIndex++;
			}

			// Skip description header cell
			cells[cellIndex].style.display = "none";
			cellIndex++;

			if (visibility.quantity) {
				cells[cellIndex].style.display = "block";
				cellIndex++;
			} else {
				cells[cellIndex].style.display = "none";
				cellIndex++;
			}

			if (visibility.price) {
				cells[cellIndex].style.display = "block";
				cellIndex++;
			} else {
				cells[cellIndex].style.display = "none";
				cellIndex++;
			}
		}

		// Update all rows
		const rows = editor.dom.select(".quote-row") as HTMLElement[];
		rows.forEach((row) => {
			row.style.gridTemplateColumns = gridTemplate;

			// Show/hide row cells
			const cells = Array.from(row.children) as HTMLElement[];
			let cellIndex = 1; // Start at 1 to skip the drag handle

			if (visibility.productName) {
				const productCell = cells[cellIndex];
				const descriptionCell = cells[cellIndex + 1];

				// Get the description text
				const descriptionText = descriptionCell.textContent || "";

				// Update product cell to include description
				const productContent = productCell.innerHTML;
				const hasCheckbox = productCell.querySelector(".product-checkbox");

				if (hasCheckbox) {
					const checkbox = hasCheckbox.outerHTML;
					const productText = productContent.replace(checkbox, "").trim();
					productCell.innerHTML = `
						${checkbox}
						<div style="display: flex; flex-direction: column;">
							<div style="font-weight: 500;">${productText}</div>
							${
								descriptionText
									? `<div style="color: #666; font-size: 0.9em; margin-top: 4px;">${descriptionText}</div>`
									: ""
							}
						</div>
					`;
				} else {
					productCell.innerHTML = `
						<div style="display: flex; flex-direction: column;">
							<div style="font-weight: 500;">${productContent}</div>
							${
								descriptionText
									? `<div style="color: #666; font-size: 0.9em; margin-top: 4px;">${descriptionText}</div>`
									: ""
							}
						</div>
					`;
				}

				productCell.style.display = "block";
				descriptionCell.style.display = "none";
				cellIndex += 2; // Skip both product and description cells
			} else {
				cells[cellIndex].style.display = "none";
				cells[cellIndex + 1].style.display = "none";
				cellIndex += 2;
			}

			if (visibility.quantity) {
				cells[cellIndex].style.display = "block";
				cellIndex++;
			} else {
				cells[cellIndex].style.display = "none";
				cellIndex++;
			}

			if (visibility.price) {
				cells[cellIndex].style.display = "block";
				cellIndex++;
			} else {
				cells[cellIndex].style.display = "none";
				cellIndex++;
			}

			// Always show the drag handle and actions column
			cells[0].style.display = "block"; // drag handle
			cells[cells.length - 1].style.display = "block"; // actions
		});
	};

	// Calculate quote summary (subtotal, tax, total)
	const calculateQuoteSummary = (
		editor: TinyMCEEditor,
		quoteBody: HTMLElement,
	): QuoteSummary => {
		const rows = editor.dom.select(".quote-row", quoteBody);
		let subtotal = 0;

		rows.forEach((row) => {
			const cells = row.children;

			// Skip unchecked optional products
			const productNameCell = cells[1] as HTMLElement;
			const checkbox = productNameCell.querySelector(
				".product-checkbox",
			) as HTMLInputElement;
			if (checkbox && !checkbox.checked) {
				return;
			}

			const quantity = parseFloat(cells[3].textContent || "0");
			const price = parseFloat((cells[4].textContent || "0").replace("$", ""));

			if (!isNaN(quantity) && !isNaN(price)) {
				subtotal += quantity * price;
			}
		});

		const taxAmount = subtotal * (taxRate / 100);
		const total = subtotal + taxAmount;

		return {
			subtotal,
			taxRate,
			taxAmount,
			total,
		};
	};

	// Update the summary row in the quote table
	const updateQuoteSummary = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
	) => {
		const quoteBody = editor.dom.select(
			".quote-body",
			quoteTable,
		)[0] as HTMLElement;
		const summary = calculateQuoteSummary(editor, quoteBody);

		// Find or create the summary section
		let summarySection = editor.dom.select(".quote-summary", quoteTable)[0];
		if (!summarySection) {
			// Create the summary section if it doesn't exist
			const summarySectionHtml = `
				<div class="quote-summary" style="padding: 16px; border-top: 1px solid #eee;">
					<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
						<div style="width: 120px; font-weight: 600; color: #333; text-align: right;">Subtotal:</div>
						<div style="width: 120px; color: #333; text-align: right; margin-left: 16px;">$${summary.subtotal.toFixed(
							2,
						)}</div>
					</div>
					<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
						<div style="width: 120px; font-weight: 600; color: #333; text-align: right;">
							Tax (<span class="tax-rate-value">${summary.taxRate}</span>%):
							<button class="edit-tax-btn" style="background: none; border: none; color: #2196F3; cursor: pointer; font-size: 12px; padding: 0 4px;">edit</button>
						</div>
						<div style="width: 120px; color: #333; text-align: right; margin-left: 16px;">$${summary.taxAmount.toFixed(
							2,
						)}</div>
					</div>
					<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
						<div style="width: 120px; font-weight: 600; color: #333; text-align: right; font-size: 18px;">Total:</div>
						<div style="width: 120px; color: #333; text-align: right; margin-left: 16px; font-weight: 700; font-size: 18px;">$${summary.total.toFixed(
							2,
						)}</div>
					</div>
				</div>
			`;

			// Insert the summary section before the footer
			const quoteFooter = editor.dom.select(".quote-footer", quoteTable)[0];
			quoteFooter.insertAdjacentHTML("beforebegin", summarySectionHtml);

			// Get the newly created summary section
			summarySection = editor.dom.select(".quote-summary", quoteTable)[0];

			// Add event listener to the edit tax button
			const editTaxBtn = editor.dom.select(".edit-tax-btn", summarySection)[0];
			if (editTaxBtn) {
				editTaxBtn.addEventListener("click", (e) => {
					e.preventDefault();
					e.stopPropagation();

					const newTaxRate = prompt("Enter tax rate (%)", taxRate.toString());
					if (newTaxRate !== null) {
						const parsedRate = parseFloat(newTaxRate);
						if (!isNaN(parsedRate) && parsedRate >= 0) {
							setTaxRate(parsedRate);

							// Update the tax rate display
							const taxRateElement = editor.dom.select(
								".tax-rate-value",
								summarySection,
							)[0];
							if (taxRateElement) {
								taxRateElement.textContent = parsedRate.toString();
							}

							// Recalculate and update the summary
							updateQuoteSummary(editor, quoteTable);
						} else {
							alert(
								"Please enter a valid tax rate (must be a positive number).",
							);
						}
					}
				});
			}
		} else {
			// Update the existing summary section
			const subtotalElement = editor.dom.select(
				".quote-summary div:nth-child(1) div:nth-child(2)",
				quoteTable,
			)[0];
			const taxRateElement = editor.dom.select(
				".tax-rate-value",
				quoteTable,
			)[0];
			const taxAmountElement = editor.dom.select(
				".quote-summary div:nth-child(2) div:nth-child(2)",
				quoteTable,
			)[0];
			const totalElement = editor.dom.select(
				".quote-summary div:nth-child(3) div:nth-child(2)",
				quoteTable,
			)[0];

			if (subtotalElement)
				subtotalElement.textContent = `$${summary.subtotal.toFixed(2)}`;
			if (taxRateElement)
				taxRateElement.textContent = summary.taxRate.toString();
			if (taxAmountElement)
				taxAmountElement.textContent = `$${summary.taxAmount.toFixed(2)}`;
			if (totalElement)
				totalElement.textContent = `$${summary.total.toFixed(2)}`;
		}
	};

	const insertQuoteTable = (editor: TinyMCEEditor) => {
		// First check if cursor is inside an editable field of an existing quote table
		const selection = editor.selection;
		const node = selection.getNode();

		// Check if selection is inside title or description fields of an existing quote table
		if (
			node &&
			(node.classList?.contains("quote-title-editable") ||
				node.classList?.contains("quote-description-editable") ||
				node.closest(".quote-title-editable") ||
				node.closest(".quote-description-editable"))
		) {
			// If trying to insert a quote table inside an editable field, prevent it
			alert(
				"Cannot insert a quote table inside a title or description field. Please click outside these fields first.",
			);
			return;
		}

		const tableHtml = `
			<div class="quote-block" contenteditable="false" style="user-select: none;" draggable="false" data-product-selection="${productSelectionType}">
				<div class="quote-table" style="width: 100%; margin: 15px 0; background: white; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
					<div class="quote-title-section" style="padding: 16px; border-bottom: 1px solid #eee;">
						<div style="display: flex; align-items: center; margin-bottom: 8px;">
							<div style="font-weight: 600; color: #333; font-size: 18px; margin-right: 8px;">Quote:</div>
							<div 
								class="quote-title-editable" 
								contenteditable="true" 
								style="flex: 1; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 24px; font-size: 18px;"
								data-placeholder="Enter quote title..."
							></div>
						</div>
						<div style="display: flex; align-items: flex-start;">
							<div style="font-weight: 600; color: #333; margin-right: 8px; padding-top: 4px;">Description:</div>
							<div 
								class="quote-description-editable" 
								contenteditable="true" 
								style="flex: 1; padding: 4px 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 24px;"
								data-placeholder="Enter quote description..."
							></div>
						</div>
					</div>
					<div class="quote-header" style="background: #f8f9fa; padding: 12px; border-bottom: 2px solid #eee; display: grid; grid-template-columns: 30px 3fr 1fr 1fr 80px; gap: 12px;">
						<div></div>
						<div style="font-weight: 600; color: #333;">Product Name</div>
						<div style="font-weight: 600; color: #333; text-align: center;">Quantity</div>
						<div style="font-weight: 600; color: #333; text-align: right;">Price</div>
						<div style="font-weight: 600; color: #333; text-align: center;">Actions</div>
					</div>
					<div id="quote-body" class="quote-body" style="padding: 0 12px;">
						<!-- Rows will be inserted here -->
					</div>
					<div class="quote-summary" style="padding: 16px; border-top: 1px solid #eee;">
						<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
							<div style="width: 120px; font-weight: 600; color: #333; text-align: right;">Subtotal:</div>
							<div style="width: 120px; color: #333; text-align: right; margin-left: 16px;">$0.00</div>
						</div>
						<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
							<div style="width: 120px; font-weight: 600; color: #333; text-align: right;">
								Tax (<span class="tax-rate-value">${taxRate}</span>%):
								<button class="edit-tax-btn" style="background: none; border: none; color: #2196F3; cursor: pointer; font-size: 12px; padding: 0 4px;">edit</button>
							</div>
							<div style="width: 120px; color: #333; text-align: right; margin-left: 16px;">$0.00</div>
						</div>
						<div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
							<div style="width: 120px; font-weight: 600; color: #333; text-align: right; font-size: 18px;">Total:</div>
							<div style="width: 120px; color: #333; text-align: right; margin-left: 16px; font-weight: 700; font-size: 18px;">$0.00</div>
						</div>
					</div>
					<div class="quote-footer" style="padding: 12px; border-top: 1px solid #eee; display: flex; gap: 12px;">
						<div style="flex: 1; display: flex; gap: 12px; flex-wrap;">
							<button type="button" class="add-product-btn" style="background-color: #4CAF50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
								+ Add Product
							</button>
							<button type="button" class="import-products-btn" style="background-color: #2196F3; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
								Import Products
							</button>
							<div class="column-visibility-dropdown" style="position: relative; display: inline-block;">
								<button type="button" class="column-visibility-btn" style="background-color: #9C27B0; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
									Show/Hide Columns
								</button>
								<div class="column-dropdown-content" style="display: none; position: absolute; background-color: white; min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; border-radius: 4px; padding: 8px; margin-top: 4px; left: 0;">
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="checkbox" class="column-checkbox" data-column="productName" checked style="margin-right: 8px;"> Product Name
									</label>
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="checkbox" class="column-checkbox" data-column="quantity" checked style="margin-right: 8px;"> Quantity
									</label>
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="checkbox" class="column-checkbox" data-column="price" checked style="margin-right: 8px;"> Price
									</label>
								</div>
							</div>
							<div class="product-selection-dropdown" style="position: relative; display: inline-block;">
								<button type="button" class="product-selection-btn" style="padding: 8px 16px; border: 1px solid #FF9800; background-color: #FFF8E1; border-radius: 4px; cursor: pointer; font-size: 14px; color: #E65100;">
									Product Selection: <span class="product-selection-text">All Products Mandatory</span>
								</button>
								<div class="product-dropdown-content" style="display: none; position: absolute; background-color: white; min-width: 200px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; border-radius: 4px; padding: 8px; margin-top: 4px; left: 0;">
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="radio" name="product-selection" class="product-selection-radio" value="all-mandatory" checked style="margin-right: 8px;"> All Products Mandatory
									</label>
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="radio" name="product-selection" class="product-selection-radio" value="all-optional" style="margin-right: 8px;"> All Products Optional
									</label>
									<label style="display: block; padding: 8px; cursor: pointer;">
										<input type="radio" name="product-selection" class="product-selection-radio" value="only-one" style="margin-right: 8px;"> Only One Product
									</label>
								</div>
							</div>
						</div>
						<button type="button" class="delete-table-btn" style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
							Delete Quote Table
						</button>
					</div>
				</div>
			</div>
		`;
		editor.insertContent(tableHtml);

		// Find the newly inserted quote table
		const quoteTables = editor.dom.select(".quote-block");
		const newQuoteTable = quoteTables[quoteTables.length - 1]; // Get the last one (newly inserted)

		// Setup the newly inserted quote table
		setupQuoteTable(editor, newQuoteTable);
	};

	// Separate function to set up a quote table's functionality
	const setupQuoteTable = (editor: TinyMCEEditor, quoteTable: HTMLElement) => {
		// Get elements within this specific quote table
		const importBtn = editor.dom.select(".import-products-btn", quoteTable)[0];
		const addBtn = editor.dom.select(".add-product-btn", quoteTable)[0];
		const deleteTableBtn = editor.dom.select(
			".delete-table-btn",
			quoteTable,
		)[0];
		const columnVisibilityBtn = editor.dom.select(
			".column-visibility-btn",
			quoteTable,
		)[0];
		const columnDropdown = editor.dom.select(
			".column-dropdown-content",
			quoteTable,
		)[0];
		const columnCheckboxes = editor.dom.select(".column-checkbox", quoteTable);
		const productSelectionBtn = editor.dom.select(
			".product-selection-btn",
			quoteTable,
		)[0];
		const productDropdown = editor.dom.select(
			".product-dropdown-content",
			quoteTable,
		)[0];
		const productSelectionRadios = editor.dom.select(
			".product-selection-radio",
			quoteTable,
		);
		const titleEditable = editor.dom.select(
			".quote-title-editable",
			quoteTable,
		)[0] as HTMLElement;
		const descriptionEditable = editor.dom.select(
			".quote-description-editable",
			quoteTable,
		)[0] as HTMLElement;
		const quoteBody = editor.dom.select(
			".quote-body",
			quoteTable,
		)[0] as HTMLElement;

		// Setup drag and drop for this quote table
		setupDragAndDrop(editor, quoteBody);

		// Calculate and update the summary
		updateQuoteSummary(editor, quoteTable);

		// Setup product selection dropdown
		if (productSelectionBtn && productDropdown) {
			// Make sure dropdown is initially hidden
			productDropdown.style.display = "none";

			// Get the current selection from the quote table data attribute
			const currentSelection =
				quoteTable.getAttribute("data-product-selection") ||
				productSelectionType;

			// Set the correct radio button as checked
			Array.from(productSelectionRadios).forEach((radio) => {
				const inputRadio = radio as HTMLInputElement;
				if (inputRadio.value === currentSelection) {
					inputRadio.checked = true;
				}
			});

			// Update the button text
			const selectionTextElement = editor.dom.select(
				".product-selection-text",
				quoteTable,
			)[0];
			if (selectionTextElement) {
				if (currentSelection === "all-mandatory") {
					selectionTextElement.textContent = "All Products Mandatory";
				} else if (currentSelection === "all-optional") {
					selectionTextElement.textContent = "All Products Optional";
				} else if (currentSelection === "only-one") {
					selectionTextElement.textContent = "Only One Product";
				}
			}

			// Toggle dropdown on button click
			productSelectionBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				productDropdown.style.display =
					productDropdown.style.display === "none" ? "block" : "none";
			};

			// Handle radio button changes
			Array.from(productSelectionRadios).forEach((radio) => {
				const inputRadio = radio as HTMLInputElement;
				inputRadio.onclick = (e) => {
					e.stopPropagation();

					// Set this radio as checked
					inputRadio.checked = true;

					const newSelectionType = inputRadio.value as ProductSelectionType;

					// Update state
					setProductSelectionType(newSelectionType);

					// Update the data attribute on the quote table
					quoteTable.setAttribute("data-product-selection", newSelectionType);

					// Update the button text
					if (selectionTextElement) {
						if (newSelectionType === "all-mandatory") {
							selectionTextElement.textContent = "All Products Mandatory";
						} else if (newSelectionType === "all-optional") {
							selectionTextElement.textContent = "All Products Optional";
						} else if (newSelectionType === "only-one") {
							selectionTextElement.textContent = "Only One Product";
						}
					}

					// Add visual indicator based on selection type
					updateProductSelectionIndicator(editor, quoteTable, newSelectionType);

					// Close the dropdown
					productDropdown.style.display = "none";
				};
			});

			// Close dropdown when clicking outside
			document.addEventListener("click", (e) => {
				if (
					!productSelectionBtn.contains(e.target as Node) &&
					!productDropdown.contains(e.target as Node)
				) {
					productDropdown.style.display = "none";
				}
			});
		}

		if (importBtn) {
			importBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				setIsProductListOpen(true);
			};
		}

		if (addBtn) {
			addBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				setEditingProduct(undefined);
				setIsDrawerOpen(true);
			};
		}

		if (deleteTableBtn) {
			deleteTableBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (confirm("Are you sure you want to delete this quote table?")) {
					quoteTable.remove();
					editor.fire("Change");
				}
			};
		}

		if (columnVisibilityBtn) {
			columnVisibilityBtn.onclick = (e) => {
				e.preventDefault();
				e.stopPropagation();
				columnDropdown.style.display =
					columnDropdown.style.display === "none" ? "block" : "none";
			};

			// Close dropdown when clicking outside
			document.addEventListener("click", (e) => {
				if (
					!columnVisibilityBtn.contains(e.target as Node) &&
					!columnDropdown.contains(e.target as Node)
				) {
					columnDropdown.style.display = "none";
				}
			});
		}

		if (columnCheckboxes.length) {
			Array.from(columnCheckboxes).forEach((checkbox) => {
				const inputCheckbox = checkbox as HTMLInputElement;
				inputCheckbox.onclick = (e) => {
					e.stopPropagation();
					const column = inputCheckbox.getAttribute(
						"data-column",
					) as keyof ColumnVisibility;
					const newVisibility = {
						...columnVisibility,
						[column]: inputCheckbox.checked,
					};
					setColumnVisibility(newVisibility);
					updateTableColumns(editor, newVisibility);
				};
			});
		}

		// Setup editable fields with minimal event handling
		if (titleEditable) {
			// Setup placeholder behavior
			titleEditable.addEventListener("focus", function () {
				if (!this.textContent?.trim()) {
					this.removeAttribute("data-placeholder-visible");
				}
			});

			titleEditable.addEventListener("blur", function () {
				if (!this.textContent?.trim()) {
					this.setAttribute("data-placeholder-visible", "true");
				}
			});

			// Initialize placeholder
			if (!titleEditable.textContent?.trim()) {
				titleEditable.setAttribute("data-placeholder-visible", "true");
			}
		}

		if (descriptionEditable) {
			// Setup placeholder behavior
			descriptionEditable.addEventListener("focus", function () {
				if (!this.textContent?.trim()) {
					this.removeAttribute("data-placeholder-visible");
				}
			});

			descriptionEditable.addEventListener("blur", function () {
				if (!this.textContent?.trim()) {
					this.setAttribute("data-placeholder-visible", "true");
				}
			});

			// Initialize placeholder
			if (!descriptionEditable.textContent?.trim()) {
				descriptionEditable.setAttribute("data-placeholder-visible", "true");
			}
		}
	};

	// Setup drag and drop functionality for a specific quote body
	const setupDragAndDrop = (editor: TinyMCEEditor, quoteBody: HTMLElement) => {
		// Create a unique ID for this quote body if it doesn't have one
		if (!quoteBody.id) {
			quoteBody.id = `quote-body-${Date.now()}`;
		}

		// Make sure the quote block is not draggable
		const quoteBlock = quoteBody.closest(".quote-block");
		if (quoteBlock) {
			quoteBlock.setAttribute("draggable", "false");
		}

		// Add drag handles to all rows if they don't have them
		const rows = editor.dom.select(".quote-row", quoteBody);
		rows.forEach((row) => {
			// Make sure the row itself is not draggable
			row.setAttribute("draggable", "false");

			// Check if the row already has a drag handle
			if (!editor.dom.select(".drag-handle", row).length) {
				// Create a drag handle element
				const dragHandle = editor.dom.create(
					"div",
					{
						class: "drag-handle",
						style:
							"cursor: grab; display: flex; align-items: center; justify-content: center; margin-right: 8px;",
						draggable: "true",
					},
					`
					<div style="width: 12px; height: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px;">
						<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
						<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
						<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
					</div>
				`,
				);

				// Insert the drag handle at the beginning of the row
				row.insertBefore(dragHandle, row.firstChild);
			}
		});

		// Setup drag event listeners
		rows.forEach((row) => {
			const dragHandle = editor.dom.select(".drag-handle", row)[0];
			if (dragHandle) {
				// Make the drag handle draggable
				dragHandle.setAttribute("draggable", "true");

				// Add event listeners
				dragHandle.addEventListener("mousedown", (e) => {
					// Stop propagation to prevent the editor from handling this event
					e.stopPropagation();
				});

				dragHandle.addEventListener("dragstart", (e) => {
					// Stop propagation to prevent parent elements from being dragged
					e.stopPropagation();

					const target = e.target as HTMLElement;
					const rowElement = target.closest(".quote-row") as HTMLElement;
					if (rowElement) {
						e.dataTransfer?.setData(
							"text/plain",
							rowElement.getAttribute("data-row-id") || "",
						);
						rowElement.style.opacity = "0.5";
					}
				});

				dragHandle.addEventListener("dragend", (e) => {
					e.stopPropagation();
					const target = e.target as HTMLElement;
					const rowElement = target.closest(".quote-row") as HTMLElement;
					if (rowElement) {
						rowElement.style.opacity = "1";
					}
				});
			}

			// Make the row a drop target
			row.addEventListener("dragover", (e) => {
				e.preventDefault();
				e.stopPropagation();
				const target = e.target as HTMLElement;
				const rowElement = target.closest(".quote-row") as HTMLElement;
				if (rowElement) {
					// Add a visual indicator for the drop position
					const rect = rowElement.getBoundingClientRect();
					const relativeY = e.clientY - rect.top;

					// Remove any existing drop indicators
					editor.dom.select(".drop-indicator").forEach((el) => el.remove());

					// Create a drop indicator
					const indicator = editor.dom.create("div", {
						class: "drop-indicator",
						style: `position: absolute; height: 2px; background-color: #2196F3; width: 100%; left: 0; ${
							relativeY < rect.height / 2 ? "top: 0;" : "bottom: 0;"
						}`,
					});

					rowElement.style.position = "relative";
					rowElement.appendChild(indicator);
				}
			});

			row.addEventListener("dragleave", (e) => {
				e.stopPropagation();
				// Remove drop indicators
				editor.dom.select(".drop-indicator").forEach((el) => el.remove());
			});

			row.addEventListener("drop", (e) => {
				e.preventDefault();
				e.stopPropagation();
				const draggedId = e.dataTransfer?.getData("text/plain");
				const target = e.target as HTMLElement;
				const rowElement = target.closest(".quote-row") as HTMLElement;

				if (draggedId && rowElement) {
					const draggedRow = editor.dom.select(
						`[data-row-id="${draggedId}"]`,
					)[0];
					if (draggedRow && draggedRow !== rowElement) {
						// Determine if we should insert before or after the target row
						const rect = rowElement.getBoundingClientRect();
						const relativeY = e.clientY - rect.top;

						if (relativeY < rect.height / 2) {
							// Insert before
							quoteBody.insertBefore(draggedRow, rowElement);
						} else {
							// Insert after
							if (rowElement.nextSibling) {
								quoteBody.insertBefore(draggedRow, rowElement.nextSibling);
							} else {
								quoteBody.appendChild(draggedRow);
							}
						}

						// Notify TinyMCE of the change
						editor.fire("Change");
					}
				}

				// Remove drop indicators
				editor.dom.select(".drop-indicator").forEach((el) => el.remove());
			});
		});
	};

	// Function to update visual indicators based on product selection type
	const updateProductSelectionIndicator = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
		selectionType: ProductSelectionType,
	) => {
		const rows = editor.dom.select(".quote-row", quoteTable);

		// Remove any existing indicators
		rows.forEach((row) => {
			row.classList.remove(
				"product-mandatory",
				"product-optional",
				"product-exclusive",
			);
		});

		// Add appropriate indicators based on selection type
		rows.forEach((row) => {
			if (selectionType === "all-mandatory") {
				row.classList.add("product-mandatory");

				// Remove checkboxes if they exist
				const productNameCell = row.children[1] as HTMLElement;
				const checkbox = productNameCell.querySelector(".product-checkbox");
				if (checkbox) {
					checkbox.remove();
				}
			} else if (selectionType === "all-optional") {
				row.classList.add("product-optional");

				// Add checkbox if it doesn't exist
				const productNameCell = row.children[1] as HTMLElement;
				if (!productNameCell.querySelector(".product-checkbox")) {
					const checkbox = editor.dom.create("input", {
						type: "checkbox",
						class: "product-checkbox",
						checked: "checked",
						style:
							"margin-right: 8px; width: 16px; height: 16px; cursor: pointer;",
					});

					// Insert checkbox at the beginning of the product name cell
					if (productNameCell.firstChild) {
						productNameCell.insertBefore(checkbox, productNameCell.firstChild);
					} else {
						productNameCell.appendChild(checkbox);
					}
				}
			} else if (selectionType === "only-one") {
				row.classList.add("product-exclusive");

				// Remove checkboxes if they exist
				const productNameCell = row.children[1] as HTMLElement;
				const checkbox = productNameCell.querySelector(".product-checkbox");
				if (checkbox) {
					checkbox.remove();
				}
			}
		});

		// Add click handlers for checkboxes
		const checkboxes = editor.dom.select(".product-checkbox", quoteTable);
		Array.from(checkboxes).forEach((checkbox) => {
			checkbox.onclick = (e) => {
				e.stopPropagation();
				// Toggle the row's opacity based on checkbox state
				const row = (e.target as HTMLElement).closest(
					".quote-row",
				) as HTMLElement;
				if ((e.target as HTMLInputElement).checked) {
					row.style.opacity = "1";
				} else {
					row.style.opacity = "0.5";
				}

				// Update the summary after checkbox change
				updateQuoteSummary(editor, quoteTable);
			};
		});
	};

	const handleAddProduct = (data: ProductFormData) => {
		if (!currentEditor) return;

		const quoteBody = currentEditor.dom.select(".quote-body")[0];
		if (quoteBody) {
			const quoteTable = quoteBody.closest(".quote-block") as HTMLElement;
			const selectionType =
				quoteTable?.getAttribute("data-product-selection") ||
				productSelectionType;

			const rowId = data.rowId || `row-${Date.now()}`;
			let rowClass = "";

			// Add appropriate class based on selection type
			if (selectionType === "all-mandatory") {
				rowClass = "product-mandatory";
			} else if (selectionType === "all-optional") {
				rowClass = "product-optional";
			} else if (selectionType === "only-one") {
				rowClass = "product-exclusive";
			}

			// Add checkbox for optional products
			const optionalCheckbox =
				selectionType === "all-optional"
					? `<input type="checkbox" class="product-checkbox" checked style="margin-right: 8px; width: 16px; height: 16px; cursor: pointer;" />`
					: "";

			const rowHtml = `
				<div class="quote-row ${rowClass}" data-row-id="${rowId}" style="display: grid; grid-template-columns: 30px 3fr 1fr 1fr 80px; gap: 12px; padding: 12px; border-bottom: 1px solid #eee;" draggable="false">
					<div class="drag-handle" style="cursor: grab; display: flex; align-items: center; justify-content: center; margin-right: 8px;" draggable="true">
						<div style="width: 12px; height: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 2px;">
							<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
							<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
							<div style="width: 4px; height: 4px; border-radius: 50%; background: #666;"></div>
						</div>
					</div>
					<div style="color: #333;">
						${optionalCheckbox}
						<div style="display: flex; flex-direction: column;">
							<div style="font-weight: 500;">${currentEditor.dom.encode(
								data.productName,
							)}</div>
							${
								data.description
									? `<div style="color: #666; font-size: 0.9em; margin-top: 4px;">${currentEditor.dom.encode(
											data.description,
									  )}</div>`
									: ""
							}
						</div>
					</div>
					<div style="color: #333; text-align: center;">${currentEditor.dom.encode(
						data.quantity,
					)}</div>
					<div style="color: #333; text-align: right;">$${currentEditor.dom.encode(
						data.price,
					)}</div>
					<div style="display: flex; gap: 4px; justify-content: center;">
						<button class="edit-row-btn" style="padding: 4px 8px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;" data-row-id="${rowId}">Edit</button>
						<button class="delete-row-btn" style="padding: 4px 8px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;" data-row-id="${rowId}">Delete</button>
					</div>
				</div>
			`;

			if (data.rowId) {
				const existingRow = currentEditor.dom.select(
					`[data-row-id="${data.rowId}"]`,
				)[0];
				if (existingRow) {
					existingRow.outerHTML = rowHtml;
				}
			} else {
				// If "only-one" is selected and there's already a product, replace it
				if (selectionType === "only-one") {
					const existingRows = currentEditor.dom.select(
						".quote-row",
						quoteBody,
					);
					if (existingRows.length > 0) {
						// Replace the first row with the new one
						existingRows[0].outerHTML = rowHtml;
					} else {
						quoteBody.insertAdjacentHTML("beforeend", rowHtml);
					}
				} else {
					quoteBody.insertAdjacentHTML("beforeend", rowHtml);
				}
			}

			currentEditor.fire("Change");

			// Re-setup drag and drop after adding a new row
			setupDragAndDrop(currentEditor, quoteBody);

			// Update the quote summary
			if (quoteTable) {
				updateQuoteSummary(currentEditor, quoteTable);
			}
		}
	};

	const handleEditClick = (editor: TinyMCEEditor, rowId: string) => {
		const row = editor.dom.select(`[data-row-id="${rowId}"]`)[0];
		if (row) {
			const cells = row.children;
			const productData: ProductFormData = {
				productName: cells[1].textContent || "",
				description: cells[2].textContent || "",
				quantity: cells[3].textContent || "",
				price: (cells[4].textContent || "").replace("$", ""),
				rowId: rowId,
			};
			setEditingProduct(productData);
			setIsDrawerOpen(true);
		}
	};

	const handleDeleteClick = (editor: TinyMCEEditor, rowId: string) => {
		const row = editor.dom.select(`[data-row-id="${rowId}"]`)[0];
		if (row && confirm("Are you sure you want to delete this product?")) {
			const quoteBody = row.closest(".quote-body") as HTMLElement;
			const quoteTable = quoteBody?.closest(".quote-block") as HTMLElement;

			row.remove();
			editor.fire("Change");

			// Update the quote summary after deleting a row
			if (quoteTable) {
				updateQuoteSummary(editor, quoteTable);
			}
		}
	};

	const handleImportProducts = (products: ProductFormData[]) => {
		products.forEach((product) => handleAddProduct(product));
	};

	return (
		<div className="container">
			<h1>TinyMCE Editor</h1>
			<Editor
				tinymceScriptSrc={"/tinymce/tinymce.min.js"}
				init={{
					height: 500,
					menubar: true,
					plugins: [
						"advlist",
						"autolink",
						"lists",
						"link",
						"image",
						"charmap",
						"preview",
						"anchor",
						"searchreplace",
						"visualblocks",
						"code",
						"fullscreen",
						"insertdatetime",
						"media",
						"table",
						"help",
						"wordcount",
					],
					toolbar:
						"undo redo | blocks | " +
						"bold italic forecolor | alignleft aligncenter " +
						"removeformat | help | insertquotetable",
					setup: (editor) => {
						setCurrentEditor(editor);

						editor.ui.registry.addButton("insertquotetable", {
							text: "Add Quote Table",
							onAction: () => insertQuoteTable(editor),
						});

						editor.on("click", (e) => {
							const target = e.target as HTMLElement;
							if (target.classList.contains("edit-row-btn")) {
								e.preventDefault();
								const rowId = target.getAttribute("data-row-id");
								if (rowId) handleEditClick(editor, rowId);
							} else if (target.classList.contains("delete-row-btn")) {
								e.preventDefault();
								const rowId = target.getAttribute("data-row-id");
								if (rowId) handleDeleteClick(editor, rowId);
							}
						});

						// Setup any existing quote tables when editor initializes
						editor.on("init", () => {
							const existingQuoteTables = editor.dom.select(".quote-block");
							existingQuoteTables.forEach((table) => {
								setupQuoteTable(editor, table);
							});
						});

						// Setup new quote tables when content changes
						editor.on("SetContent", () => {
							const existingQuoteTables = editor.dom.select(".quote-block");
							existingQuoteTables.forEach((table) => {
								// Only setup tables that don't have event handlers yet
								if (!table.getAttribute("data-initialized")) {
									setupQuoteTable(editor, table);
									table.setAttribute("data-initialized", "true");
								}
							});
						});
					},
					content_style: `
						.quote-block { margin: 15px 0; }
						.add-product-btn:hover { background-color: #45a049; }
						.edit-row-btn:hover { background-color: #1976D2; }
						.delete-row-btn:hover { background-color: #d32f2f; }
						.delete-table-btn:hover { background-color: #d32f2f; }
						.column-visibility-btn:hover { background-color: #7B1FA2; }
						.quote-row:hover { background-color: #f5f5f5; }
						.quote-title-editable:empty:before, .quote-description-editable:empty:before {
							content: attr(data-placeholder);
							color: #aaa;
						}
						.quote-title-editable[data-placeholder-visible]:before, .quote-description-editable[data-placeholder-visible]:before {
							content: attr(data-placeholder);
							color: #aaa;
						}
						.drag-handle:hover { background-color: rgba(0,0,0,0.05); border-radius: 4px; }
						.product-mandatory::before { 
							content: "*";
							position: absolute;
							left: -10px;
							color: #f44336;
							font-weight: bold;
						}
						.product-optional::before { 
							content: "○";
							position: absolute;
							left: -10px;
							color: #2196F3;
							font-weight: bold;
						}
						.product-exclusive::before { 
							content: "◉";
							position: absolute;
							left: -10px;
							color: #FF9800;
							font-weight: bold;
						}
						.quote-row {
							position: relative;
						}
					`,
				}}
				initialValue="demo"
			/>
			<ProductDrawer
				isOpen={isDrawerOpen}
				onClose={() => {
					setIsDrawerOpen(false);
					setEditingProduct(undefined);
				}}
				onSubmit={handleAddProduct}
				editData={editingProduct}
			/>
			<ProductListDrawer
				isOpen={isProductListOpen}
				onClose={() => setIsProductListOpen(false)}
				onImport={handleImportProducts}
			/>
		</div>
	);
}

export default App;
