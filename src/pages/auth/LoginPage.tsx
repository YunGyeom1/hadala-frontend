import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/features/auth/api';
import { LoginRequest } from '@/types/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authApi.login(formData);
      localStorage.setItem('access_token', response.access_token);
      navigate('/');
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-white">
      {/* 네비게이션 바 */}
      <nav className="w-full max-w-md py-6 flex justify-center">
        <span className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm">HADALA</span>
      </nav>
      <main className="flex-1 w-full flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl space-y-8 border border-gray-100">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              로그인
            </h2>
            <p className="text-center text-gray-500 text-sm mb-4">서비스를 이용하려면 로그인하세요</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                  placeholder="이메일"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 shadow-md transition"
              >
                로그인
              </button>
            </div>
          </form>
          <div className="text-center text-sm text-gray-600 pt-2">
            아직 계정이 없으신가요?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline font-medium">회원가입</Link>
          </div>
        </div>
      </main>
    </div>
  );
} 