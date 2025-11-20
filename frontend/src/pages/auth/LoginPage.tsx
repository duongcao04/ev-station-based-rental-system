import { LoginForm } from '@/components/auth/LoginForm';
import { useProfile } from '../../lib/queries/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useEffect } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { user } = useAuthStore();

  useEffect(() => {
    // Chỉ redirect nếu cả profile và user đều có (đảm bảo auth state đầy đủ)
    if (profile || user) {
      toast('Bạn đã đăng nhập', {
        description: 'Quay trở lại trang chủ',
      });
      navigate('/', { replace: true });
    }
  }, [profile, user, navigate]);

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-linear-to-br from-green-50 to-blue-50 py-20'>
      <div className='w-full max-w-sm md:max-w-4xl'>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
