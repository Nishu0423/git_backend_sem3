
const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.json());

// Generate 100 products
let products = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: (i + 1) * 100,
    category: ['Electronics', 'Clothing', 'Books', 'Accessories'][i % 4],
    stock: 10 + i
}));

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to Product REST API');
});

// GET all products
app.get('/api/products', (req, res) => {
    res.json({
        total: products.length,
        products: products
    });
});

// GET product by ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.json(product);
});

// POST - Add new product
app.post('/api/products', (req, res) => {
    const { name, price, category, stock } = req.body;

    if (!name || price === undefined || !category || stock === undefined) {
        return res.status(400).json({
            message: 'Please provide all product details'
        });
    }

    const newProduct = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        price,
        category,
        stock
    };

    products.push(newProduct);

    res.status(201).json({
        message: 'Product added successfully',
        product: newProduct
    });
});

// PUT - Update product
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    Object.assign(product, req.body);

    res.json({
        message: 'Product updated successfully',
        product
    });
});

// DELETE - Delete product
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const deletedProduct = products.splice(index, 1);

    res.json({
        message: 'Product deleted successfully',
        product: deletedProduct[0]
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Product API running at http://localhost:${PORT}`);
});
