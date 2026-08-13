import { createServer } from 'node:http';
import { listOrders } from './orders.js';
import { totalInCents } from './payments.js';

const server = createServer((req, res) => {
  if (req.url === '/orders') {
    const orders = listOrders();
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ orders, total: totalInCents(orders) }));
    return;
  }
  res.writeHead(404).end();
});

server.listen(3000);
