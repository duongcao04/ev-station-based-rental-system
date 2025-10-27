import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click (desktop menu)
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // ESC to close menus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className='bg-[#090806] z-20 fixed top-0 inset-x-0'>
      {/* Top bar */}
      <div className='flex max-w-[1416px] py-4 px-4 xl:px-0 items-center justify-between mx-auto'>
        <div className='text-white flex items-center gap-x-6 xl:gap-x-12'>
          {/* Logo */}
          <Link to='/' className='inline-block'>
            <img
              src='/images/logo/logo.svg'
              alt='Logo'
              className='cursor-pointer w-[150px] h-10 sm:w-[185px] sm:h-[45px]'
            />
          </Link>

          {/* Desktop nav */}
          <nav className='hidden xl:flex items-center gap-x-6'>
            {/* Services with mega menu */}
            <div
              ref={menuRef}
              className='relative'
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className='flex items-center gap-x-2 text-[16px] font-semibold hover:text-[#07F668] transition-colors duration-300'
                aria-haspopup='true'
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setServicesOpen((v) => !v);
                  }
                }}
              >
                <span>Dịch vụ</span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                  size={20}
                />
              </button>

              {/* Mega menu */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 mt-3 w-screen max-w-[1512px] bg-white rounded-xl shadow-lg ring-1 ring-black/5 transition-all duration-300 ease-in-out ${
                  servicesOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className='px-5 xl:px-[200px] py-6'>
                  {/* Top row */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 items-center'>
                    <div className='text-center'>
                      <Link
                        to='/'
                        className='font-semibold uppercase no-underline text-[#2AC769] text-[20px] md:text-[24px]'
                      >
                        Thuê xe có tài
                      </Link>
                    </div>
                    <div className='text-center'>
                      <Link
                        to='/thue-xe-tu-lai'
                        className='text-[16px] font-semibold uppercase no-underline text-black hover:text-[#07F668]'
                      >
                        Thuê xe tự lái
                      </Link>
                    </div>
                    <div className='text-center'>
                      <Link
                        to='/'
                        className='text-[16px] font-semibold uppercase no-underline text-black hover:text-[#07F668]'
                      >
                        Thuê xe sự kiện
                      </Link>
                    </div>
                    <div className='text-center'>
                      <Link
                        to='/so-huu-xe-linh-hoat'
                        className='text-[16px] font-semibold uppercase no-underline text-black hover:text-[#07F668]'
                      >
                        Sở hữu xe linh hoạt
                      </Link>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className='mt-4 md:mt-[14px] md:px-0'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-x-[38px] mb-[20px] md:mb-[44px]'>
                      <MegaCard
                        href='/thue-xe-san-bay'
                        img='https://upload-static.fgf.vn/gf/homepage/service1.webp'
                        title='Đưa đón sân bay'
                      />
                      <MegaCard
                        href='/thue-xe-cuoi'
                        img='https://upload-static.fgf.vn/gf/homepage/service2.webp'
                        title='Thuê xe đám cưới'
                      />
                      <MegaCard
                        href='/'
                        img='https://upload-static.fgf.vn/gf/homepage/service3.webp'
                        title='Đưa đón đường dài'
                        comingSoon
                      />
                      <MegaCard
                        href='/'
                        img='https://upload-static.fgf.vn/gf/homepage/service4.webp'
                        title='Đặt xe đưa đón'
                        comingSoon
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NavLink to='/xe-luot'>Mua xe cũ chính hãng</NavLink>
            <NavLink to='/ve-chung-toi'>Giới thiệu</NavLink>
            <NavLink to='/tin-tuc'>Tin tức</NavLink>
          </nav>
        </div>

        {/* Right actions */}
        <div className='flex items-center gap-x-4'>
          <button className='inline-flex items-center justify-center whitespace-nowrap text-[16px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-[#CECECD] h-[48px] py-[12px] rounded-full px-[16px] bg-white hover:bg-[#07F668] hover:text-[#090806] text-black w-[140px] sm:w-[152px] max-w-[182px]'>
            <span className='flex items-center gap-x-2 px-2'>
              <UserRound size={20} />
              <span>Đăng nhập</span>
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            className='xl:hidden block p-2 text-white'
            aria-label='Open menu'
            onClick={() => setMobileOpen((v) => !v)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`xl:hidden bg-white shadow-lg transition-[max-height,opacity] duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className='px-4 py-4 space-y-2'>
          <MobileLink to='/xe-luot'>Mua xe cũ chính hãng</MobileLink>
          <MobileLink to='/ve-chung-toi'>Giới thiệu</MobileLink>
          <MobileLink to='/tin-tuc'>Tin tức</MobileLink>

          {/* Mobile services collapsible */}
          <details className='group'>
            <summary className='flex items-center justify-between cursor-pointer text-[16px] font-semibold'>
              <span>Dịch vụ</span>
              <ChevronDown
                className='transition-transform group-open:rotate-180'
                size={18}
              />
            </summary>
            <div className='pl-3 mt-2 space-y-2'>
              <MobileLink to='/'>Thuê xe có tài</MobileLink>
              <MobileLink to='/thue-xe-tu-lai'>Thuê xe tự lái</MobileLink>
              <MobileLink to='/'>Thuê xe sự kiện</MobileLink>
              <MobileLink to='/so-huu-xe-linh-hoat'>
                Sở hữu xe linh hoạt
              </MobileLink>
              <div className='grid grid-cols-2 gap-3 pt-2'>
                <MobileCard to='/thue-xe-san-bay' title='Đưa đón sân bay' />
                <MobileCard to='/thue-xe-cuoi' title='Thuê xe đám cưới' />
                <MobileCard to='/' title='Đưa đón đường dài' soon />
                <MobileCard to='/' title='Đặt xe đưa đón' soon />
              </div>
            </div>
          </details>
        </div>
      </div>

      {/* Spacer so content starts below fixed header */}
      <div className='h-[72px] sm:h-[80px]' />
    </header>
  );
}

/* ---------- Small helpers ---------- */

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className='text-[16px] font-semibold text-white hover:text-[#07F668] no-underline'
    >
      {children}
    </Link>
  );
}

function MobileLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className='block text-[16px] font-medium text-[#111] no-underline'
    >
      {children}
    </Link>
  );
}

function MobileCard({
  to,
  title,
  soon,
}: {
  to: string;
  title: string;
  soon?: boolean;
}) {
  return (
    <Link to={to} className='no-underline'>
      <div className='rounded-[12px] border border-[#3C3C432E] p-3 text-center'>
        <p className='text-[14px] font-medium'>
          {title}{' '}
          {soon && <span className='text-xs text-gray-500'>(Soon)</span>}
        </p>
      </div>
    </Link>
  );
}

function MegaCard({
  href,
  img,
  title,
  comingSoon,
}: {
  href: string;
  img: string;
  title: string;
  comingSoon?: boolean;
}) {
  return (
    <Link to={href} className='no-underline text-black'>
      <div className='rounded-[13px] border border-solid border-[#3C3C432E] h-[250px] flex flex-col overflow-hidden'>
        <div className='h-[200px] relative'>
          <img src={img} alt='' className='object-cover w-full h-full' />
          {comingSoon && (
            <div className='absolute inset-x-0 bottom-3 flex justify-center items-end z-10'>
              <img
                src='/images/logo/coming-soon.svg'
                alt='Coming soon'
                className='object-contain w-[125px] h-[40px]'
              />
            </div>
          )}
        </div>
        <p className='text-[18px] font-medium text-center mt-3'>{title}</p>
      </div>
    </Link>
  );
}
