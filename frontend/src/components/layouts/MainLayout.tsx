import Header from '../Header';
import Footer from '../Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
