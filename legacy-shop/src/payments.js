// Los importes viajan en centavos, como enteros. Ver AGENTS.md.
export function totalInCents(orders) {
  return orders.reduce((sum, order) => sum + order.amountInCents, 0);
}
