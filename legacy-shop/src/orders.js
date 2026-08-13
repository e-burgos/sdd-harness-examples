const ORDERS = [
  { id: 'ORD-001', items: 3, amountInCents: 12_990 },
  { id: 'ORD-002', items: 1, amountInCents: 4_500 },
];

export function listOrders() {
  return ORDERS;
}
