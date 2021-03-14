const body = document.body;
const products = new Map(); // todo el catálogo .get(id): {product:objeto producto,node:objeto nodo}
const categories = []; // lista de categorías, se usa cuando no hay productos en el resultado de búsqueda
const favourites = new Map(); // productos agregados a favoritos
const elimination = new Map(); // productos marcados para eliminación
//const datasisecaeGithub = "assets/products.json";
const data = fetch(
	"https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce"
);

function priceFormat(pricevalue /* price, integer or decimal */) {
	let price = pricevalue.toString().split(".");
	let priceinteger = price[0];
	let pricedecimal = price[1];
	let decomposedString = [];
	let lastIndex = 0;
	while (lastIndex < priceinteger.length) {
		let mod3 = priceinteger.length % 3;
		if (lastIndex === 0 && mod3 !== 0) {
			let secondIndex = mod3;
			decomposedString.push(priceinteger.substring(lastIndex, secondIndex));
			lastIndex = secondIndex;
		} else {
			let secondIndex = lastIndex + 3;
			decomposedString.push(priceinteger.substring(lastIndex, secondIndex));
			lastIndex = secondIndex;
		}
	}
	let output = `$ `;
	for (let i = 0; i < decomposedString.length - 1; i++) {
		let number = decomposedString[i];
		output += `${number}.`;
	}
	output += `${decomposedString[decomposedString.length - 1]}`;
	if (pricedecimal != null) {
		/* no hay un ejemplo de cómo se debe ver el decimal.
            le puse una coma para diferenciarlo.
        */
		output += `,${pricedecimal}`;
	}
	return output;
}

function createMarketplaceItemNode(product /* object */) {
	/* product picture */
	let productPictureButton = document.createElement("button");
	productPictureButton.id = `${product.id}`;
	productPictureButton.className = "productpicturebutton";
	productPictureButton.addEventListener("click", () => {
		displayProductDetail(product.id);
	});
	let productPicture = document.createElement("img");
	productPicture.className = "productpicture";
	productPicture.alt = `imagen del producto ${product.title}`;
	productPicture.src = product.picture;
	/* free shipping icon */
	let freeShippingIconSrc = "assets/shipping_free.png";
	let icon = document.createElement("img");
	icon.className = "freeshippingicon";
	icon.alt = "Free Shipping Icon";
	icon.src = freeShippingIconSrc;
	/* price */
	let priceText = document.createElement("p");
	let price = product.price.amount;
	let formattedPrice = priceFormat(price);
	priceText.className = "pricetext";
	priceText.innerText = formattedPrice;
	/* name */
	let itemNameText = document.createElement("p");
	itemNameText.className = "nametext";
	itemNameText.innerText = product.title;
	/* location */
	let locationText = document.createElement("p");
	locationText.className = "locationtext";
	locationText.innerText = product.location;
	/* card node */
	let node = document.createElement("div");
	node.className = "catalogitem";
	productPictureButton.appendChild(productPicture);
	node.appendChild(productPictureButton);
	node.appendChild(priceText);
	node.appendChild(itemNameText);
	node.appendChild(locationText);
	if (product.free_shipping) {
		node.appendChild(icon);
	}
	return node;
}

function createFavouriteItemNode(product /* object */) {
	/* product picture */
	let productPictureButton = document.createElement("button");
	productPictureButton.className = "favouritepicbutton";
	productPictureButton.addEventListener("click", () => {
		displayProductDetail(product.id);
	});
	let productPicture = document.createElement("img");
	productPicture.className = "productpicture";
	productPicture.alt = `imagen del producto ${product.title}`;
	productPicture.src = product.picture;
	/* free shipping icon */
	let freeShippingIconSrc = "assets/shipping_free.png";
	let icon = document.createElement("img");
	icon.className = "freeshippingicon";
	icon.alt = "Free Shipping Icon";
	icon.src = freeShippingIconSrc;
	/* price */
	let priceText = document.createElement("p");
	let price = product.price.amount;
	let formattedPrice = priceFormat(price);
	priceText.className = "pricetext";
	priceText.innerText = formattedPrice;
	/* name */
	let itemNameText = document.createElement("p");
	itemNameText.className = "nametext";
	itemNameText.innerText = product.title;
	/* see detail button */
	let detailButton = document.createElement("button");
	detailButton.className = "favouritebutton";
	detailButton.innerText = "Ver artículo";
	detailButton.addEventListener("click", () => {
		displayProductDetail(product.id);
	});
	/* checkbox button */
	let checkboxButton = document.createElement("input");
	checkboxButton.type = "checkbox";
	checkboxButton.className = "checkboxbutton";
	if (elimination.has(product.id)) {
		checkboxButton.defaultChecked = true;
	} else {
		checkboxButton.defaultChecked = false;
	}
	checkboxButton.addEventListener("change", () => {
		if (!checkboxButton.checked) {
			elimination.delete(product.id);
			if (elimination.size === 0) {
				disableButton();
			}
		} else {
			elimination.set(product.id, product);
			enableButton();
		}
	});
	/* card node */
	let node = document.createElement("div");
	node.className = "catalogitem";
	productPictureButton.appendChild(productPicture);
	node.appendChild(productPictureButton);
	node.appendChild(priceText);
	node.appendChild(itemNameText);
	node.appendChild(detailButton);
	node.appendChild(checkboxButton);
	if (product.free_shipping) {
		node.appendChild(icon);
	}
	return node;
}

function enableButton() {
	let button = document.getElementById("eliminatedisabled");
	if (button != null) {
		button.id = "eliminateenabled";
	}
}
function disableButton() {
	let button = document.getElementById("eliminateenabled");
	if (button != null) {
		button.id = "eliminatedisabled";
	}
}

function renderFavouritesFirstRow() {
	/* checkbox button */
	let checkboxButton = document.createElement("input");
	checkboxButton.type = "checkbox";
	checkboxButton.className = "checkboxbutton";
	checkboxButton.id = "checkboxfirstrow";
	checkboxButton.defaultChecked = false;
	checkboxButton.addEventListener("click", () => {
		let boxes = document.getElementsByClassName("checkboxbutton");
		if (!checkboxButton.checked) {
			elimination.clear();
			for (let i = 0; i < boxes.length; i++) {
				boxes.item(i).checked = false;
			}
			disableButton();
		} else {
			elimination.clear();
			for (let i = 0; i < boxes.length; i++) {
				boxes.item(i).checked = true;
			}
			if (favourites.size !== 0) {
				enableButton();
			}
			favourites.forEach((value, key) => {
				elimination.set(key, value);
			});
		}
	});

	/* button */
	let eliminateButton = document.createElement("button");
	eliminateButton.className = "detailbutton";
	if (elimination.size !== 0) {
		eliminateButton.id = "eliminateenable";
	} else {
		eliminateButton.id = "eliminatedisabled";
	}
	eliminateButton.innerText = "Eliminar";
	eliminateButton.addEventListener("click", () => {
		if (elimination.size !== 0) {
			elimination.forEach((value, key) => {
				favourites.delete(key);
				elimination.delete(key);
				displayFavourites();
				disableButton();
			});
		}
	});

	let node = document.createElement("div");
	node.className = "catalogitem";
	node.id = "firstrow";
	node.appendChild(checkboxButton);
	node.appendChild(eliminateButton);
	return node;
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCatalog() {
	let catalog = document.getElementById("catalog");
	let breadcrumbs = document.getElementsByClassName("breadcrumb");
	for (let i = 0; i < breadcrumbs.length; ) {
		breadcrumbs.item(i).remove();
	}
	let catalogItems = catalog.children;
	for (let i = 0; i < catalogItems.length; ) {
		catalogItems.item(i).remove();
	}
}

function displayCatalogItems() {
	clearCatalog();
	products.forEach((value) => {
		catalog.appendChild(value.node);
	});
}

function filterCatalogItems() {
	let searchTerm = document.getElementById("searchbar").value;
	let catalog = document.getElementById("catalog");
	if (searchTerm.length === 0) {
		displayCatalogItems();
	} else {
		clearCatalog();
		products.forEach((value) => {
			if (value.product.categories.includes(searchTerm)) {
				catalog.appendChild(value.node);
			}
		});
	}
	if (catalog.children.length === 0) {
		let notFound = document.createElement("p");
		let searchAgain = document.createElement("p");
		searchAgain.className = "searchagaintext";
		notFound.className = "notfoundtext";
		notFound.textContent = `Lo sentimos, no encontramos ningún producto de la categoría "${searchTerm}".`;
		let randomSearchTerm = categories[random(0, categories.length)];
		searchAgain.textContent = `Prueba con buscar "${randomSearchTerm}".`;
		catalog.appendChild(notFound);
		catalog.appendChild(searchAgain);
	}
}

function displayProductDetail(productid /* product id */) {
	let catalog = document.getElementById("catalog");
	clearCatalog();
	let product = products.get(productid).product;
	/* detail picture container*/
	let pictureContainer = document.createElement("div");
	pictureContainer.className = "detailpicturecontainer";
	/* detail picture */
	let picture = document.createElement("img");
	picture.alt = `imagen del producto ${product.title}`;
	picture.src = product.picture;
	picture.className = "detailpicture";
	/* detail container */
	let detailContainer = document.createElement("div");
	detailContainer.className = "detailcontainer";
	/* categories breadcrumb*/
	let breadcrumb = document.createElement("p");
	let categories = product.categories;
	let breadcrumbText = categories[0];
	for (let i = 1; i < categories.length; i++) {
		breadcrumbText += ` > ${categories[i]}`;
	}
	breadcrumb.innerText = breadcrumbText;
	breadcrumb.className = "breadcrumb";
	/* Description title */
	let descriptionTitle = document.createElement("p");
	descriptionTitle.innerText = "Descripción del producto";
	descriptionTitle.className = "descriptiontitle";
	/* Description paragraph */
	let descriptionContainer = document.createElement("div");
	descriptionContainer.className = "descriptionwrapper";
	let descriptionText = document.createElement("p");
	descriptionText.innerText = product.description;
	descriptionText.className = "description";
	/* Price tag*/
	let itemPrice = document.createElement("p");
	let price = product.price.amount;
	let formattedPrice = priceFormat(price);
	itemPrice.className = "pricetextdetail";
	itemPrice.innerText = formattedPrice;
	/* Product Name */
	let itemName = document.createElement("p");
	itemName.className = "nametextdetail";
	itemName.innerText = product.title;
	/* used/new | X units sold */
	let usedcondition = document.createElement("p");
	usedcondition.className = "condition";
	let condition = product.condition === "new" ? "nuevo" : "usado";
	usedcondition.innerText = `${condition} | ${product.sold_quantity} vendidos`;
	/* buy button */
	let buyButton = document.createElement("button");
	buyButton.className = "detailbutton";
	buyButton.id = "buybutton";
	buyButton.addEventListener("click", () => {
		let dialog = document.getElementById("boughtdialog");
		if (dialog == null) {
			addtoCart(product.id);
		}
	});
	buyButton.innerText = "Comprar";
	/* add to favourites button*/
	let favsButton = document.createElement("button");
	favsButton.className = "detailbutton";
	favsButton.id = "addtofavouritesbutton";
	if (favourites.has(product.id)) {
		favsButton.innerText = "Quitar de favoritos";
	} else {
		favsButton.innerText = "Añadir a favoritos";
	}
	favsButton.addEventListener("click", () => {
		if (favourites.has(product.id)) {
			favourites.delete(productid);
			document.getElementById("addtofavouritesbutton").innerText =
				"Añadir a favoritos";
		} else {
			favourites.set(productid, products.get(productid).product);
			document.getElementById("addtofavouritesbutton").innerText =
				"Quitar de favoritos";
		}
	});
	body.appendChild(breadcrumb);
	descriptionContainer.appendChild(descriptionText);
	pictureContainer.appendChild(picture);
	detailContainer.appendChild(pictureContainer);
	detailContainer.appendChild(descriptionTitle);
	detailContainer.appendChild(descriptionContainer);
	detailContainer.appendChild(itemPrice);
	detailContainer.appendChild(itemName);
	detailContainer.appendChild(usedcondition);
	detailContainer.appendChild(buyButton);
	detailContainer.appendChild(favsButton);
	catalog.appendChild(detailContainer);
}

function displayFavourites() {
	clearCatalog();
	let firstRow = renderFavouritesFirstRow();
	catalog.appendChild(firstRow);
	favourites.forEach((value) => {
		let node = createFavouriteItemNode(value);
		catalog.appendChild(node);
	});
}

closeDialog = () => {
	document.getElementById("boughtdialog").remove();
};

function addtoCart(productid) {
	let productTitle = products.get(productid).product.title;
	/* close button */
	let dismissButton = document.createElement("button");
	dismissButton.id = "dismissbutton";
	dismissButton.className = "detailbutton";
	dismissButton.innerText = "Close";
	dismissButton.addEventListener("click", closeDialog);
	/* product title */
	let dialogProductTitle = document.createElement("p");
	dialogProductTitle.innerText = productTitle;
	dialogProductTitle.className = "dialogproducttitle";
	/* Añadido al carrito de compras*/
	let anadidoalcarritodecompras = document.createElement("p");
	anadidoalcarritodecompras.className = "anadido";
	anadidoalcarritodecompras.innerText = "Añadido al carrito de\ncompras";
	/* line */
	let divider = document.createElement("div");
	divider.id = "dialogdivider";

	let dialog = document.createElement("div");
	dialog.id = "boughtdialog";
	dialog.appendChild(dialogProductTitle);
	dialog.appendChild(anadidoalcarritodecompras);
	dialog.appendChild(divider);
	dialog.appendChild(dismissButton);
	body.appendChild(dialog);
}

function loadData(data) {
	let items = data["items"];
	for (i = 0; i < items.length; i++) {
		let product = items[i];

		product.categories.forEach((value) => {
			if (!categories.includes(value)) {
				categories.push(value);
			}
		});

		let id = product.id;
		let node = createMarketplaceItemNode(product);
		let productsobj = { product: product, node: node };
		products.set(id, productsobj);
	}
	displayCatalogItems();
}

data.then((resp) => {
	resp.json().then(loadData);
});

document
	.getElementById("searchbutton")
	.addEventListener("click", filterCatalogItems);

document
	.getElementById("wishlistbutton")
	.addEventListener("click", displayFavourites);
