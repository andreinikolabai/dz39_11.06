const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const products = [
    {
        id: 1,
        item: "TV",
        units: 1,
        price: 2345.67
    },
    {
        id: 2,
        item: "Washing Machine",
        units: 3,
        price: 23.34
    },
    {
        id: 3,
        item: "Laptop",
        units: 1,
        price: 23455.34
    }
];

const port = 9000;
const app = express();

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    response.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    next();
});

app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (request, response) => {
    console.log('Products requested');
    response.send(products);
});

app.post('/products', (request, response) => {
    const newProduct = request.body;
    newProduct.id = products.length + 1;
    products.push(newProduct);
    console.log('POST request to add a new product');
    response.status(201).send(newProduct);
});

app.put('/products/:id', (request, response) => {
    const productId = parseInt(request.params.id);
    const updatedProduct = request.body;
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };
        console.log(`PUT request to update product with ID ${productId}`);
        response.send(products[productIndex]);
    } else {
        response.status(404).send('Product not found');
    }
});

app.delete('/products/:id', (request, response) => {
    const productId = parseInt(request.params.id);
    const productIndex = products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
        products.splice(productIndex, 1);
        console.log(`DELETE request to delete product with ID ${productId}`);
        response.sendStatus(204);
    } else {
        response.status(404).send('Product not found');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});