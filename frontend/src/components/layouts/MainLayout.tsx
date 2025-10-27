import Header from '../Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id='page'>
      <Header />
      {children}
    </div>
  );
}
