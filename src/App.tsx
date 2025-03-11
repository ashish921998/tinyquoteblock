import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { useState, useEffect } from "react";
import "./App.css";

interface ProductFormData {
	productName: string;
	description: string;
	quantity: string;
	price: string;
	discount: string;
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
	quantity: boolean;
	discount: boolean;
	price: boolean;
	amount: boolean;
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

// Mock user data for signature block
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

// Theme options for quote tables
interface QuoteTableTheme {
	id: string;
	name: string;
	headerBg: string;
	headerText: string;
	rowBg: string;
	rowAltBg: string; // Alternate row background
	rowText: string;
	borderColor: string;
	accentColor: string;
}

// Available themes for quote tables
const quoteTableThemes: QuoteTableTheme[] = [
	{
		id: "default",
		name: "Default",
		headerBg: "#fff",
		headerText: "#333333",
		rowBg: "#ffffff",
		rowAltBg: "#ffffff",
		rowText: "#333333",
		borderColor: "#eeeeee",
		accentColor: "#2196F3",
	},
	{
		id: "dark",
		name: "Dark",
		headerBg: "#343a40",
		headerText: "#ffffff",
		rowBg: "#212529",
		rowAltBg: "#2c3034",
		rowText: "#ffffff",
		borderColor: "#495057",
		accentColor: "#17a2b8",
	},
	{
		id: "blue",
		name: "Blue",
		headerBg: "#1976d2",
		headerText: "#ffffff",
		rowBg: "#f5f9ff",
		rowAltBg: "#e3f2fd",
		rowText: "#333333",
		borderColor: "#bbdefb",
		accentColor: "#2196F3",
	},
	{
		id: "green",
		name: "Green",
		headerBg: "#2e7d32",
		headerText: "#ffffff",
		rowBg: "#f1f8e9",
		rowAltBg: "#dcedc8",
		rowText: "#333333",
		borderColor: "#c5e1a5",
		accentColor: "#4caf50",
	},
	{
		id: "elegant",
		name: "Elegant",
		headerBg: "#37474f",
		headerText: "#ffffff",
		rowBg: "#ffffff",
		rowAltBg: "#f5f5f5",
		rowText: "#333333",
		borderColor: "#cfd8dc",
		accentColor: "#607d8b",
	},
];

// Mock list of users
const mockUsers: User[] = [
	{
		id: "user1",
		name: "John Doe",
		email: "john.doe@example.com",
		role: "Sales Manager",
	},
	{
		id: "user2",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		role: "Account Executive",
	},
	{
		id: "user3",
		name: "Michael Johnson",
		email: "michael.johnson@example.com",
		role: "Sales Representative",
	},
	{
		id: "user4",
		name: "Emily Davis",
		email: "emily.davis@example.com",
		role: "Customer Success Manager",
	},
	{
		id: "user5",
		name: "Robert Wilson",
		email: "robert.wilson@example.com",
		role: "CEO",
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
			discount: "0",
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
							background: "#fff",
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
			quantity: "1",
			price: "",
			discount: "0",
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
		setFormData({
			productName: "",
			description: "",
			quantity: "1",
			price: "",
			discount: "0",
		});
		onClose();
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
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
						<label
							htmlFor="productName"
							style={{ display: "block", marginBottom: "8px" }}
						>
							Product Name
						</label>
						<input
							type="text"
							id="productName"
							name="productName"
							value={formData.productName}
							onChange={handleChange}
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
						<label
							htmlFor="description"
							style={{ display: "block", marginBottom: "8px" }}
						>
							Description
						</label>
						<textarea
							id="description"
							name="description"
							value={formData.description}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								minHeight: "80px",
							}}
						/>
					</div>
					<div style={{ marginBottom: "16px" }}>
						<label
							htmlFor="quantity"
							style={{ display: "block", marginBottom: "8px" }}
						>
							Quantity
						</label>
						<input
							type="text"
							id="quantity"
							name="quantity"
							value={formData.quantity}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								minHeight: "80px",
							}}
						/>
					</div>
					<div style={{ marginBottom: "16px" }}>
						<label
							htmlFor="price"
							style={{ display: "block", marginBottom: "8px" }}
						>
							Price
						</label>
						<input
							type="text"
							id="price"
							name="price"
							value={formData.price}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
						/>
					</div>
					<div style={{ marginBottom: "16px" }}>
						<label
							htmlFor="discount"
							style={{ display: "block", marginBottom: "8px" }}
						>
							Discount (%)
						</label>
						<input
							type="text"
							id="discount"
							name="discount"
							value={formData.discount}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
							}}
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
	const [editingProduct, setEditingProduct] = useState<ProductFormData>();
	const [isProductListOpen, setIsProductListOpen] = useState(false);
	const [currentEditor, setCurrentEditor] = useState<TinyMCEEditor | null>(
		null,
	);
	const [productSelectionType] =
		useState<ProductSelectionType>("all-mandatory");
	const [taxRate, setTaxRate] = useState<number>(10); // Default tax rate of 10%
	const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
		productName: true,
		quantity: true,
		discount: true,
		price: true,
		amount: true,
	});

	const updateTableColumns = (
		editor: TinyMCEEditor,
		visibility: ColumnVisibility,
	) => {
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

		// Find all quote tables in the editor
		const quoteTables = editor.dom.select(".quote-block");
		quoteTables.forEach((quoteTable) => {
			// Update the header
			const header = editor.dom.select(".quote-header", quoteTable)[0];
			if (header) {
				header.style.gridTemplateColumns = gridTemplate;

				// Get all header cells
				const headerCells = header.children;

				// Hide/show specific columns in the header
				// First cell (index 0) is empty for the drag handle
				if (headerCells[1])
					(headerCells[1] as HTMLElement).style.display = visibility.productName
						? "block"
						: "none"; // Product Name
				if (headerCells[2])
					(headerCells[2] as HTMLElement).style.display = visibility.quantity
						? "block"
						: "none"; // Quantity
				if (headerCells[3])
					(headerCells[3] as HTMLElement).style.display = visibility.discount
						? "block"
						: "none"; // Discount
				if (headerCells[4])
					(headerCells[4] as HTMLElement).style.display = visibility.price
						? "block"
						: "none"; // Price
				if (headerCells[5])
					(headerCells[5] as HTMLElement).style.display = visibility.amount
						? "block"
						: "none"; // Amount
			}

			// Update all rows in this table
			const quoteBody = editor.dom.select(".quote-body", quoteTable)[0];
			if (quoteBody) {
				const rows = editor.dom.select(".quote-row", quoteBody);
				rows.forEach((row) => {
					row.style.gridTemplateColumns = gridTemplate;

					// Skip empty row which has a different structure
					if (row.classList.contains("empty-row")) return;

					// Get all cells in this row
					const cells = row.children;

					// Hide/show specific columns in each row
					// First cell (index 0) is for the drag handle or checkbox
					if (cells[1])
						(cells[1] as HTMLElement).style.display = visibility.productName
							? "block"
							: "none"; // Product Name
					if (cells[2])
						(cells[2] as HTMLElement).style.display = visibility.quantity
							? "block"
							: "none"; // Quantity
					if (cells[3])
						(cells[3] as HTMLElement).style.display = visibility.discount
							? "block"
							: "none"; // Discount
					if (cells[4])
						(cells[4] as HTMLElement).style.display = visibility.price
							? "block"
							: "none"; // Price
					if (cells[5])
						(cells[5] as HTMLElement).style.display = visibility.amount
							? "block"
							: "none"; // Amount
				});
			}

			// Force TinyMCE to update its content
			editor.fire("Change");
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
			const checkbox = productNameCell?.querySelector(
				".product-checkbox",
			) as HTMLInputElement;
			if (checkbox && !checkbox.checked) {
				return;
			}

			const quantity = parseFloat(cells[2]?.textContent || "0");
			const discount = parseFloat(cells[3]?.textContent || "0");
			const price = parseFloat((cells[4]?.textContent || "0").replace("$", ""));

			if (!isNaN(quantity) && !isNaN(price)) {
				// Apply discount if available
				const discountAmount = !isNaN(discount) ? (price * discount) / 100 : 0;
				const discountedPrice = price - discountAmount;
				subtotal += quantity * discountedPrice;
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
			<div class="quote-block" contenteditable="false" style="user-select: none; width: 681px;" draggable="false" data-product-selection="${productSelectionType}">
				<div class="quote-table" style="background: linear-gradient(rgb(207, 231, 253), rgb(255, 255, 255) 95px);">
					<div class="quote-title-section" style="padding: 16px; border-bottom: 1px solid #eee;">
						<div>
							<div style="display: flex; align-items: center; margin-bottom: 8px;">
								<div 
									class="quote-title-editable" 
									contenteditable="true" 
									style="flex: 0.7; color: black; outline: none; padding: 4px 8px; border-bottom: 1px dashed #ddd; min-height: 24px; font-size: 14px;"
									data-placeholder="Enter Section Name"
								></div>
								<button 
									type="button"
									class="description-toggle-btn" 
									style="margin-left: 8px; background-color: #2196F3; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;"
								>
									Add description
								</button>
								<button 
									type="button"
									class="dropdown-btn" 
									style="margin-left: 8px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;"
								>
									Options ▼
								</button>
							</div>
							<div class="quote-description-container" style="display: none; margin-top: 8px; width: 100%;">
								<div
									class="quote-description-editable" 
									contenteditable="true" 
									style="flex: 0.7; color: black; outline: none; padding: 4px 8px; border-bottom: 1px dashed #ddd; min-height: 24px; font-size: 14px;"
									data-placeholder="Enter section description"
								></div>
							</div>
						</div>
					</div>
					<div class="quote-header" style="background: #fff; padding: 12px; 1px solid #eee; display: grid; grid-template-columns: 30px 3fr 1fr 1fr 1fr 1fr; gap: 12px;">
						<div></div>
						<div style="font-weight: 600; color: #333;">Product Name</div>
						<div style="font-weight: 600; color: #333; text-align: center;">Quantity</div>
						<div style="font-weight: 600; color: #333; text-align: center;">Discount (%)</div>
						<div style="font-weight: 600; color: #333; text-align: right;">Price</div>
						<div style="font-weight: 600; color: #333; text-align: right;">Amount</div>
					</div>
					<div id="quote-body" class="quote-body" style="padding: 0 12px; background: #fff;">
						<!-- Rows will be inserted here -->
						<div class="quote-row empty-row" style="display: grid; grid-template-columns: 30px 3fr 1fr 1fr 1fr 1fr; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; position: relative; cursor: pointer; min-height: 50px; align-items: center; justify-content: center;" draggable="false">
							<div style="grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; gap: 8px;">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 5V19M5 12H19" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<span style="color: #4CAF50; font-weight: 500;">Click to Add Product</span>
							</div>
						</div>
					</div>
					<div class="quote-summary" style="padding: 16px; border-top: 1px solid #eee; background: #fff;">
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
						</div>
						<button type="button" class="delete-table-btn" style="background-color: #f44336; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">
							Delete Quote Table
						</button>
					</div>
				</div>
			</div>
		`;

		// Insert the quote table with a paragraph after it
		editor.insertContent(tableHtml + "<p>&nbsp;</p>");

		// Find the newly inserted quote table
		const quoteTables = editor.dom.select(".quote-block");
		const newQuoteTable = quoteTables[quoteTables.length - 1]; // Get the last one (newly inserted)

		// Setup the newly inserted quote table
		setupQuoteTable(editor, newQuoteTable);

		// Move cursor to the paragraph after the quote table
		const paragraphAfter = editor.dom.getNext(newQuoteTable, "p");
		if (paragraphAfter) {
			editor.selection.setCursorLocation(paragraphAfter, 0);
		}
	};

	// Setup a quote table with event handlers and functionality
	const setupQuoteTable = (editor: TinyMCEEditor, quoteTable: HTMLElement) => {
		// Find the quote body
		const quoteBody = editor.dom.select(
			".quote-body",
			quoteTable,
		)[0] as HTMLElement;
		if (!quoteBody) {
			console.error("Quote body not found!");
			return;
		}

		// Setup drag and drop for this quote table
		setupDragAndDrop(editor, quoteBody);

		// Calculate and update the summary
		updateQuoteSummary(editor, quoteTable);

		// Setup Add Product button
		const addProductBtn = editor.dom.select(".add-product-btn", quoteTable)[0];
		if (addProductBtn) {
			addProductBtn.addEventListener("click", () => {
				setIsDrawerOpen(true);
			});
		}

		// Setup empty row click handler
		const emptyRow = editor.dom.select(".empty-row", quoteBody)[0];
		if (emptyRow) {
			emptyRow.addEventListener("click", (e) => {
				// Create and show product dropdown
				const dropdown = createProductDropdown(editor, quoteTable);
				document.body.appendChild(dropdown);

				// Position the dropdown near the click
				positionDropdown(dropdown, e.clientX, e.clientY);

				// Add click outside listener to close dropdown
				// const closeDropdown = (event: MouseEvent) => {
				// 	if (!dropdown.contains(event.target as Node)) {
				// 		document?.body?.removeChild(dropdown);
				// 		document.removeEventListener("click", closeDropdown);
				// 	}
				// };

				// Delay adding the event listener to prevent immediate closing
				// setTimeout(() => {
				// 	document.addEventListener("click", closeDropdown);
				// }, 100);
			});
		}

		// Setup Import Products button
		const importProductsBtn = editor.dom.select(
			".import-products-btn",
			quoteTable,
		)[0];
		if (importProductsBtn) {
			importProductsBtn.addEventListener("click", () => {
				setIsProductListOpen(true);
			});
		}

		// Setup Delete Table button
		const deleteTableBtn = editor.dom.select(
			".delete-table-btn",
			quoteTable,
		)[0];
		if (deleteTableBtn) {
			deleteTableBtn.addEventListener("click", () => {
				if (confirm("Are you sure you want to delete this quote table?")) {
					quoteTable.remove();
					editor.fire("Change");
				}
			});
		}

		// Setup Options dropdown
		const optionsBtn = editor.dom.select(".antd-dropdown-btn", quoteTable)[0];
		const optionsMenu = editor.dom.select(".antd-dropdown-menu", quoteTable)[0];
		if (optionsBtn && optionsMenu) {
			// Toggle dropdown when button is clicked
			optionsBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				const isVisible = optionsMenu.style.display === "block";
				optionsMenu.style.display = isVisible ? "none" : "block";
			});

			// Close dropdown when clicking outside
			editor.getDoc().addEventListener("click", (e) => {
				const target = e.target as HTMLElement;
				if (!target.closest(".antd-dropdown-container")) {
					optionsMenu.style.display = "none";
				}
			});

			// Setup toggle buttons in the dropdown
			const toggleButtons = editor.dom.select(".toggle-btn", optionsMenu);
			toggleButtons.forEach((button) => {
				button.addEventListener("click", (e) => {
					e.stopPropagation();
					button.classList.toggle("active");

					// Apply the active style to the toggle button
					if (button.classList.contains("active")) {
						button.style.backgroundColor = "#1890ff";
						button.style.borderColor = "#1890ff";
						const toggleCircle = button.querySelector(".toggle-circle");
						if (toggleCircle) {
							(toggleCircle as HTMLElement).style.left = "22px";
						}
					} else {
						button.style.backgroundColor = "#e9e9e9";
						button.style.borderColor = "#d9d9d9";
						const toggleCircle = button.querySelector(".toggle-circle");
						if (toggleCircle) {
							(toggleCircle as HTMLElement).style.left = "2px";
						}
					}
				});
			});
		}

		// Setup Column Visibility button
		const columnVisibilityBtn = editor.dom.select(
			".column-visibility-btn",
			quoteTable,
		)[0];
		if (columnVisibilityBtn) {
			columnVisibilityBtn.addEventListener("click", () => {
				// Create a dropdown menu for column visibility options
				const dropdown = editor.dom.create(
					"div",
					{
						class: "column-visibility-dropdown",
						style:
							"position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 1000; min-width: 150px;",
					},
					`
					<div class="column-visibility-option" data-column="productName" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<input type="checkbox" checked style="margin-right: 8px;"> Product Name
					</div>
					<div class="column-visibility-option" data-column="quantity" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<input type="checkbox" checked style="margin-right: 8px;"> Quantity
					</div>
					<div class="column-visibility-option" data-column="discount" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<input type="checkbox" checked style="margin-right: 8px;"> Discount
					</div>
					<div class="column-visibility-option" data-column="price" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<input type="checkbox" checked style="margin-right: 8px;"> Price
					</div>
					<div class="column-visibility-option" data-column="amount" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<input type="checkbox" checked style="margin-right: 8px;"> Amount
					</div>
				`,
				);

				// Position the dropdown relative to the button
				columnVisibilityBtn.style.position = "relative";
				columnVisibilityBtn.appendChild(dropdown);

				// Setup event handlers for the dropdown options
				const options = editor.dom.select(
					".column-visibility-option",
					dropdown,
				);
				options.forEach((option) => {
					const checkbox = option.querySelector(
						"input[type=checkbox]",
					) as HTMLInputElement;

					option.addEventListener("click", () => {
						checkbox.checked = !checkbox.checked;

						// Update column visibility
						const visibility: ColumnVisibility = {
							productName: (
								editor.dom.select(
									'.column-visibility-option[data-column="productName"] input',
									dropdown,
								)[0] as HTMLInputElement
							).checked,
							quantity: (
								editor.dom.select(
									'.column-visibility-option[data-column="quantity"] input',
									dropdown,
								)[0] as HTMLInputElement
							).checked,
							discount: (
								editor.dom.select(
									'.column-visibility-option[data-column="discount"] input',
									dropdown,
								)[0] as HTMLInputElement
							).checked,
							price: (
								editor.dom.select(
									'.column-visibility-option[data-column="price"] input',
									dropdown,
								)[0] as HTMLInputElement
							).checked,
							amount: (
								editor.dom.select(
									'.column-visibility-option[data-column="amount"] input',
									dropdown,
								)[0] as HTMLInputElement
							).checked,
						};

						updateTableColumns(editor, visibility);
					});
				});

				// Close dropdown when clicking outside
				const closeDropdown = (e: MouseEvent) => {
					const target = e.target as HTMLElement;
					if (
						!target.closest(".column-visibility-dropdown") &&
						!target.closest(".column-visibility-btn")
					) {
						dropdown.remove();
						document.removeEventListener("click", closeDropdown);
					}
				};

				// Use setTimeout to avoid immediate triggering
				setTimeout(() => {
					document.addEventListener("click", closeDropdown);
				}, 0);
			});
		}

		// Setup edit and delete buttons for each row
		const rows = editor.dom.select(".quote-row", quoteBody);
		rows.forEach((row) => {
			const editBtn = editor.dom.select(".edit-row-btn", row)[0];
			const deleteBtn = editor.dom.select(".delete-row-btn", row)[0];
			const threeDotsBtn = editor.dom.select(".three-dots-btn", row)[0];
			const dropdownMenu = editor.dom.select(".dropdown-menu", row)[0];

			if (threeDotsBtn && dropdownMenu) {
				threeDotsBtn.addEventListener("click", (e) => {
					e.stopPropagation();

					// Close all other open dropdowns first
					editor.dom.select(".dropdown-menu.show").forEach((menu) => {
						if (menu !== dropdownMenu) {
							menu.classList.remove("show");
							menu.style.display = "none";
						}
					});

					// Toggle this dropdown
					const isVisible = dropdownMenu.classList.contains("show");
					if (isVisible) {
						dropdownMenu.classList.remove("show");
						dropdownMenu.style.display = "none";
					} else {
						dropdownMenu.classList.add("show");
						dropdownMenu.style.display = "block";
					}
				});
			}

			if (editBtn) {
				editBtn.addEventListener("click", (e) => {
					e.stopPropagation();

					// Close dropdown if open
					if (dropdownMenu) {
						dropdownMenu.classList.remove("show");
						dropdownMenu.style.display = "none";
					}

					// Get the row ID
					const rowId = editBtn.getAttribute("data-row-id");
					if (rowId) {
						handleEditClick(editor, rowId);
					}
				});
			}

			if (deleteBtn) {
				deleteBtn.addEventListener("click", (e) => {
					e.stopPropagation();

					// Close dropdown if open
					if (dropdownMenu) {
						dropdownMenu.classList.remove("show");
						dropdownMenu.style.display = "none";
					}

					// Get the row ID
					const rowId = deleteBtn.getAttribute("data-row-id");
					if (rowId) {
						handleDeleteClick(editor, rowId);
					}
				});
			}
		});

		// Setup editable cells
		const editableCells = editor.dom.select(".editable-cell", quoteTable);
		setupEditableCells(editor, editableCells);

		// Create and add the theme selector
		createThemeSelector(editor, quoteTable);

		// Apply the default theme
		applyThemeToQuoteTable(editor, quoteTable, "default");
	};

	// Setup drag and drop functionality for a specific quote body
	const setupDragAndDrop = (editor: TinyMCEEditor, quoteBody: HTMLElement) => {
		// First, make sure we're working with the DOM in the editor's iframe
		const editorDoc = editor.getDoc();

		// Create a unique ID for this quote body if it doesn't have one
		if (!quoteBody.id) {
			quoteBody.id = `quote-body-${Date.now()}`;
		}

		// Make sure the quote block is not draggable
		const quoteBlock = quoteBody.closest(".quote-block");
		if (quoteBlock) {
			quoteBlock.setAttribute("draggable", "false");
		}

		// Get all rows in the quote body, excluding the empty row
		const rows = editor.dom.select(".quote-row:not(.empty-row)", quoteBody);

		// Track the currently dragged row
		let draggedRow: HTMLElement | null = null;

		// Clean up any existing drag handles first
		editor.dom.select(".drag-handle", quoteBody).forEach((handle) => {
			handle.remove();
		});

		// Add drag handles to all rows (except empty row)
		rows.forEach((row) => {
			// Make sure the row itself is not draggable
			row.setAttribute("draggable", "false");

			// Create a new drag handle element
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
		});

		// Use event delegation for better performance and to avoid issues with event listeners
		// Add a single mousedown listener to the quote body
		quoteBody.addEventListener("mousedown", function (e) {
			const target = e.target as HTMLElement;
			const dragHandle = target.closest(".drag-handle");

			if (dragHandle) {
				// Stop propagation to prevent the editor from handling this event
				e.stopPropagation();

				// Find the row that contains this drag handle
				const row = dragHandle.closest(".quote-row") as HTMLElement;
				if (row) {
					// Set this row as the one being dragged
					draggedRow = row;

					// Make the drag handle draggable
					dragHandle.setAttribute("draggable", "true");

					// Add a one-time dragstart listener to the handle
					dragHandle.addEventListener(
						"dragstart",
						function onDragStart(event) {
							// Remove this listener after it's used
							dragHandle.removeEventListener("dragstart", onDragStart);

							// Cast the event to DragEvent to access dataTransfer
							const dragEvent = event as DragEvent;

							// Set the drag effect
							if (dragEvent.dataTransfer) {
								dragEvent.dataTransfer.setData("text/plain", "dragging");
								dragEvent.dataTransfer.effectAllowed = "move";
							}

							// Add a visual indication that the row is being dragged
							row.style.opacity = "0.5";

							// Prevent the editor from handling this event
							dragEvent.stopPropagation();
						},
						{ once: true },
					);

					// Add a one-time dragend listener to the handle
					dragHandle.addEventListener(
						"dragend",
						function onDragEnd() {
							// Reset the dragged row's appearance
							if (draggedRow) {
								draggedRow.style.opacity = "1";
							}

							// Clear the dragged row reference
							draggedRow = null;

							// Remove all drop indicators
							editor.dom
								.select(".drop-indicator", quoteBody)
								.forEach((el) => el.remove());
						},
						{ once: true },
					);
				}
			}
		});

		// Add dragover listener to the quote body for drop indicators
		quoteBody.addEventListener("dragover", function (e) {
			// Only proceed if we have a row being dragged
			if (!draggedRow) return;

			e.preventDefault();

			// Find the row being dragged over
			const target = e.target as HTMLElement;
			const rowBeingDraggedOver = target.closest(".quote-row") as HTMLElement;

			// Only proceed if we're dragging over a different row
			if (rowBeingDraggedOver && rowBeingDraggedOver !== draggedRow) {
				// Determine if we should show the indicator above or below the row
				const rect = rowBeingDraggedOver.getBoundingClientRect();
				const relativeY = e.clientY - rect.top;
				const insertBefore = relativeY < rect.height / 2;

				// Remove any existing drop indicators
				editor.dom
					.select(".drop-indicator", quoteBody)
					.forEach((el) => el.remove());

				// Create a drop indicator
				const indicator = editor.dom.create("div", {
					class: "drop-indicator",
					style: `position: absolute; height: 3px; background-color: #2196F3; width: 100%; left: 0; ${
						insertBefore ? "top: 0;" : "bottom: 0;"
					} z-index: 1000;`,
				});

				// Position the indicator
				rowBeingDraggedOver.style.position = "relative";
				rowBeingDraggedOver.appendChild(indicator);
			}
		});

		// Add drop listener to the quote body
		quoteBody.addEventListener("drop", function (e) {
			// Only proceed if we have a row being dragged
			if (!draggedRow) return;

			e.preventDefault();
			e.stopPropagation();

			// Find the row being dropped onto
			const target = e.target as HTMLElement;
			const rowBeingDroppedOn = target.closest(".quote-row") as HTMLElement;

			// Only proceed if we're dropping onto a different row
			if (rowBeingDroppedOn && rowBeingDroppedOn !== draggedRow) {
				// Determine if we should insert before or after the target row
				const rect = rowBeingDroppedOn.getBoundingClientRect();
				const relativeY = e.clientY - rect.top;

				if (relativeY < rect.height / 2) {
					// Insert before
					quoteBody.insertBefore(draggedRow, rowBeingDroppedOn);
				} else {
					// Insert after
					if (rowBeingDroppedOn.nextSibling) {
						quoteBody.insertBefore(draggedRow, rowBeingDroppedOn.nextSibling);
					} else {
						quoteBody.appendChild(draggedRow);
					}
				}

				// Reset the dragged row's appearance
				draggedRow.style.opacity = "1";

				// Notify TinyMCE of the change
				editor.fire("Change");

				// Update the quote summary
				const quoteTable = quoteBody.closest(".quote-block") as HTMLElement;
				if (quoteTable) {
					updateQuoteSummary(editor, quoteTable);
				}
			}

			// Clear the dragged row reference
			draggedRow = null;

			// Remove all drop indicators
			editor.dom
				.select(".drop-indicator", quoteBody)
				.forEach((el) => el.remove());
		});

		// Add dragend listener to the document to clean up if the drag is cancelled
		editorDoc.addEventListener("dragend", function () {
			// Reset any dragged row's appearance
			if (draggedRow) {
				draggedRow.style.opacity = "1";
			}

			// Clear the dragged row reference
			draggedRow = null;

			// Remove all drop indicators
			editor.dom
				.select(".drop-indicator", quoteBody)
				.forEach((el) => el.remove());
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
				const checkbox = productNameCell?.querySelector(".product-checkbox");
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
				const checkbox = productNameCell?.querySelector(".product-checkbox");
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
			// Hide the empty row when adding a product
			const emptyRow = currentEditor.dom.select(".empty-row", quoteBody)[0];
			if (emptyRow) {
				emptyRow.style.display = "none";
			}

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

			// Log the data being added

			// Calculate amount (price * quantity)
			const price = parseFloat(data.price) || 0;
			const quantity = parseFloat(data.quantity) || 0;
			const amount = price * quantity;

			const rowHtml = `
				<div class="quote-row ${rowClass}" data-row-id="${rowId}" style="display: grid; grid-template-columns: 30px 3fr 1fr 1fr 1fr 1fr; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; position: relative;" draggable="false">
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
					<div class="editable-cell quantity-cell" style="color: #333; text-align: center;" contenteditable="true" data-original-value="${currentEditor.dom.encode(
						data.quantity,
					)}" data-field="quantity">${currentEditor.dom.encode(
				data.quantity,
			)}</div>
					<div class="editable-cell discount-cell" style="color: #333; text-align: center;" contenteditable="true" data-original-value="${currentEditor.dom.encode(
						data.discount,
					)}" data-field="discount">${currentEditor.dom.encode(
				data.discount,
			)}%</div>
					<div class="editable-cell price-cell" style="color: #333; text-align: right;" contenteditable="true" data-original-value="${currentEditor.dom.encode(
						data.price,
					)}" data-field="price">$${currentEditor.dom.encode(data.price)}</div>
					<div class="amount-cell" style="color: #333; text-align: right;">$${amount.toFixed(
						2,
					)}</div>
					<div class="row-actions" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: none;">
						<button class="three-dots-btn" style="width: 30px; height: 30px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;" data-row-id="${rowId}">
							<div style="width: 18px; height: 18px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px;">
								<div style="width: 4px; height: 4px; border-radius: 50%; background: #333;"></div>
								<div style="width: 4px; height: 4px; border-radius: 50%; background: #333;"></div>
								<div style="width: 4px; height: 4px; border-radius: 50%; background: #333;"></div>
							</div>
						</button>
						<div class="dropdown-menu" style="display: none; position: absolute; right: 0; top: 100%; background: white; border: 1px solid #eee; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 1000; min-width: 120px;">
							<div class="dropdown-item edit-row-btn" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;" data-row-id="${rowId}">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M16.4745 5.40768L18.5917 7.52483M17.8358 3.54106L11.6002 9.77661C11.3242 10.0526 11.1382 10.4001 11.0621 10.7785L10.5 14L13.7215 13.4379C14.0999 13.3618 14.4474 13.1758 14.7234 12.8998L20.9589 6.66421C21.2821 6.34106 21.4637 5.91017 21.4637 5.46106C21.4637 5.01195 21.2821 4.58106 20.9589 4.25791L19.7419 3.04106C19.4188 2.71791 18.9879 2.5363 18.5388 2.5363C18.0897 2.5363 17.6588 2.71791 17.3356 3.04106L17.8358 3.54106Z" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M19 15V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H9" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<span>Edit</span>
							</div>
							<div class="dropdown-item delete-row-btn" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 8px;" data-row-id="${rowId}">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M3 6H5H21" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M10 11V17" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
									<path d="M14 11V17" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<span>Delete</span>
							</div>
						</div>
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
			updateQuoteSummary(currentEditor, quoteTable);

			// Add click handlers for the new row's buttons
			const newRow = currentEditor.dom.select(
				`[data-row-id="${rowId}"]`,
				quoteBody,
			)[0];
			if (newRow) {
				const threeDotsBtn = currentEditor.dom.select(
					".three-dots-btn",
					newRow,
				)[0];
				const dropdownMenu = currentEditor.dom.select(
					".dropdown-menu",
					newRow,
				)[0];
				const editBtn = currentEditor.dom.select(".edit-row-btn", newRow)[0];
				const deleteBtn = currentEditor.dom.select(
					".delete-row-btn",
					newRow,
				)[0];

				if (threeDotsBtn) {
					threeDotsBtn.onclick = (e) => {
						e.preventDefault();
						e.stopPropagation();

						// Toggle dropdown menu
						if (dropdownMenu) {
							const isVisible = dropdownMenu.classList.contains("show");

							// Close all other open dropdowns first
							const allDropdowns = currentEditor.dom.select(
								".dropdown-menu.show",
							);
							allDropdowns.forEach((dropdown) => {
								dropdown.classList.remove("show");
								dropdown.style.display = "none";
							});

							if (!isVisible) {
								dropdownMenu.classList.add("show");
								dropdownMenu.style.display = "block";
							} else {
								dropdownMenu.classList.remove("show");
								dropdownMenu.style.display = "none";
							}
						}
					};
				}

				if (editBtn) {
					editBtn.onclick = (e) => {
						e.preventDefault();
						e.stopPropagation();

						// Close the dropdown
						if (dropdownMenu) {
							dropdownMenu.classList.remove("show");
							dropdownMenu.style.display = "none";
						}

						// Get the row ID
						const rowId = editBtn.getAttribute("data-row-id");
						if (rowId) {
							handleEditClick(currentEditor, rowId);
						}
					};
				}

				if (deleteBtn) {
					deleteBtn.onclick = (e) => {
						e.preventDefault();
						e.stopPropagation();

						// Close the dropdown
						if (dropdownMenu) {
							dropdownMenu.classList.remove("show");
							dropdownMenu.style.display = "none";
						}

						// Get the row ID
						const rowId = deleteBtn.getAttribute("data-row-id");
						if (rowId) {
							handleDeleteClick(currentEditor, rowId);
						}
					};
				}

				// Setup editable cells
				const editableCells = currentEditor.dom.select(
					".editable-cell",
					newRow,
				);
				setupEditableCells(currentEditor, editableCells);
			}

			// Update product selection indicator
			updateProductSelectionIndicator(
				currentEditor,
				quoteTable,
				selectionType as ProductSelectionType,
			);
		}
	};

	// Helper function to update the amount cell in a row
	const updateRowAmount = (row: HTMLElement, editor: TinyMCEEditor) => {
		const quantityCell = row.querySelector(".quantity-cell");
		const priceCell = row.querySelector(".price-cell");
		const discountCell = row.querySelector(".discount-cell");
		const amountCell = row.querySelector(".amount-cell");

		if (quantityCell && priceCell && discountCell && amountCell) {
			// Parse values, removing any formatting characters
			const quantity = parseFloat(
				quantityCell.textContent?.replace(/[^0-9.]/g, "") || "1",
			);
			const price = parseFloat(
				priceCell.textContent?.replace(/[$,]/g, "") || "0",
			);
			const discount = parseFloat(
				discountCell.textContent?.replace(/[%,]/g, "") || "0",
			);

			// Calculate amount
			const amount = quantity * price * (1 - discount / 100);

			// Format values with appropriate symbols and formatting
			quantityCell.textContent = quantity.toString();
			priceCell.textContent = `$${price.toFixed(2)}`;
			discountCell.textContent = `${discount}%`;
			amountCell.textContent = `$${amount.toFixed(2)}`;

			// Update the quote summary
			if (editor) {
				const quoteTable = row.closest(".quote-table");
				if (quoteTable) {
					updateQuoteSummary(editor, quoteTable as HTMLElement);
				}
			}
		}
	};

	const handleEditClick = (editor: TinyMCEEditor, rowId: string) => {
		const row = editor.dom.select(`[data-row-id="${rowId}"]`)[0];
		if (row) {
			const cells = row.children;
			const productData: ProductFormData = {
				productName: "",
				description: "",
				quantity: "1",
				price: "",
				discount: "0",
				rowId: rowId,
			};

			// Extract product name and description
			const productCell = cells[1];
			const productNameElement = productCell.querySelector(
				"div > div:first-child",
			);
			const descriptionElement = productCell.querySelector(
				"div > div:last-child",
			);

			productData.productName = productNameElement
				? productNameElement.textContent || ""
				: productCell.textContent || "";
			productData.description = descriptionElement
				? descriptionElement.textContent || ""
				: "";

			// Extract quantity, discount and price from editable cells
			const quantityCell = row.querySelector(".quantity-cell");
			const discountCell = row.querySelector(".discount-cell");
			const priceCell = row.querySelector(".price-cell");

			if (quantityCell) {
				productData.quantity =
					quantityCell.textContent?.replace(/[^0-9.]/g, "") || "1";
			}

			if (discountCell) {
				productData.discount =
					discountCell.textContent?.replace(/[%,]/g, "") || "0";
			}

			if (priceCell) {
				productData.price = priceCell.textContent?.replace(/[$,]/g, "") || "";
			}

			setEditingProduct(productData);
			setIsDrawerOpen(true);
		}
	};

	const handleDeleteClick = (editor: TinyMCEEditor, rowId: string) => {
		const row = editor.dom.select(`[data-row-id="${rowId}"]`)[0];
		if (row && confirm("Are you sure you want to delete this product?")) {
			const quoteBody = row.closest(".quote-body");
			row.remove();
			editor.fire("Change");

			// Update the quote summary
			if (quoteBody) {
				const quoteTable = quoteBody.closest(".quote-block") as HTMLElement;
				if (quoteTable) {
					updateQuoteSummary(editor, quoteTable);

					// Check if there are any product rows left
					const productRows = editor.dom.select(
						".quote-row:not(.empty-row)",
						quoteBody,
					);
					if (productRows.length === 0) {
						// Show the empty row if no products are left
						const emptyRow = editor.dom.select(".empty-row", quoteBody)[0];
						if (emptyRow) {
							emptyRow.style.display = "grid";
						}
					}
				}
			}
		}
	};

	const handleImportProducts = (products: ProductFormData[]) => {
		if (!currentEditor || products.length === 0) return;

		const quoteBody = currentEditor.dom.select(".quote-body")[0];
		if (quoteBody) {
			// Hide the empty row when importing products
			const emptyRow = currentEditor.dom.select(".empty-row", quoteBody)[0];
			if (emptyRow) {
				emptyRow.style.display = "none";
			}

			// Import each product
			products.forEach((product) => {
				handleAddProduct(product);
			});
		}
	};

	// Helper function to setup editable cells
	const setupEditableCells = (editor: TinyMCEEditor, cells: HTMLElement[]) => {
		cells.forEach((cell) => {
			// Handle focus to select all content
			cell.addEventListener("focus", () => {
				// Select all content when focused
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(cell);
				selection?.removeAllRanges();
				selection?.addRange(range);

				// Store original value for cancellation
				cell.setAttribute("data-previous-value", cell.textContent || "");
			});

			// Handle blur to update values
			cell.addEventListener("blur", () => {
				const field = cell.getAttribute("data-field");
				let value = cell.textContent || "";

				// Clean up the value based on field type
				if (field === "price") {
					// Remove $ and any non-numeric characters except decimal point
					value = value.replace(/[$,]/g, "");
					if (value && !isNaN(parseFloat(value))) {
						cell.textContent = "$" + parseFloat(value).toFixed(2);
					} else {
						cell.textContent = "$0.00";
						value = "0";
					}
				} else if (field === "discount") {
					// Remove % and any non-numeric characters
					value = value.replace(/[%,]/g, "");
					if (value && !isNaN(parseFloat(value))) {
						cell.textContent = parseFloat(value) + "%";
					} else {
						cell.textContent = "0%";
						value = "0";
					}
				} else if (field === "quantity") {
					// Remove any non-numeric characters
					value = value.replace(/[^0-9.]/g, "");
					if (value && !isNaN(parseFloat(value))) {
						cell.textContent = parseFloat(value).toString();
					} else {
						cell.textContent = "1";
						value = "1";
					}
				}

				// Update the amount cell
				const row = cell.closest(".quote-row") as HTMLElement;
				if (row) {
					updateRowAmount(row, editor);
				}

				// Notify TinyMCE of the change
				editor.fire("Change");
			});

			// Handle key events
			cell.addEventListener("keydown", (e) => {
				// Enter key should blur the cell
				if (e.key === "Enter") {
					e.preventDefault();
					cell.blur();
				}

				// Escape key should cancel the edit
				if (e.key === "Escape") {
					e.preventDefault();
					const previousValue = cell.getAttribute("data-previous-value") || "";
					cell.textContent = previousValue;
					cell.blur();
				}
			});
		});
	};

	// Function to insert a signature block with user selection
	const insertSignatureBlock = (editor: TinyMCEEditor) => {
		// Create a unique ID for this signature block
		const signatureBlockId = `signature-block-${Date.now()}`;

		// Create the HTML for the signature block
		const signatureBlockHtml = `
			<div id="${signatureBlockId}" class="signature-block" contenteditable="false" style="margin: 20px auto; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; width: 30%;">
				<div class="signature-header" style="margin-bottom: 15px; padding-bottom: 10px;">
					<h3 style="margin: 0; font-size: 16px; color: #333;">Signature Block</h3>
				</div>
				
				<div class="signature-user-selection">
					<div style="display: block; margin-bottom: 5px; font-weight: 500;">Select Signee(s)</div>
					<div class="user-select-wrapper" style="position: relative;">
						<div class="user-select-display" style="width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: flex; justify-content: space-between; align-items: center;" data-signature-id="${signatureBlockId}">
							<span class="selected-user-name">Select a user...</span>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</div>
						<div class="user-dropdown" style="display: none; position: absolute; width: 100%; max-height: 200px; overflow-y: auto; background: white; border: 1px solid #ddd; border-radius: 0 0 4px 4px; z-index: 1000; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
							${mockUsers
								.map(
									(user) => `
								<div class="user-option" data-user-id="${user.id}" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #f0f0f0;">
									<div style="font-weight: 500;">${user.name}</div>
									<div style="font-size: 12px; color: #666;">${user.email} - ${user.role}</div>
								</div>
							`,
								)
								.join("")}
						</div>
					</div>
				</div>
			</div>
		`;

		// Insert the signature block at the current cursor position with a paragraph after it
		editor.insertContent(signatureBlockHtml + "<p>&nbsp;</p>");

		// Find the newly inserted signature block
		const signatureBlock = editor.dom.get(signatureBlockId);

		// Setup event handlers for the signature block
		setTimeout(() => {
			setupSignatureBlock(editor, signatureBlockId);

			// Move cursor to the paragraph after the signature block
			if (signatureBlock) {
				const paragraphAfter = editor.dom.getNext(signatureBlock, "p");
				if (paragraphAfter) {
					editor.selection.setCursorLocation(paragraphAfter, 0);
				}
			}
		}, 100);
	};

	// Function to setup event handlers for a signature block
	const setupSignatureBlock = (
		editor: TinyMCEEditor,
		signatureBlockId: string,
	) => {
		const signatureBlock = editor.dom.get(signatureBlockId);
		if (!signatureBlock) return;

		// Prevent any editing of the signature block
		signatureBlock.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			// Return focus to editor
			editor.focus();
		});

		const selectDisplay = editor.dom.select(
			`.user-select-display[data-signature-id="${signatureBlockId}"]`,
			signatureBlock,
		)[0] as HTMLElement;
		const selectedUserName = editor.dom.select(
			".selected-user-name",
			selectDisplay,
		)[0];
		const dropdown = editor.dom.select(".user-dropdown", signatureBlock)[0];
		const userOptions = editor.dom.select(".user-option", signatureBlock);

		if (selectDisplay && dropdown) {
			// Toggle dropdown when display is clicked
			selectDisplay.addEventListener("mousedown", (e) => {
				e.preventDefault(); // Prevent default to avoid losing focus
				e.stopPropagation(); // Stop propagation to prevent editor handling

				const isVisible = dropdown.style.display === "block";
				dropdown.style.display = isVisible ? "none" : "block";
			});

			// Handle clicking outside to close dropdown
			editor.getDoc().addEventListener("mousedown", (e) => {
				const target = e.target as HTMLElement;
				if (!target.closest(`#${signatureBlockId} .user-select-wrapper`)) {
					dropdown.style.display = "none";
				}
			});
		}

		// Setup click handlers for user options
		userOptions.forEach((option: HTMLElement) => {
			option.addEventListener("mousedown", (e) => {
				e.preventDefault(); // Prevent default to avoid losing focus
				e.stopPropagation(); // Stop propagation to prevent editor handling

				const userId = option.getAttribute("data-user-id");
				const selectedUser = mockUsers.find((user) => user.id === userId);

				if (selectedUser && selectedUserName) {
					// Update the display with the selected user's name
					selectedUserName.textContent = selectedUser.name;

					// Hide the dropdown
					dropdown.style.display = "none";

					// Notify TinyMCE of the change
					editor.fire("Change");
				}
			});
		});
	};

	// Function to apply a theme to a quote table
	const applyThemeToQuoteTable = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
		themeId: string,
		customTheme?: QuoteTableTheme,
	) => {
		// Find the theme by ID or use custom theme
		const theme = customTheme || quoteTableThemes.find((t) => t.id === themeId);
		if (!theme) return;

		// Store the current theme ID on the quote table
		quoteTable.setAttribute("data-theme", themeId);

		// Apply theme to the quote-table div
		const quoteTableDiv = quoteTable.querySelector(".quote-table");
		if (quoteTableDiv) {
			// Set the background color of the quote-table div
			(
				quoteTableDiv as HTMLElement
			).style.background = `linear-gradient(${theme.headerBg}20, ${theme.rowBg} 95px)`;
			(quoteTableDiv as HTMLElement).style.borderColor = theme.borderColor;
		}

		// Apply accent color to buttons for visual consistency
		const buttons = editor.dom.select("button", quoteTable);
		buttons.forEach((button) => {
			button.style.borderColor = theme.accentColor;
		});

		// Notify TinyMCE of the change
		editor.fire("Change");
	};

	// Function to create a theme selector for a quote table
	const createThemeSelector = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
	) => {
		// Create a dropdown for theme selection
		const themeSelector = editor.dom.create(
			"div",
			{
				class: "theme-selector",
				style: "position: absolute; top: 10px; right: 10px; z-index: 100;",
			},
			`
			<button class="theme-selector-btn" style="background: #fff; border: 1px solid #ddd; border-radius: 4px; padding: 5px 10px; cursor: pointer; display: flex; align-items: center; font-size: 12px;">
				<span style="margin-right: 5px;">Theme</span>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
			<div class="theme-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 150px; max-height: 200px; overflow-y: auto; z-index: 1000;">
				${quoteTableThemes
					.map(
						(theme) => `
					<div class="theme-option" data-theme-id="${theme.id}" style="padding: 8px 12px; cursor: pointer; display: flex; align-items: center;">
						<div style="width: 16px; height: 16px; border-radius: 4px; background-color: ${theme.headerBg}; margin-right: 8px; border: 1px solid #ddd;"></div>
						<span>${theme.name}</span>
					</div>
				`,
					)
					.join("")}
			</div>
			`,
		);

		// Insert the theme selector into the quote table
		quoteTable.style.position = "relative";
		quoteTable.appendChild(themeSelector);

		// Setup event handlers for the theme selector
		const themeButton = editor.dom.select(
			".theme-selector-btn",
			themeSelector,
		)[0];
		const themeDropdown = editor.dom.select(
			".theme-dropdown",
			themeSelector,
		)[0];
		const themeOptions = editor.dom.select(".theme-option", themeSelector);

		// Toggle dropdown when button is clicked
		themeButton.addEventListener("click", () => {
			const isVisible = themeDropdown.style.display === "block";
			themeDropdown.style.display = isVisible ? "none" : "block";
		});

		// Handle clicking outside to close dropdown
		editor.getDoc().addEventListener("click", (e) => {
			const target = e.target as HTMLElement;
			if (!target.closest(".theme-selector")) {
				themeDropdown.style.display = "none";
			}
		});

		// Handle theme selection
		themeOptions.forEach((option) => {
			option.addEventListener("click", () => {
				const themeId = option.getAttribute("data-theme-id");
				if (themeId) {
					applyThemeToQuoteTable(editor, quoteTable, themeId);
					themeDropdown.style.display = "none";
				}
			});
		});
	};

	// Function to create a product dropdown
	const createProductDropdown = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
	) => {
		// Create dropdown container
		const dropdown = document.createElement("div");
		dropdown.className = "product-dropdown";
		dropdown.style.position = "fixed";
		dropdown.style.zIndex = "9999";
		dropdown.style.background = "white";
		dropdown.style.border = "1px solid #ddd";
		dropdown.style.borderRadius = "4px";
		dropdown.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
		dropdown.style.width = "250px";
		dropdown.style.maxHeight = "400px";
		dropdown.style.overflowY = "auto";
		dropdown.style.padding = "8px 0";

		// Add search input
		const searchContainer = document.createElement("div");
		searchContainer.style.padding = "0 12px 8px";
		searchContainer.style.borderBottom = "1px solid #eee";
		searchContainer.style.marginBottom = "8px";

		const searchInput = document.createElement("input");
		searchInput.type = "text";
		searchInput.placeholder = "Search products...";
		searchInput.style.width = "100%";
		searchInput.style.padding = "8px";
		searchInput.style.border = "1px solid #ddd";
		searchInput.style.borderRadius = "4px";
		searchInput.style.boxSizing = "border-box";

		searchContainer.appendChild(searchInput);
		dropdown.appendChild(searchContainer);

		// Add "Add New Product" option
		const addNewOption = document.createElement("div");
		addNewOption.className = "dropdown-option add-new-option";
		addNewOption.style.padding = "8px 12px";
		addNewOption.style.cursor = "pointer";
		addNewOption.style.display = "flex";
		addNewOption.style.alignItems = "center";
		addNewOption.style.color = "#4CAF50";
		addNewOption.style.fontWeight = "500";
		addNewOption.innerHTML = `
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
				<path d="M12 5V19M5 12H19" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
			Add New Product
		`;

		addNewOption.addEventListener("click", () => {
			// Remove dropdown
			if (dropdown.parentNode) {
				document.body.removeChild(dropdown);
			}

			// Open drawer to add new product
			setIsDrawerOpen(true);
		});

		dropdown.appendChild(addNewOption);

		// Add divider
		const divider = document.createElement("div");
		divider.style.height = "1px";
		divider.style.background = "#eee";
		divider.style.margin = "8px 0";
		dropdown.appendChild(divider);

		// Add recent/popular products
		const products = SAMPLE_PRODUCTS.slice(0, 5); // Show first 5 products

		products.forEach((product) => {
			const option = document.createElement("div");
			option.className = "dropdown-option";
			option.style.padding = "8px 12px";
			option.style.cursor = "pointer";
			option.style.display = "flex";
			option.style.alignItems = "center";
			option.style.justifyContent = "space-between";

			const productInfo = document.createElement("div");
			productInfo.innerHTML = `
				<div style="font-weight: 500;">${product.productName}</div>
				<div style="font-size: 12px; color: #666;">${product.description}</div>
			`;

			option.appendChild(productInfo);

			// Add quick-add button
			const addButton = document.createElement("button");
			addButton.innerHTML = "Add";
			addButton.style.background = "#f1f1f1";
			addButton.style.border = "1px solid #ddd";
			addButton.style.borderRadius = "4px";
			addButton.style.padding = "4px 8px";
			addButton.style.cursor = "pointer";

			addButton.addEventListener("click", (e) => {
				e.stopPropagation(); // Prevent option click

				// Add product to quote
				addProductToQuote(editor, quoteTable, product);

				// Remove dropdown
				if (dropdown.parentNode) {
					document.body.removeChild(dropdown);
				}
			});

			option.appendChild(addButton);

			// Add click handler for the entire option
			option.addEventListener("click", () => {
				// Add product to quote
				addProductToQuote(editor, quoteTable, product);

				// Remove dropdown
				if (dropdown.parentNode) {
					document.body.removeChild(dropdown);
				}
			});

			dropdown.appendChild(option);
		});

		// Add "View All Products" option
		const viewAllOption = document.createElement("div");
		viewAllOption.className = "dropdown-option view-all-option";
		viewAllOption.style.padding = "8px 12px";
		viewAllOption.style.cursor = "pointer";
		viewAllOption.style.display = "flex";
		viewAllOption.style.alignItems = "center";
		viewAllOption.style.justifyContent = "center";
		viewAllOption.style.color = "#2196F3";
		viewAllOption.style.borderTop = "1px solid #eee";
		viewAllOption.style.marginTop = "8px";
		viewAllOption.style.paddingTop = "8px";
		viewAllOption.innerHTML = "View All Products";

		viewAllOption.addEventListener("click", () => {
			// Remove dropdown
			if (dropdown.parentNode) {
				document.body.removeChild(dropdown);
			}

			// Open product list drawer
			setIsProductListOpen(true);
		});

		dropdown.appendChild(viewAllOption);

		// Add search functionality
		searchInput.addEventListener("input", () => {
			const searchTerm = searchInput.value.toLowerCase();
			const options = dropdown.querySelectorAll(
				".dropdown-option:not(.add-new-option):not(.view-all-option)",
			);

			options.forEach((option) => {
				const productName =
					option
						.querySelector("div > div:first-child")
						?.textContent?.toLowerCase() || "";
				if (productName.includes(searchTerm)) {
					(option as HTMLElement).style.display = "flex";
				} else {
					(option as HTMLElement).style.display = "none";
				}
			});
		});

		return dropdown;
	};

	// Function to position the dropdown
	const positionDropdown = (dropdown: HTMLElement, x: number, y: number) => {
		// Get viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calculate dropdown dimensions
		const dropdownWidth = dropdown.offsetWidth;
		const dropdownHeight = dropdown.offsetHeight;

		// Position dropdown
		let posX = x;
		let posY = y;

		// Ensure dropdown doesn't go off-screen to the right
		if (posX + dropdownWidth > viewportWidth) {
			posX = viewportWidth - dropdownWidth - 10;
		}

		// Ensure dropdown doesn't go off-screen at the bottom
		if (posY + dropdownHeight > viewportHeight) {
			posY = viewportHeight - dropdownHeight - 10;
		}

		dropdown.style.left = `${posX}px`;
		dropdown.style.top = `${posY}px`;
	};

	// Function to add a product to the quote
	const addProductToQuote = (
		editor: TinyMCEEditor,
		quoteTable: HTMLElement,
		product: MockProduct,
	) => {
		const quoteBody = editor.dom.select(".quote-body", quoteTable)[0];
		if (quoteBody) {
			// Create product form data from the mock product
			const productData: ProductFormData = {
				productName: product.productName,
				description: product.description,
				price: product.price,
				quantity: "1", // Default quantity
				discount: "0", // Default discount
			};

			// Use the existing handleAddProduct function
			handleAddProduct(productData);
		}
	};

	// Generic function to toggle any column visibility
	const toggleColumnVisibility = (
		editor: TinyMCEEditor,
		columnType: keyof ColumnVisibility,
		isHidden: boolean,
	) => {
		const quoteTable = editor.dom.select(".quote-table")[0];
		if (quoteTable) {
			// Get current visibility state
			const currentVisibility = columnVisibility;

			// Check current visibility of columns
			const quantityHeaders = editor.dom.select(".quantity-header", quoteTable);
			if (quantityHeaders.length > 0) {
				const computedStyle = window.getComputedStyle(quantityHeaders[0]);
				currentVisibility.quantity = computedStyle.display !== "none";
			}

			const discountHeaders = editor.dom.select(".discount-header", quoteTable);
			if (discountHeaders.length > 0) {
				const computedStyle = window.getComputedStyle(discountHeaders[0]);
				currentVisibility.discount = computedStyle.display !== "none";
			}

			const priceHeaders = editor.dom.select(".price-header", quoteTable);
			if (priceHeaders.length > 0) {
				const computedStyle = window.getComputedStyle(priceHeaders[0]);
				currentVisibility.price = computedStyle.display !== "none";
			}

			const amountHeaders = editor.dom.select(".amount-header", quoteTable);
			if (amountHeaders.length > 0) {
				const computedStyle = window.getComputedStyle(amountHeaders[0]);
				currentVisibility.amount = computedStyle.display !== "none";
			}

			// Update the specific column visibility
			currentVisibility[columnType] = !isHidden;
			setColumnVisibility(currentVisibility);

			// Update table columns with the new visibility settings
			updateTableColumns(editor, currentVisibility);
		}
	};

	return (
		<div className="container">
			<h1>TinyMCE Editor</h1>
			<Editor
				tinymceScriptSrc={"/tinymce/tinymce.min.js"}
				init={{
					height: 1000,
					width: 900,
					content_css: "/css/quote-styles.css",
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
						"removeformat | help | insertquotetable insertsignatureblock",
					setup: (editor) => {
						setCurrentEditor(editor);

						editor.ui.registry.addButton("insertquotetable", {
							text: "Add Quote Table",
							onAction: () => insertQuoteTable(editor),
						});

						editor.ui.registry.addButton("insertsignatureblock", {
							text: "Add Signature Block",
							onAction: () => insertSignatureBlock(editor),
						});

						// Add a click handler for the description toggle button
						editor.on("click", (e) => {
							const target = e.target as HTMLElement;

							// Handle description toggle button click
							if (target.classList.contains("description-toggle-btn")) {
								e.preventDefault();
								e.stopPropagation();

								// Find the quote table and description container
								const quoteTable = editor.dom.getParent(target, ".quote-block");
								if (!quoteTable) return;

								const titleSection = editor.dom.select(
									".quote-title-section",
									quoteTable,
								)[0];
								if (!titleSection) return;

								const descriptionContainer = titleSection.querySelector(
									".quote-description-container",
								) as HTMLElement;
								if (!descriptionContainer) return;

								// Toggle the description container visibility
								const isVisible = descriptionContainer.style.display !== "none";
								descriptionContainer.style.display = isVisible
									? "none"
									: "block";

								// Update the button text
								target.textContent = isVisible
									? "Add description"
									: "Hide description";

								// Force TinyMCE to update its content
								editor.fire("Change");
							}
							// Handle dropdown button click
							else if (target.classList.contains("dropdown-btn")) {
								e.preventDefault();
								e.stopPropagation();

								// Find any existing dropdown and remove it first
								const existingDropdown =
									editor.dom.select(".options-dropdown")[0];
								if (existingDropdown) {
									existingDropdown.parentNode?.removeChild(existingDropdown);
									return; // Toggle behavior
								}

								// Create dropdown element using TinyMCE's DOM API
								const dropdown = editor.dom.create(
									"div",
									{
										class: "options-dropdown",
										style:
											"position: absolute; background: white; border: 1px solid #ddd; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 1000; min-width: 150px;",
									},
									`
										<div class="dropdown-item" style="padding: 8px 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
											<span>Hide price</span>
											<div class="toggle-switch" style="position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;">
												<div class="toggle-circle" style="position: absolute; left: 2px; top: 2px; width: 12px; height: 12px; background: white; border-radius: 50%; transition: all 0.2s;"></div>
											</div>
										</div>
										<div class="dropdown-item" style="padding: 8px 12px; cursor: pointer; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
											<span>Hide quantity</span>
											<div class="toggle-switch" style="position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;">
												<div class="toggle-circle" style="position: absolute; left: 2px; top: 2px; width: 12px; height: 12px; background: white; border-radius: 50%; transition: all 0.2s;"></div>
											</div>
										</div>
										<div class="dropdown-item" style="padding: 8px 12px; cursor: pointer; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
											<span>Hide discount</span>
											<div class="toggle-switch" style="position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;">
												<div class="toggle-circle" style="position: absolute; left: 2px; top: 2px; width: 12px; height: 12px; background: white; border-radius: 50%; transition: all 0.2s;"></div>
											</div>
										</div>
										<div class="dropdown-item" style="padding: 8px 12px; cursor: pointer; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
											<span>Hide amount</span>
											<div class="toggle-switch" style="position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;">
												<div class="toggle-circle" style="position: absolute; left: 2px; top: 2px; width: 12px; height: 12px; background: white; border-radius: 50%; transition: all 0.2s;"></div>
											</div>
										</div>
									`,
								);

								// Check current column visibility and update toggle states
								const quoteTable = editor.dom.select(".quote-table")[0];
								let isPriceHidden = !columnVisibility.price;
								let isQuantityHidden = !columnVisibility.quantity;
								let isDiscountHidden = !columnVisibility.discount;
								let isAmountHidden = !columnVisibility.amount;

								if (quoteTable) {
									// Check if price headers are hidden by checking their display style
									const priceHeaders = editor.dom.select(
										".price-header",
										quoteTable,
									);
									if (priceHeaders.length > 0) {
										// Check the computed style to get the actual display value
										const computedStyle = window.getComputedStyle(
											priceHeaders[0],
										);
										isPriceHidden = computedStyle.display === "none";
										console.log(
											"Price column is currently hidden:",
											isPriceHidden,
										);
									}

									// Check if quantity headers are hidden
									const quantityHeaders = editor.dom.select(
										".quantity-header",
										quoteTable,
									);
									if (quantityHeaders.length > 0) {
										const computedStyle = window.getComputedStyle(
											quantityHeaders[0],
										);
										isQuantityHidden = computedStyle.display === "none";
										console.log(
											"Quantity column is currently hidden:",
											isQuantityHidden,
										);
									}

									// Check if discount headers are hidden
									const discountHeaders = editor.dom.select(
										".discount-header",
										quoteTable,
									);
									if (discountHeaders.length > 0) {
										const computedStyle = window.getComputedStyle(
											discountHeaders[0],
										);
										isDiscountHidden = computedStyle.display === "none";
									}

									// Check if amount headers are hidden
									const amountHeaders = editor.dom.select(
										".amount-header",
										quoteTable,
									);
									if (amountHeaders.length > 0) {
										const computedStyle = window.getComputedStyle(
											amountHeaders[0],
										);
										isAmountHidden = computedStyle.display === "none";
									}
								}

								// Get the parent container of the button
								const parentContainer = target.closest(".quote-title-section");
								if (!parentContainer) return;

								// Append the dropdown to the parent container
								parentContainer.appendChild(dropdown);

								// Position the dropdown below the button
								const buttonRect = target.getBoundingClientRect();
								const parentRect = parentContainer.getBoundingClientRect();

								// Calculate position relative to the parent
								const left = buttonRect.left - parentRect.left;
								const top = buttonRect.bottom - parentRect.top;

								dropdown.style.left = `${left}px`;
								dropdown.style.top = `${top}px`;

								// Add click event listeners to dropdown items
								const items = dropdown.querySelectorAll(".dropdown-item");
								items.forEach((item, index) => {
									// Add hover effects
									item.addEventListener("mouseover", () => {
										(item as HTMLElement).style.backgroundColor = "#f5f5f5";
									});
									item.addEventListener("mouseout", () => {
										(item as HTMLElement).style.backgroundColor = "white";
									});

									// Add click handler
									item.addEventListener("click", () => {
										// Handle the selected option without alerts
										// if (index === 0) {
										// 	// Toggle the switch for Hide price option
										// 	const toggleSwitch = item.querySelector(".toggle-switch");
										// 	const toggleCircle = item.querySelector(
										// 		".toggle-circle",
										// 	) as HTMLElement;

										// 	if (toggleSwitch) {
										// 		toggleSwitch.classList.toggle("active");
										// 		const isActive =
										// 			toggleSwitch.classList.contains("active");

										// 		if (isActive) {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "20px";
										// 		} else {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "2px";
										// 		}

										// 		// Toggle the price column visibility
										// 		toggleColumnVisibility(editor, "price", isActive);

										// 		console.log(
										// 			"Hide price toggled from item click:",
										// 			isActive,
										// 		);
										// 	}

										// 	// Don't close the dropdown when clicking the toggle
										// 	return;
										// } else if (index === 1) {
										// 	// Toggle the switch for Hide quantity option
										// 	const toggleSwitch = item.querySelector(".toggle-switch");
										// 	const toggleCircle = item.querySelector(
										// 		".toggle-circle",
										// 	) as HTMLElement;

										// 	if (toggleSwitch) {
										// 		toggleSwitch.classList.toggle("active");
										// 		const isActive =
										// 			toggleSwitch.classList.contains("active");

										// 		if (isActive) {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "20px";
										// 		} else {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "2px";
										// 		}

										// 		// Toggle the quantity column visibility
										// 		toggleColumnVisibility(editor, "quantity", isActive);
										// 	}

										// 	// Don't close the dropdown when clicking the toggle
										// 	return;
										// } else if (index === 2) {
										// 	// Toggle the switch for Hide discount option
										// 	const toggleSwitch = item.querySelector(".toggle-switch");
										// 	const toggleCircle = item.querySelector(
										// 		".toggle-circle",
										// 	) as HTMLElement;

										// 	if (toggleSwitch) {
										// 		toggleSwitch.classList.toggle("active");
										// 		const isActive =
										// 			toggleSwitch.classList.contains("active");

										// 		if (isActive) {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "20px";
										// 		} else {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "2px";
										// 		}

										// 		// Toggle the discount column visibility
										// 		toggleColumnVisibility(editor, "discount", isActive);
										// 	}

										// 	// Don't close the dropdown when clicking the toggle
										// 	return;
										// } else if (index === 3) {
										// 	// Toggle the switch for Hide amount option
										// 	const toggleSwitch = item.querySelector(".toggle-switch");
										// 	const toggleCircle = item.querySelector(
										// 		".toggle-circle",
										// 	) as HTMLElement;

										// 	if (toggleSwitch) {
										// 		toggleSwitch.classList.toggle("active");
										// 		const isActive =
										// 			toggleSwitch.classList.contains("active");

										// 		if (isActive) {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "20px";
										// 		} else {
										// 			toggleSwitch.setAttribute(
										// 				"style",
										// 				"position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;",
										// 			);
										// 			toggleCircle.style.left = "2px";
										// 		}

										// 		// Toggle the amount column visibility
										// 		toggleColumnVisibility(editor, "amount", isActive);
										// 	}

										// 	// Don't close the dropdown when clicking the toggle
										// 	return;
										// } else {
										// 	dropdown.parentNode?.removeChild(dropdown);
										// }
										type ColumnType =
											| "price"
											| "quantity"
											| "discount"
											| "amount";

										// Map index to column type for better readability
										const INDEX_TO_COLUMN: Record<number, ColumnType> = {
											0: "price",
											1: "quantity",
											2: "discount",
											3: "amount",
										};

										// Style constants to avoid repetition
										const SWITCH_STYLES = {
											active:
												"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
											inactive:
												"position: relative; width: 36px; height: 18px; background: #e9e9e9; border-radius: 10px; border: 1px solid #d9d9d9; cursor: pointer;",
										};

										// Handle toggle functionality
										if (index >= 0 && index <= 3) {
											const columnType = INDEX_TO_COLUMN[index];
											const toggleSwitch = item.querySelector(".toggle-switch");
											const toggleCircle = item.querySelector(
												".toggle-circle",
											) as HTMLElement;

											if (toggleSwitch) {
												toggleSwitch.classList.toggle("active");
												const isActive =
													toggleSwitch.classList.contains("active");

												// Apply appropriate styles based on active state
												toggleSwitch.setAttribute(
													"style",
													isActive
														? SWITCH_STYLES.active
														: SWITCH_STYLES.inactive,
												);
												toggleCircle.style.left = isActive ? "20px" : "2px";

												// Toggle column visibility
												toggleColumnVisibility(editor, columnType, isActive);
											}

											// Don't close the dropdown when clicking the toggle
											return;
										} else {
											// Close dropdown for other indices
											dropdown.parentNode?.removeChild(dropdown);
										}
									});
								});

								// Set initial toggle states based on current visibility
								const toggleSwitches =
									dropdown.querySelectorAll(".toggle-switch");

								// Price toggle (index 0)
								if (isPriceHidden && toggleSwitches[0]) {
									toggleSwitches[0].classList.add("active");
									toggleSwitches[0].setAttribute(
										"style",
										"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
									);
									const toggleCircle = toggleSwitches[0].querySelector(
										".toggle-circle",
									) as HTMLElement;
									if (toggleCircle) {
										toggleCircle.style.left = "20px";
									}
								}

								// Quantity toggle (index 1)
								if (isQuantityHidden && toggleSwitches[1]) {
									toggleSwitches[1].classList.add("active");
									toggleSwitches[1].setAttribute(
										"style",
										"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
									);
									const toggleCircle = toggleSwitches[1].querySelector(
										".toggle-circle",
									) as HTMLElement;
									if (toggleCircle) {
										toggleCircle.style.left = "20px";
									}
								}

								// Discount toggle (index 2)
								if (isDiscountHidden && toggleSwitches[2]) {
									toggleSwitches[2].classList.add("active");
									toggleSwitches[2].setAttribute(
										"style",
										"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
									);
									const toggleCircle = toggleSwitches[2].querySelector(
										".toggle-circle",
									) as HTMLElement;
									if (toggleCircle) {
										toggleCircle.style.left = "20px";
									}
								}

								// Amount toggle (index 3)
								if (isAmountHidden && toggleSwitches[3]) {
									toggleSwitches[3].classList.add("active");
									toggleSwitches[3].setAttribute(
										"style",
										"position: relative; width: 36px; height: 18px; background: #1890ff; border-radius: 10px; border: 1px solid #1890ff; cursor: pointer;",
									);
									const toggleCircle = toggleSwitches[3].querySelector(
										".toggle-circle",
									) as HTMLElement;
									if (toggleCircle) {
										toggleCircle.style.left = "20px";
									}
								}
							}
						});
					},
				}}
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
