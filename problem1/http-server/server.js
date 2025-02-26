
const fs = require('fs')
const express = require('express')

const app = express();
const PORT = 8080;

// Load transaction data
const transactions = fs.readFileSync('../transaction-log.txt','utf-8')
	.split('\n')
	.filter(line => line.trim() !== '')
	.map(line => JSON.parse(line));

// API to fetch all transactions
app.get('/api/transactions', (req,res) => {
	res.json(transactions);
});

// API to get a transaction by order ID
app.get('/api/:order_id', (req,res) => {
	const order = transactions.find(t => t.order_id === req.params.order_id);
	
	console.log(order);

	if(!order) {
		res.status(404).json({error: "Order not found"});
	}

	res.json(order);
});

// Start HTTP server
app.listen(PORT, () => {
	console.log(`HTTP Server running on http://localhost:${PORT}`);
});
