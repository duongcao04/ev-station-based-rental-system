import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Zap,
    Shield,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#1f2937',
            color: 'white',
            padding: '60px 0 20px 0'
        }}>
            <div style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {/* Main Footer Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    marginBottom: '40px'
                }}>
                    {/* Company Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa'
                            }}>
                                <img
                                    src={logo}
                                    alt="EV Station Logo"
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    margin: 0,
                                    color: 'white'
                                }}>
                                    EV Station
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#10b981',
                                    margin: 0,
                                    fontWeight: '600'
                                }}>
                                    Thuê xe điện chuyên nghiệp
                                </p>
                            </div>
                        </div>
                        <p style={{
                            color: '#d1d5db',
                            lineHeight: '1.6',
                            marginBottom: '20px'
                        }}>
                            Chúng tôi cam kết mang đến dịch vụ thuê xe điện chất lượng cao,
                            thân thiện với môi trường và tiết kiệm chi phí cho mọi khách hàng.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a href="#" style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#374151',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                <Facebook size={20} />
                            </a>
                            <a href="#" style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#374151',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                <Twitter size={20} />
                            </a>
                            <a href="#" style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#374151',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                <Instagram size={20} />
                            </a>
                            <a href="#" style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#374151',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                textDecoration: 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Liên kết nhanh
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Trang chủ
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/thue-xe" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Thuê xe
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/xe-dien" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Xe điện
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/bang-gia" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Bảng giá
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/lien-he" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Dịch vụ
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/thue-xe-ngan-han" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Thuê xe ngắn hạn
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/thue-xe-dai-han" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Thuê xe dài hạn
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/thue-xe-doanh-nghiep" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Thuê xe doanh nghiệp
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/bao-hanh" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Bảo hành & Sửa chữa
                                </Link>
                            </li>
                            <li style={{ marginBottom: '12px' }}>
                                <Link to="/ho-tro" style={{
                                    color: '#d1d5db',
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease'
                                }}>
                                    Hỗ trợ 24/7
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: 'white'
                        }}>
                            Thông tin liên hệ
                        </h4>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Phone size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db' }}>1900-1234</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Mail size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db' }}>info@evstation.vn</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MapPin size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db' }}>Hà Nội, TP.HCM</span>
                            </div>
                        </div>

                        {/* Features */}
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Zap size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db', fontSize: '14px' }}>Sạc nhanh 30 phút</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Shield size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db', fontSize: '14px' }}>Bảo hiểm toàn diện</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Clock size={16} style={{ color: '#10b981' }} />
                                <span style={{ color: '#d1d5db', fontSize: '14px' }}>Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </footer>
    );
}
