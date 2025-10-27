import Header from '../Header';
import Footer from '../Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
