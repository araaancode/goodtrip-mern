export const fetchData = async () => {
  // Mock API response
  return {
    advertisements: [
      { id: 1, title: "Ad 1", impressions: 1200, clicks: 150 },
      { id: 2, title: "Ad 2", impressions: 800, clicks: 90 },
      { id: 3, title: "Ad 3", impressions: 1500, clicks: 200 },
    ],
    foods: [
      { id: 1, name: "Pizza", orders: 300 },
      { id: 2, name: "Burger", orders: 200 },
      { id: 3, name: "Salad", orders: 150 },
    ],
    orders: [
      { id: 1, date: "2025-04-20", total: 500 },
      { id: 2, date: "2025-04-21", total: 700 },
      { id: 3, date: "2025-04-22", total: 600 },
    ],
    tickets: [
      { id: 1, issue: "Login Issue", status: "Open" },
      { id: 2, issue: "Payment Issue", status: "Closed" },
      { id: 3, issue: "Order Delay", status: "Pending" },
    ],
  };
};
