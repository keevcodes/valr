interface HeaderProps {
  merchantName?: string;
}

export function Header({ merchantName = 'VALR Pay' }: HeaderProps) {
  return (
    <header className="header">
      <h1>{merchantName}</h1>
      <span className="secure-badge">Secure Checkout</span>
    </header>
  );
}
