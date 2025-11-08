import { useProfile } from '@/lib/queries/useAuth';
import { Car, Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { UserDropdown } from '../UserDropdown';
import { NotificationDropdown } from '../NotificationDropdown';

export default function Header() {
  const { data: profile } = useProfile();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Trang chủ' },
    { to: '/thue-xe-tu-lai', label: 'Thuê xe tự lái' },
    { to: '/ve-chung-toi', label: 'Về chúng tôi' },
    { to: '/lien-he', label: 'Liên hệ' },
  ];

  return (
    <header
      className='sticky top-0 z-50 w-full bg-white'
      style={{
        boxShadow:
          'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
      }}
    >
      {/* Main header */}
      <div className='container flex h-20 items-center justify-between'>
        <Link to='/' className='group flex items-center gap-4 no-underline'>
          <div
            className='relative flex size-14 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary-500 to-primary-700 shadow-[0_8px_25px_rgba(5,150,105,0.2)] transition-transform duration-200 group-hover:scale-[1.05] group-hover:shadow-[0_12px_35px_rgba(5,150,105,0.3)]'
            aria-hidden
          >
            <img
              src={logo}
              alt='EV Station Logo'
              className='h-22 w-22 object-contain invert brightness-0'
            />
          </div>
          <div>
            <h1 className='m-0 bg-linear-to-br from-primary-700 to-primary-500 bg-clip-text text-3xl font-extrabold leading-tight text-transparent'>
              EV Station
            </h1>
            <p className='mt-0.5 text-sm font-medium tracking-wide text-gray-500'>
              Thuê xe điện chuyên nghiệp
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden items-center gap-10 md:flex'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-[16px] font-semibold transition-colors ${
                  isActive
                    ? 'text-primary-700'
                    : 'text-gray-700 hover:text-primary-700'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side actions */}
        <div className='flex items-center gap-5'>
          {/* Search */}
          <button
            type='button'
            className='rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30'
            aria-label='Tìm kiếm'
          >
            <Search size={20} />
          </button>

          {/* Login */}
          {profile ? (
            <div className='flex items-center justify-end gap-4'>
              <UserDropdown />
              <NotificationDropdown />
            </div>
          ) : (
            <Link
              to='/login'
              className='inline-flex items-center gap-2 rounded-lg border-2 border-primary-600 px-5 py-2 text-[16px] font-semibold text-primary-600 transition hover:bg-primary-50'
            >
              <User size={18} />
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Rent button */}
          <Link
            to='/thue-xe-tu-lai'
            className='inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-[16px] font-bold text-white shadow-[0_4px_12px_rgba(5,150,105,0.3)] transition hover:bg-primary-700'
          >
            <Car size={18} />
            <span>Thuê xe ngay</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type='button'
            onClick={() => setMobileOpen((s) => !s)}
            className='rounded-md p-2 text-gray-500 transition hover:bg-gray-100 md:hidden'
            aria-label='Toggle menu'
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`border-t border-gray-200 bg-white px-5 py-5 md:hidden ${
          mobileOpen ? 'block' : 'hidden'
        }`}
      >
        <div className='flex flex-col gap-4'>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `py-3 text-[16px] font-semibold ${
                  isActive ? 'text-primary-700' : 'text-gray-700'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}

          <div className='mt-2 flex flex-col gap-3 border-t border-gray-200 pt-4'>
            <Link
              to='/login'
              className='rounded-lg border-2 border-primary-600 px-4 py-2 text-center font-semibold text-primary-600'
              onClick={() => setMobileOpen(false)}
            >
              Đăng nhập
            </Link>
            <Link
              to='/rent'
              className='rounded-lg bg-primary-600 px-4 py-2 text-center font-bold text-white'
              onClick={() => setMobileOpen(false)}
            >
              Thuê xe ngay
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
