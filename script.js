/* ==========================================================================
   ⚡ HÚNGARA WEB ORDER CATALOG - CORE JAVASCRIPT LOGIC
   ========================================================================== */

// --- Configuration ---
const CONFIG = {
    // INSIRA O NÚMERO DO WHATSAPP DA CONSULTORA AQUI (DDD + Número, apenas números)
    // Ex: "5511999999999" (Brasil: Código 55 + DDD + Número)
    WHATSAPP_PHONE: "5521993464687",

    // COLE A URL DO GOOGLE APPS SCRIPT WEB APP AQUI APÓS IMPLANTAR
    // Ex: "https://script.google.com/macros/s/.../exec"
    API_SHEET_URL: "https://script.google.com/macros/s/AKfycbwTBnv9qY2k5PeEdgN8AVL2nThUiaqF3yYAR5KI0tp1FNisXYFI0gMlL51nYGJLUlhu/exec",

    // Nome do arquivo da planilha original para referência no toast
    SHEET_NAME: "Pedido do Cliente - TÂNIA"
};

// --- Complete 79-Product Database (Decoupled to products.js for shared use across pages) ---

// --- App State ---
const state = {
    cart: {}, // Format: { productId: quantity }
    activeCategory: "ALL",
    searchTerm: "",
    clientName: "",
    companyName: ""
};

// --- DOM Elements ---
// --- DOM Elements ---
const elements = {
    clientNameInput: document.getElementById("client-name"),
    clientCompanyInput: document.getElementById("client-company"),
    searchInput: document.getElementById("search-input"),
    clearSearchBtn: document.getElementById("clear-search-btn"),
    categoriesTabs: document.getElementById("categories-tabs"),
    productsGrid: document.getElementById("products-grid"),
    loadingSpinner: document.getElementById("loading-spinner"),
    emptyState: document.getElementById("empty-state"),

    bottomCartBar: document.getElementById("bottom-cart-bar"),
    cartBadgeCount: document.getElementById("cart-badge-count"),
    cartTotalItems: document.getElementById("cart-total-items"),
    confirmOrderBtn: document.getElementById("confirm-order-btn"),
    openCartBtn: document.getElementById("open-cart-btn"),

    orderDrawerOverlay: document.getElementById("order-drawer-overlay"),
    orderDrawer: document.getElementById("order-drawer"),
    closeDrawerBtn: document.getElementById("close-drawer-btn"),
    btnBackCatalog: document.getElementById("btn-back-catalog"),
    btnSubmitFinal: document.getElementById("btn-submit-final"),

    drawerClientName: document.getElementById("drawer-client-name"),
    drawerTotalItems: document.getElementById("drawer-total-items"),
    drawerItemsList: document.getElementById("drawer-items-list"),

    toastNotification: document.getElementById("toast-notification"),
    toastMessage: document.getElementById("toast-message")
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Icons Safely
    try {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn("Lucide icons library not loaded.");
        }
    } catch (e) {
        console.error("Failed to initialize Lucide icons:", e);
    }

    // 2. Parse URL parameters for Client Name (e.g. ?cliente=Padaria%20Silva ou ?c=Padaria%20Silva)
    parseUrlParams();

    // 3. Render Category Tabs
    renderCategoryTabs();

    // 4. Render Products List
    renderProducts();

    // 5. Setup Event Listeners
    setupEventListeners();
});

// --- URL Parameter Helper ---
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const clientParam = params.get("cliente") || params.get("c") || params.get("client");
    const companyParam = params.get("empresa") || params.get("e") || params.get("company");
    
    if (clientParam) {
        state.clientName = decodeURIComponent(clientParam);
        elements.clientNameInput.value = state.clientName;
    }
    if (companyParam) {
        state.companyName = decodeURIComponent(companyParam);
        elements.clientCompanyInput.value = state.companyName;
    }
    updateCartBarStatus();
}

// --- Render Category Tabs ---
function renderCategoryTabs() {
    // Extract unique categories from products
    const categories = ["ALL", ...new Set(PRODUCTS.map(p => p.category))];

    elements.categoriesTabs.innerHTML = "";

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `tab-btn ${state.activeCategory === cat ? "active" : ""}`;
        btn.dataset.category = cat;

        // Clean up category name for better tab display text
        let displayLabel = cat;
        if (cat === "ALL") displayLabel = "Todos";
        else if (cat.includes("|")) displayLabel = cat.split("|")[1].trim(); // Get only "Produtos Líquidos"

        btn.textContent = displayLabel;
        elements.categoriesTabs.appendChild(btn);
    });
}

// --- Render Products List ---
function renderProducts() {
    elements.productsGrid.innerHTML = "";

    // Filter products
    const filteredProducts = PRODUCTS.filter(product => {
        // Filter by category
        const matchesCategory = state.activeCategory === "ALL" || product.category === state.activeCategory;

        // Filter by search term
        const query = state.searchTerm.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(query) ||
            product.code.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    // Toggle empty state
    if (filteredProducts.length === 0) {
        elements.emptyState.style.display = "flex";
        return;
    } else {
        elements.emptyState.style.display = "none";
    }

    // Group products by category if viewing "ALL" (Todos)
    let currentCategory = "";

    filteredProducts.forEach(product => {
        // Inject a category sub-header if we transition to a new category in "ALL" view
        if (state.activeCategory === "ALL" && product.category !== currentCategory) {
            currentCategory = product.category;
            const categoryHeader = document.createElement("div");
            categoryHeader.className = "category-group-header";

            let label = currentCategory;
            if (label.includes("|")) label = label.split("|")[1].trim();
            categoryHeader.textContent = label;
            elements.productsGrid.appendChild(categoryHeader);
        }

        const qty = state.cart[product.id] || 0;
        const hasQty = qty > 0;

        const card = document.createElement("div");
        card.className = `product-card ${hasQty ? "has-quantity" : ""}`;
        card.id = `product-card-${product.id}`;
        card.dataset.id = product.id;

        card.innerHTML = `
            <div class="product-info">
                <span class="product-name">${product.name}</span>
                <div class="product-code-row">
                    <span class="product-code">Cód: ${product.code}</span>
                </div>
            </div>
            <div class="counter-control">
                <button class="counter-btn minus" data-id="${product.id}" ${!hasQty ? "disabled" : ""}>-</button>
                <span class="counter-val" id="qty-val-${product.id}">${qty}</span>
                <button class="counter-btn plus" data-id="${product.id}">+</button>
            </div>
        `;

        elements.productsGrid.appendChild(card);
    });
}

// --- Cart Operations ---
function updateQuantity(productId, isAddition) {
    const currentQty = state.cart[productId] || 0;
    let newQty = isAddition ? currentQty + 1 : currentQty - 1;

    if (newQty < 0) newQty = 0;

    if (newQty === 0) {
        delete state.cart[productId];
    } else {
        state.cart[productId] = newQty;
    }

    // Update product card DOM elements instantly without re-rendering everything
    const card = document.getElementById(`product-card-${productId}`);
    const qtyVal = document.getElementById(`qty-val-${productId}`);
    const minusBtn = card ? card.querySelector(".minus") : null;

    if (qtyVal) qtyVal.textContent = newQty;

    if (newQty > 0) {
        if (card) card.classList.add("has-quantity");
        if (minusBtn) minusBtn.removeAttribute("disabled");
    } else {
        if (card) card.classList.remove("has-quantity");
        if (minusBtn) minusBtn.setAttribute("disabled", "true");
    }

    updateCartBarStatus();
}

// --- Cart Bar Status & Summary ---
function updateCartBarStatus() {
    const cartItems = Object.entries(state.cart);
    const totalQty = cartItems.reduce((acc, [_, val]) => acc + val, 0);
    const totalUnique = cartItems.length;

    // Update sticky bottom bar
    elements.cartBadgeCount.textContent = totalQty;

    if (totalQty === 0) {
        elements.cartTotalItems.textContent = "Nenhum item selecionado";
        elements.confirmOrderBtn.setAttribute("disabled", "true");
    } else {
        elements.cartTotalItems.textContent = `${totalUnique} produto(s) • ${totalQty} item(ns)`;

        // Enable confirm button only if both client name and company name are entered
        if (state.clientName.trim().length > 0 && state.companyName.trim().length > 0) {
            elements.confirmOrderBtn.removeAttribute("disabled");
        } else {
            elements.confirmOrderBtn.setAttribute("disabled", "true");
        }
    }
}

// --- Setup Event Listeners ---
function setupEventListeners() {
    // 1. Client Name & Company Inputs
    elements.clientNameInput.addEventListener("input", (e) => {
        state.clientName = e.target.value;
        updateCartBarStatus();
    });

    elements.clientCompanyInput.addEventListener("input", (e) => {
        state.companyName = e.target.value;
        updateCartBarStatus();
    });

    // 2. Search Box
    elements.searchInput.addEventListener("input", (e) => {
        state.searchTerm = e.target.value;
        if (state.searchTerm.length > 0) {
            elements.clearSearchBtn.style.display = "flex";
        } else {
            elements.clearSearchBtn.style.display = "none";
        }
        renderProducts();
    });

    elements.clearSearchBtn.addEventListener("click", () => {
        elements.searchInput.value = "";
        state.searchTerm = "";
        elements.clearSearchBtn.style.display = "none";
        renderProducts();
    });

    // 3. Category Tab Clicking
    elements.categoriesTabs.addEventListener("click", (e) => {
        const tab = e.target.closest(".tab-btn");
        if (!tab) return;

        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        tab.classList.add("active");

        state.activeCategory = tab.dataset.category;
        renderProducts();
    });

    // 4. Product Card Counter Clicks (+ and -) using delegation
    elements.productsGrid.addEventListener("click", (e) => {
        const btn = e.target.closest(".counter-btn");
        if (!btn) return;

        const productId = parseInt(btn.dataset.id);
        const isAddition = btn.classList.contains("plus");

        updateQuantity(productId, isAddition);
    });

    // 5. Open / Close Order Review Drawer
    elements.openCartBtn.addEventListener("click", openDrawer);
    elements.confirmOrderBtn.addEventListener("click", openDrawer);
    elements.closeDrawerBtn.addEventListener("click", closeDrawer);
    elements.orderDrawerOverlay.addEventListener("click", closeDrawer);
    elements.btnBackCatalog.addEventListener("click", closeDrawer);

    // 6. Submit final order
    elements.btnSubmitFinal.addEventListener("click", submitOrder);
}

// --- Drawer Presentation ---
function openDrawer() {
    const cartItems = Object.entries(state.cart);
    if (cartItems.length === 0) return;

    if (state.clientName.trim().length === 0) {
        showToast("Por favor, digite seu nome no topo.");
        elements.clientNameInput.focus();
        elements.clientNameInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    if (state.companyName.trim().length === 0) {
        showToast("Por favor, digite o nome da empresa/loja no topo.");
        elements.clientCompanyInput.focus();
        elements.clientCompanyInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
    }

    // Render Selected Products in Drawer
    elements.drawerItemsList.innerHTML = "";
    const totalQty = cartItems.reduce((acc, [_, val]) => acc + val, 0);

    elements.drawerClientName.innerHTML = `${state.clientName} <span class="drawer-company-badge">${state.companyName}</span>`;
    elements.drawerTotalItems.textContent = `${totalQty} itens`;

    cartItems.forEach(([prodId, qty]) => {
        const product = PRODUCTS.find(p => p.id == prodId);
        if (!product) return;

        const itemRow = document.createElement("div");
        itemRow.className = "drawer-item";
        itemRow.innerHTML = `
            <div class="drawer-item-details">
                <span class="drawer-item-name">${product.name}</span>
                <span class="drawer-item-code">Código: ${product.code}</span>
            </div>
            <span class="drawer-item-qty-badge">${qty} un</span>
        `;
        elements.drawerItemsList.appendChild(itemRow);
    });

    // Open Overlay and Slide drawer up
    elements.orderDrawerOverlay.classList.add("active");
    elements.orderDrawer.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeDrawer() {
    elements.orderDrawerOverlay.classList.remove("active");
    elements.orderDrawer.classList.remove("active");
    document.body.style.overflow = "";
}

// --- Submit Order (Sheet API + WhatsApp) ---
function submitOrder() {
    const cartItems = Object.entries(state.cart);
    if (cartItems.length === 0) return;

    const totalQty = cartItems.reduce((acc, [_, val]) => acc + val, 0);

    // 1. Prepare Order List for Payload
    const orderedProducts = cartItems.map(([id, qty]) => {
        const p = PRODUCTS.find(prod => prod.id == id);
        return {
            codigo: p.code,
            produto: p.name,
            quantidade: qty,
            categoria: p.category
        };
    });

    // Disable submit button and show loading state
    elements.btnSubmitFinal.classList.add("loading");
    elements.btnSubmitFinal.disabled = true;
    elements.btnSubmitFinal.querySelector("span").textContent = "Salvando pedido...";

    // Check if Sheets API integration is configured
    if (CONFIG.API_SHEET_URL && CONFIG.API_SHEET_URL.startsWith("http")) {
        // Send order to Google Sheets in background
        fetch(CONFIG.API_SHEET_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8" // Avoid CORS preflight OPTIONS request
            },
            body: JSON.stringify({
                cliente: `${state.clientName} (${state.companyName})`,
                pedido: orderedProducts
            })
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro na rede");
                return res.json();
            })
            .then(data => {
                const sheetName = data.sheetName || "";
                showToast("Pedido salvo na planilha com sucesso!");
                proceedToWhatsApp(orderedProducts, totalQty, sheetName);
            })
            .catch(err => {
                console.error("Erro ao salvar na planilha:", err);
                showToast("Pedido registrado! Redirecionando para WhatsApp...");
                // Proceed to WhatsApp even if Sheet API fails so they don't lose the order!
                setTimeout(() => proceedToWhatsApp(orderedProducts, totalQty, ""), 1200);
            });
    } else {
        // No Sheets API configured, just alert and open WhatsApp
        showToast("Carregando WhatsApp...");
        setTimeout(() => proceedToWhatsApp(orderedProducts, totalQty, ""), 1000);
    }
}

// --- Redirect to WhatsApp Helper ---
function proceedToWhatsApp(orderedProducts, totalQty, sheetName) {
    // Re-enable buttons
    elements.btnSubmitFinal.classList.remove("loading");
    elements.btnSubmitFinal.disabled = false;
    elements.btnSubmitFinal.querySelector("span").textContent = "Enviar no WhatsApp e Gerar Planilha";

    // Format WhatsApp text
    let text = `*NOVO PEDIDO: CONSULTORA TÂNIA*\n`;
    text += `*Cliente:* ${state.clientName}\n`;
    text += `*Empresa/Loja:* ${state.companyName}\n`;
    text += `*Data:* ${new Date().toLocaleDateString("pt-BR")}\n\n`;
    text += `*PRODUTOS SOLICITADOS:*\n`;

    orderedProducts.forEach(item => {
        text += `- *${item.quantidade}x* ${item.produto} (Cód: ${item.codigo})\n`;
    });

    text += `\n*Total de Itens:* ${totalQty} unidades\n\n`;
    text += `_Pedido gerado via Catálogo Online da Consultora Tânia._`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodedText}`;

    // Close drawer and reset cart
    closeDrawer();
    resetCart();

    // Detect mobile device to bypass aggressive popup blockers on iOS/Android
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        window.location.href = whatsappUrl;
    } else {
        // Try opening in new tab on desktop, fallback to redirect if blocked by popup blocker
        const newWindow = window.open(whatsappUrl, "_blank");
        if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            window.location.href = whatsappUrl;
        }
    }
}

// --- Reset Cart state ---
function resetCart() {
    state.cart = {};
    updateCartBarStatus();
    renderProducts();
}

// --- Toast Notifications ---
function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toastNotification.classList.add("active");

    setTimeout(() => {
        elements.toastNotification.classList.remove("active");
    }, 3500);
}
