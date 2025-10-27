import { useState } from 'react';
import {
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Play,
  ArrowRight,
  Battery,
 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('cars');

  const vehicles = [
    {
      id: 1,
      name: 'Tesla Model 3',
      type: 'Sedan',
      range: '500km',
      price: '2,500,000đ/ngày',
      image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&h=300&fit=crop',
      features: ['Tự lái', 'Sạc nhanh', 'Premium']
    },
    {
      id: 2,
      name: 'BMW i3',
      type: 'Hatchback',
      range: '300km',
      price: '1,800,000đ/ngày',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
      features: ['Eco-friendly', 'Compact', 'Urban']
    },
    {
      id: 3,
      name: 'VinFast VF8',
      type: 'SUV',
      range: '450km',
      price: '2,200,000đ/ngày',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=500&h=300&fit=crop',
      features: ['Spacious', 'Luxury', 'Vietnamese']
    }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-green-500" />,
      title: 'Sạc nhanh',
      description: 'Hệ thống sạc nhanh 30 phút đạt 80% pin'
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: 'Bảo hiểm đầy đủ',
      description: 'Bảo hiểm toàn diện cho mọi chuyến đi'
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: '24/7 Hỗ trợ',
      description: 'Đội ngũ hỗ trợ 24/7 sẵn sàng phục vụ'
    },
    {
      icon: <Battery className="w-8 h-8 text-yellow-500" />,
      title: 'Pin bền bỉ',
      description: 'Công nghệ pin tiên tiến, tuổi thọ cao'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Xe điện' },
    { number: '50+', label: 'Thành phố' },
    { number: '10,000+', label: 'Khách hàng' },
    { number: '99%', label: 'Hài lòng' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Tương lai xanh
                <span className="text-green-600 block">bắt đầu từ đây</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Khám phá thế giới xe điện với dịch vụ thuê xe chuyên nghiệp,
                thân thiện môi trường và tiết kiệm chi phí.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/thue-xe"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group"
                >
                  Thuê xe ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center group">
                  <Play className="mr-2 w-5 h-5" />
                  Xem video
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Chọn xe của bạn</h3>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab('cars')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'cars' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                        }`}
                    >
                      Xe hơi
                    </button>
                    <button
                      onClick={() => setActiveTab('bikes')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'bikes' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
                        }`}
                    >
                      Xe máy
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {vehicles.slice(0, 2).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                        <p className="text-sm text-gray-600">{vehicle.type} • {vehicle.range}</p>
                        <p className="text-green-600 font-semibold">{vehicle.price}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm thuê xe điện tốt nhất với
              công nghệ tiên tiến và dịch vụ chuyên nghiệp.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Đội xe đa dạng
            </h2>
            <p className="text-xl text-gray-600">
              Từ sedan sang trọng đến SUV rộng rãi, chúng tôi có đủ loại xe cho mọi nhu cầu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
                    <span className="text-sm text-gray-500">{vehicle.type}</span>
                  </div>
                  <p className="text-gray-600 mb-4">Tầm hoạt động: {vehicle.range}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{vehicle.price}</span>
                    <Link
                      to="/thue-xe"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Thuê ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu hành trình xanh?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn khách hàng đã tin tưởng lựa chọn dịch vụ thuê xe điện của chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/thue-xe"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Thuê xe ngay
            </Link>
            <Link
              to="/lien-he"
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}