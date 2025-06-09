import { Link, useLocation } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

const TopBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  return (
    <div className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex space-x-8">
              <Link
                to="/farmer/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/farmer/')
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Farmer
              </Link>
              <Link
                to="/wholesaler/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/wholesaler/')
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Wholesaler
              </Link>
              <Link
                to="/retailer/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/retailer/')
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Retailer
              </Link>
              <Link
                to="/tester/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/tester/')
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Tester
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <span className="text-sm font-medium">테스트 사용자</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-gray-500" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 