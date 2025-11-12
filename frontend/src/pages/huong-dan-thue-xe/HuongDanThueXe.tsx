import {
    FileText,
    CreditCard,
    Car,
    Shield,
    CheckCircle,
    Clock,
    HelpCircle,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    User,
    Wallet,
    FileCheck,
    AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HuongDanThueXe() {
    const steps = [
        {
            number: 1,
            icon: <User className='w-8 h-8 text-green-600' />,
            title: 'Đăng ký tài khoản',
            description:
                'Tạo tài khoản trên website và xác thực thông tin cá nhân. Bạn cần cung cấp CMND/CCCD và bằng lái xe hợp lệ.',
        },
        {
            number: 2,
            icon: <Car className='w-8 h-8 text-blue-600' />,
            title: 'Chọn xe và thời gian',
            description:
                'Tìm kiếm và chọn xe phù hợp với nhu cầu. Chọn thời gian thuê, điểm nhận và trả xe.',
        },
        {
            number: 3,
            icon: <FileCheck className='w-8 h-8 text-purple-600' />,
            title: 'Xác nhận đặt xe',
            description:
                'Kiểm tra thông tin đặt xe, điều khoản và chính sách. Xác nhận đặt xe của bạn.',
        },
        {
            number: 4,
            icon: <Wallet className='w-8 h-8 text-orange-600' />,
            title: 'Thanh toán',
            description:
                'Thanh toán phí thuê xe và phí đặt cọc (nếu có) bằng thẻ tín dụng, ví điện tử hoặc tiền mặt.',
        },
        {
            number: 5,
            icon: <MapPin className='w-8 h-8 text-red-600' />,
            title: 'Nhận xe',
            description:
                'Đến điểm nhận xe đúng giờ, kiểm tra tình trạng xe và ký xác nhận. Nhận chìa khóa và bắt đầu hành trình.',
        },
        {
            number: 6,
            icon: <CheckCircle className='w-8 h-8 text-green-600' />,
            title: 'Trả xe',
            description:
                'Trả xe đúng điểm và thời gian đã đặt. Nhân viên kiểm tra xe, sau đó hoàn trả tiền đặt cọc (nếu có).',
        },
    ];

    const requirements = [
        {
            icon: <FileText className='w-6 h-6 text-green-600' />,
            title: 'CMND/CCCD/Hộ chiếu',
            description: 'Bản gốc còn hiệu lực, có thể quét/chụp ảnh để xác thực KYC',
        },
        {
            icon: <Car className='w-6 h-6 text-blue-600' />,
            title: 'Bằng lái xe',
            description: 'Bằng lái xe ô tô hợp lệ, còn thời hạn sử dụng (tối thiểu 1 năm kinh nghiệm)',
        },
        {
            icon: <CreditCard className='w-6 h-6 text-purple-600' />,
            title: 'Thẻ thanh toán',
            description: 'Thẻ tín dụng/ghi nợ hoặc ví điện tử để thanh toán và đặt cọc',
        },
        {
            icon: <User className='w-6 h-6 text-orange-600' />,
            title: 'Độ tuổi',
            description: 'Từ 21 tuổi trở lên để thuê xe tự lái',
        },
    ];

    const policies = [
        {
            icon: <Shield className='w-6 h-6 text-green-600' />,
            title: 'Bảo hiểm',
            description:
                'Tất cả xe đều được bảo hiểm đầy đủ. Khách hàng có trách nhiệm trong trường hợp vi phạm giao thông hoặc sử dụng sai mục đích.',
        },
        {
            icon: <Clock className='w-6 h-6 text-blue-600' />,
            title: 'Thời gian thuê',
            description:
                'Thời gian thuê tối thiểu 1 ngày. Có thể thuê theo giờ (từ 4 giờ trở lên) hoặc theo ngày/tuần/tháng.',
        },
        {
            icon: <AlertCircle className='w-6 h-6 text-red-600' />,
            title: 'Quy định sử dụng',
            description:
                'Không được phép lái xe khi say rượu, sử dụng chất kích thích. Tuân thủ luật giao thông và bảo quản xe cẩn thận.',
        },
        {
            icon: <CreditCard className='w-6 h-6 text-purple-600' />,
            title: 'Hoàn tiền',
            description:
                'Hoàn tiền 100% nếu hủy trước 24h. Hủy trong vòng 24h sẽ mất phí hủy 20%. Hủy trong ngày không được hoàn tiền.',
        },
    ];

    const faqs = [
        {
            question: 'Tôi cần chuẩn bị những gì để thuê xe?',
            answer:
                'Bạn cần có CMND/CCCD, bằng lái xe hợp lệ, thẻ thanh toán và đảm bảo đủ 21 tuổi trở lên. Tài khoản cần được xác thực KYC trước khi đặt xe.',
        },
        {
            question: 'Giá thuê xe được tính như thế nào?',
            answer:
                'Giá thuê xe được tính theo ngày. Có các gói thuê theo giờ (từ 4h), theo ngày, tuần hoặc tháng với mức giá ưu đãi khác nhau. Giá có thể thay đổi tùy theo loại xe và thời điểm.',
        },
        {
            question: 'Xe có được bảo hiểm không?',
            answer:
                'Tất cả xe đều được bảo hiểm đầy đủ. Tuy nhiên, khách hàng sẽ chịu trách nhiệm trong trường hợp vi phạm giao thông, gây tai nạn do lỗi của mình hoặc sử dụng xe sai mục đích.',
        },
        {
            question: 'Tôi có thể hủy đặt xe không?',
            answer:
                'Có, bạn có thể hủy đặt xe. Hủy trước 24h sẽ được hoàn tiền 100%. Hủy trong vòng 24h sẽ mất phí hủy 20%. Hủy trong ngày không được hoàn tiền.',
        },
        {
            question: 'Xe có sạc đầy pin không?',
            answer:
                'Xe sẽ được sạc đầy pin trước khi giao cho khách hàng. Khách hàng có trách nhiệm sạc lại xe trong quá trình sử dụng nếu cần.',
        },
        {
            question: 'Tôi có thể nhận và trả xe ở đâu?',
            answer:
                'Bạn có thể chọn điểm nhận và trả xe tại các trạm của chúng tôi. Hiện tại chúng tôi có nhiều trạm tại các thành phố lớn. Bạn có thể xem danh sách trạm khi đặt xe.',
        },
        {
            question: 'Nếu xe bị hỏng trong quá trình sử dụng thì sao?',
            answer:
                'Nếu xe bị hỏng do lỗi kỹ thuật, vui lòng liên hệ ngay với chúng tôi qua hotline. Chúng tôi sẽ cử nhân viên đến hỗ trợ hoặc thay thế xe khác nếu cần. Nếu hỏng do lỗi của khách hàng, sẽ phải chịu chi phí sửa chữa.',
        },
        {
            question: 'Tôi có thể thuê xe bao lâu?',
            answer:
                'Thời gian thuê tối thiểu là 1 ngày. Bạn có thể thuê từ vài ngày đến vài tháng tùy theo nhu cầu. Thuê càng lâu, giá càng ưu đãi.',
        },
    ];

    return (
        <div className='min-h-screen bg-white'>
            {/* Hero Section */}
            <section className='bg-gradient-to-br from-green-50 to-blue-50 py-20 mt-20'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center'>
                        <h1 className='text-5xl lg:text-6xl font-bold text-gray-900 mb-6'>
                            Hướng dẫn thuê xe
                        </h1>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto mb-8'>
                            Tất cả thông tin bạn cần biết để thuê xe điện một cách dễ dàng và
                            thuận tiện nhất
                        </p>
                        <Link
                            to='/thue-xe-tu-lai'
                            className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300'
                        >
                            Bắt đầu thuê xe ngay
                            <ArrowRight className='w-5 h-5' />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className='py-20 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                            Quy trình thuê xe 6 bước
                        </h2>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                            Thuê xe điện chưa bao giờ dễ dàng đến thế. Chỉ cần 6 bước đơn giản
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className='relative bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300'
                            >
                                <div className='flex items-start gap-4'>
                                    <div className='flex-shrink-0'>
                                        <div className='w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center'>
                                            {step.icon}
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <span className='text-2xl font-bold text-green-600'>
                                                {step.number}
                                            </span>
                                            <h3 className='text-xl font-semibold text-gray-900'>
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className='text-gray-600 leading-relaxed'>
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                            Yêu cầu để thuê xe
                        </h2>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                            Đảm bảo bạn đáp ứng đầy đủ các yêu cầu sau để có thể thuê xe
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {requirements.map((req, index) => (
                            <div
                                key={index}
                                className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
                            >
                                <div className='flex items-center gap-4 mb-4'>
                                    <div className='w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center'>
                                        {req.icon}
                                    </div>
                                    <h3 className='text-lg font-semibold text-gray-900'>
                                        {req.title}
                                    </h3>
                                </div>
                                <p className='text-gray-600 text-sm'>{req.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Policies Section */}
            <section className='py-20 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                            Chính sách và quy định
                        </h2>
                        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                            Nắm rõ các chính sách để có trải nghiệm thuê xe tốt nhất
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {policies.map((policy, index) => (
                            <div
                                key={index}
                                className='bg-gray-50 rounded-xl p-6 border border-gray-200'
                            >
                                <div className='flex items-start gap-4'>
                                    <div className='w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm'>
                                        {policy.icon}
                                    </div>
                                    <div className='flex-1'>
                                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                            {policy.title}
                                        </h3>
                                        <p className='text-gray-600 leading-relaxed'>
                                            {policy.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className='py-20 bg-gray-50'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
                            <HelpCircle className='w-8 h-8 text-green-600' />
                        </div>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                            Câu hỏi thường gặp
                        </h2>
                        <p className='text-xl text-gray-600'>
                            Tìm câu trả lời cho những thắc mắc phổ biến
                        </p>
                    </div>
                    <div className='space-y-4'>
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className='bg-white rounded-xl p-6 shadow-sm border border-gray-200'
                            >
                                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                                    {faq.question}
                                </h3>
                                <p className='text-gray-600 leading-relaxed'>{faq.answer}</p>
                            </div>
                        ))}
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

            {/* Contact Section */}
            <section className='py-20 bg-white'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-16'>
                        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                            Cần hỗ trợ thêm?
                        </h2>
                        <p className='text-xl text-gray-600'>
                            Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào
                        </p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='text-center p-6'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
                                <Phone className='w-8 h-8 text-green-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                Hotline
                            </h3>
                            <p className='text-gray-600'>1900 1234</p>
                            <p className='text-gray-600 text-sm'>24/7 hỗ trợ</p>
                        </div>
                        <div className='text-center p-6'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4'>
                                <Mail className='w-8 h-8 text-blue-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                Email
                            </h3>
                            <p className='text-gray-600'>support@evstation.com</p>
                            <p className='text-gray-600 text-sm'>Phản hồi trong 24h</p>
                        </div>
                        <div className='text-center p-6'>
                            <div className='inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4'>
                                <MapPin className='w-8 h-8 text-purple-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                Văn phòng
                            </h3>
                            <p className='text-gray-600'>123 Đường ABC, Quận XYZ</p>
                            <p className='text-gray-600 text-sm'>TP. Hồ Chí Minh</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

