import { useState } from 'react';
import { Menu, X, Search, User, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            width: '100%',
        }}>
            {/* Main header */}
            <div style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '80px',
            }}>

                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 25px rgba(5, 150, 105, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 35px rgba(5, 150, 105, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.2)';
                        }}>
                        <img
                            src={logo}
                            alt="EV Station Logo"
                            style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain',
                                filter: 'brightness(0) invert(1)'
                            }}
                        />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '800',
                            color: '#1f2937',
                            margin: 0,
                            lineHeight: '1.1',
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            EV Station
                        </h1>
                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: '500',
                            margin: '0',
                            marginTop: '2px',
                            letterSpacing: '0.5px'
                        }}>
                            Thuê xe điện chuyên nghiệp
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Link to="/" style={{
                        color: '#374151',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }}>
                        Trang chủ
                    </Link>
                    <Link to="/thue-xe-tu-lai" style={{
                        color: '#374151',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }}>
                        Thuê xe
                    </Link>
                    <Link to="/xe-dien" style={{
                        color: '#374151',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }}>
                        Xe điện
                    </Link>
                    <Link to="/bang-gia" style={{
                        color: '#374151',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }}>
                        Bảng giá
                    </Link>
                    <Link to="/lien-he" style={{
                        color: '#374151',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        transition: 'all 0.3s ease'
                    }}>
                        Liên hệ
                    </Link>
                </nav>

                {/* Right side actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* Search */}
                    <button style={{
                        padding: '10px',
                        border: 'none',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                    }}>
                        <Search size={20} />
                    </button>

                    {/* Login */}
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        border: '2px solid #059669',
                        background: 'transparent',
                        color: '#059669',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.3s ease'
                    }}>
                        <User size={18} />
                        <span>Đăng nhập</span>
                    </button>

                    {/* Rent button */}
                    <Link to="/rent" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        backgroundColor: '#059669',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '16px',
                        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        <Car size={18} />
                        <span>Thuê xe ngay</span>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            padding: '8px',
                            border: 'none',
                            background: 'none',
                            color: '#6b7280',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            display: 'none'
                        }}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e5e7eb',
                    padding: '20px',
                    display: 'none'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Link to="/" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Trang chủ
                        </Link>
                        <Link to="/thue-xe" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Thuê xe
                        </Link>
                        <Link to="/xe-dien" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Xe điện
                        </Link>
                        <Link to="/bang-gia" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Bảng giá
                        </Link>
                        <Link to="/lien-he" style={{
                            color: '#374151',
                            textDecoration: 'none',
                            padding: '12px 0',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Liên hệ
                        </Link>
                        <div style={{
                            paddingTop: '16px',
                            borderTop: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <button style={{
                                padding: '12px',
                                border: '2px solid #059669',
                                background: 'transparent',
                                color: '#059669',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}>
                                Đăng nhập
                            </button>
                            <Link to="/rent" style={{
                                padding: '12px',
                                backgroundColor: '#059669',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: '700'
                            }}>
                                Thuê xe ngay
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}