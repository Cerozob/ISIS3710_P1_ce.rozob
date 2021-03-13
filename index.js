const body = document.body;
const products = new Map(); //todo el catálogo .get(id): {product:objeto producto,node:objeto nodo}
const categories = []; //lista de categorías, se usa cuando no hay productos en el resultado de búsqueda
const favourites = new Map(); //productos agregados a favoritos
//const datasisecaeGithub = "assets/products.json";
const data = fetch(
	"https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce"
);

function priceFormat(pricevalue /* precio en integer */) {
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

function createMarketplaceItemNode(product /* objeto producto */) {
	/* product picture */
	let productPictureButton = document.createElement("button");
	productPictureButton.id = `${product.id}`;
	productPictureButton.className = "productpicturebutton";
	productPictureButton.addEventListener("click", (button) => {
		displayProductDetail(button);
	});
	let productPicture = document.createElement("img");
	productPicture.className = "productpicture";
	productPicture.alt = `Picture of a ${product.title}`;
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

function random(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function clearCatalog() {
	let catalog = document.getElementById("catalog");
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

function displayProductDetail(product /* id del producto */) {}

function displayFavorites() {}

function addToFavorites() {}

function addtoCart() {}

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
		products.set(id, { product: product, node: node });
	}
	displayCatalogItems();
}

data.then((resp) => {
	resp.json().then(loadData);
});

document
	.getElementById("searchbutton")
	.addEventListener("click", filterCatalogItems);

/* document
	.getElementById("addtofavoritesbutton")
	.addEventListener("click", addToFavorites()); */

document
	.getElementById("wishlistbutton")
	.addEventListener("click", displayFavorites);
