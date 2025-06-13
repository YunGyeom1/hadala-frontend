import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            하달라에 오신 것을 환영합니다
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            구글 계정으로 로그인하여 시작하세요
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            구글로 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
