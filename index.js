const body = document.body;
const products = new Map(); //todo el catálogo
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

function createMarketplaceItemNode(productId /* id del producto */) {
	let product = products.get(productId);
	/* product picture */
	let productPictureContainer = document.createElement("div");
	productPictureContainer.className = "productpicturecontainer";
	let productPicture = document.createElement("img");
	productPicture.className = "productpicture";
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
	productPictureContainer.appendChild(productPicture);
	node.appendChild(productPictureContainer);
	node.appendChild(priceText);
	node.appendChild(itemNameText);
	node.appendChild(locationText);
	if (product.free_shipping) {
		node.appendChild(icon);
	}
	return node;
}

function displayCatalog(products /* objetos de productos */) {}

function displayProductDetail(product /* id del producto */) {}

function displayFavorites(products /* ids de productos */) {}

function selectFavorite() {}

function addtoCart() {}

function loadData(data) {
	let items = data["items"];
	let catalog = document.getElementById("catalog");
	for (i = 0; i < items.length; i++) {
		let product = items[i];
		let id = product.id;
		products.set(id, product);
		let node = createMarketplaceItemNode(id);
		catalog.appendChild(node);
	}
}

data.then((resp) => {
	resp.json().then(loadData);
});
