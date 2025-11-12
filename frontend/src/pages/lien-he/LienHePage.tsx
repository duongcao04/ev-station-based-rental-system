import { useState } from 'react';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    User,
    Building,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LienHePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

     
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Phone className='w-6 h-6 text-green-600' />,
            title: 'Hotline',
            content: '1900 1234',
            subContent: '24/7 hỗ trợ khách hàng',
            link: 'tel:19001234',
        },
        {
            icon: <Mail className='w-6 h-6 text-blue-600' />,
            title: 'Email',
            content: 'support@evstation.com',
            subContent: 'Phản hồi trong 24 giờ',
            link: 'mailto:support@evstation.com',
        },
        {
            icon: <MapPin className='w-6 h-6 text-purple-600' />,
            title: 'Địa chỉ',
            content: '123 Đường ABC, Quận XYZ',
            subContent: 'TP. Hồ Chí Minh, Việt Nam',
            link: '#',
        },
        {
            icon: <Clock className='w-6 h-6 text-orange-600' />,
            title: 'Giờ làm việc',
            content: 'Thứ 2 - Chủ nhật',
            subContent: '8:00 - 22:00',
            link: '#',
        },
    ];

    const quickLinks = [
        { label: 'Hướng dẫn thuê xe', to: '/huong-dan-thue-xe' },
        { label: 'Câu hỏi thường gặp', to: '/huong-dan-thue-xe#faq' },
        { label: 'Điều khoản sử dụng', to: '/' },
        { label: 'Chính sách bảo mật', to: '/' },
    ];

    return (
        <div className='min-h-screen bg-white'>
            {/* Hero Section */}
            <section className='bg-gradient-to-br from-green-50 to-blue-50 py-20 mt-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center'>
                        <h1 className='text-5xl lg:text-6xl font-bold text-gray-900 mb-6'>
                            Liên hệ với chúng tôi
                        </h1>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
                            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
                            chúng tôi nếu bạn có bất kỳ câu hỏi nào
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className='py-16 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {contactInfo.map((info, index) => (
                            <a
                                key={index}
                                href={info.link}
                                className='bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300'
                            >
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                                        {info.icon}
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                                            {info.title}
                                        </h3>
                                        <p className='text-gray-900 font-medium mb-1'>{info.content}</p>
                                        <p className='text-gray-600 text-sm'>{info.subContent}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

       
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                        {/* Contact Form */}
                        <div className='bg-white rounded-2xl shadow-lg p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                                    <MessageSquare className='w-6 h-6 text-green-600' />
                                </div>
                                <div>
                                    <h2 className='text-3xl font-bold text-gray-900'>
                                        Gửi tin nhắn
                                    </h2>
                                    <p className='text-gray-600'>
                                        Điền form bên dưới và chúng tôi sẽ liên hệ lại với bạn
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className='space-y-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <label
                                            htmlFor='name'
                                            className='block text-sm font-medium text-gray-700 mb-2'
                                        >
                                            Họ và tên <span className='text-red-500'>*</span>
                                        </label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <User className='h-5 w-5 text-gray-400' />
                                            </div>
                                            <input
                                                type='text'
                                                id='name'
                                                name='name'
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                                placeholder='Nhập họ và tên'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='phone'
                                            className='block text-sm font-medium text-gray-700 mb-2'
                                        >
                                            Số điện thoại <span className='text-red-500'>*</span>
                                        </label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                                <Phone className='h-5 w-5 text-gray-400' />
                                            </div>
                                            <input
                                                type='tel'
                                                id='phone'
                                                name='phone'
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                                placeholder='Nhập số điện thoại'
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-medium text-gray-700 mb-2'
                                    >
                                        Email <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <Mail className='h-5 w-5 text-gray-400' />
                                        </div>
                                        <input
                                            type='email'
                                            id='email'
                                            name='email'
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                            placeholder='Nhập email của bạn'
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor='subject'
                                        className='block text-sm font-medium text-gray-700 mb-2'
                                    >
                                        Chủ đề <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <MessageSquare className='h-5 w-5 text-gray-400' />
                                        </div>
                                        <select
                                            id='subject'
                                            name='subject'
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white'
                                        >
                                            <option value=''>Chọn chủ đề</option>
                                            <option value='thue-xe'>Câu hỏi về thuê xe</option>
                                            <option value='ky-thuat'>Hỗ trợ kỹ thuật</option>
                                            <option value='thanh-toan'>Vấn đề thanh toán</option>
                                            <option value='khac'>Khác</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor='message'
                                        className='block text-sm font-medium text-gray-700 mb-2'
                                    >
                                        Nội dung tin nhắn <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        id='message'
                                        name='message'
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className='block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none'
                                        placeholder='Nhập nội dung tin nhắn của bạn...'
                                    />
                                </div>

                                {submitStatus === 'success' && (
                                    <div className='flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg'>
                                        <CheckCircle className='w-5 h-5 text-green-600' />
                                        <p className='text-green-800'>
                                            Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ liên hệ
                                            lại sớm nhất có thể.
                                        </p>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className='flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg'>
                                        <AlertCircle className='w-5 h-5 text-red-600' />
                                        <p className='text-red-800'>
                                            Đã có lỗi xảy ra. Vui lòng thử lại sau.
                                        </p>
                                    </div>
                                )}

                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send className='w-5 h-5' />
                                            Gửi tin nhắn
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Map and Additional Info */}
                        <div className='space-y-8'>
                            {/* Map */}
                            <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                                <div className='h-96 bg-gray-200 relative'>
                                    <iframe
                                        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1263199929257!2d106.62965531526067!3d10.80187319230288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bee0b0ef9e5%3A0x5b4da59e47aa97a8!2zQ8OgIFRyw6BuZyDEkGnhu4duIE3hu4csIE5ndXnhu4VuIE3hu4csIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s'
                                        width='100%'
                                        height='100%'
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading='lazy'
                                        referrerPolicy='no-referrer-when-downgrade'
                                        className='absolute inset-0'
                                    />
                                </div>
                                <div className='p-6'>
                                    <div className='flex items-start gap-4'>
                                        <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                                            <Building className='w-6 h-6 text-green-600' />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                                Văn phòng chính
                                            </h3>
                                            <p className='text-gray-600 mb-1'>
                                                123 Đường ABC, Quận XYZ
                                            </p>
                                            <p className='text-gray-600'>TP. Hồ Chí Minh, Việt Nam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            <div className='bg-white rounded-2xl shadow-lg p-8'>
                                <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                                    Liên kết nhanh
                                </h3>
                                <ul className='space-y-3'>
                                    {quickLinks.map((link, index) => (
                                        <li key={index}>
                                            <Link
                                                to={link.to}
                                                className='flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors group'
                                            >
                                                <div className='w-2 h-2 bg-green-600 rounded-full group-hover:scale-150 transition-transform' />
                                                <span className='group-hover:font-medium'>
                                                    {link.label}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Business Hours */}
                            <div className='bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200'>
                                <div className='flex items-center gap-3 mb-4'>
                                    <Clock className='w-6 h-6 text-green-600' />
                                    <h3 className='text-2xl font-bold text-gray-900'>
                                        Giờ làm việc
                                    </h3>
                                </div>
                                <div className='space-y-3'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-700 font-medium'>
                                            Thứ 2 - Thứ 6
                                        </span>
                                        <span className='text-gray-900 font-semibold'>8:00 - 22:00</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-700 font-medium'>Thứ 7</span>
                                        <span className='text-gray-900 font-semibold'>8:00 - 20:00</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-700 font-medium'>Chủ nhật</span>
                                        <span className='text-gray-900 font-semibold'>9:00 - 18:00</span>
                                    </div>
                                    <div className='pt-3 border-t border-green-200'>
                                        <p className='text-sm text-gray-600'>
                                            Hotline hỗ trợ 24/7: <strong>1900 1234</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-green-600'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                    <h2 className='text-4xl font-bold text-white mb-4'>
                        Sẵn sàng bắt đầu hành trình?
                    </h2>
                    <p className='text-xl text-green-100 mb-8 max-w-2xl mx-auto'>
                        Đăng ký ngay và trải nghiệm dịch vụ thuê xe điện chuyên nghiệp của
                        chúng tôi
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Link
                            to='/thue-xe-tu-lai'
                            className='bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300'
                        >
                            Thuê xe ngay
                        </Link>
                        <Link
                            to='/register'
                            className='border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300'
                        >
                            Đăng ký tài khoản
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

