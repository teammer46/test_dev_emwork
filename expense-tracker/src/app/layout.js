// metadata เป็น optional
export const metadata = {
  title: 'Expense Tracker',
  description: 'Monthly income and expense tracker',
};

// ต้อง default export React Component
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
