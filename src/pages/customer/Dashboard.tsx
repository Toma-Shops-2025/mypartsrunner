import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/customer/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">
                  MyPartsRunner™
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/customer/orders"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Orders
                </Link>
                <Link
                  to="/customer/saved"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Saved Items
                </Link>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
              <form onSubmit={handleSearch} className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search parts or stores..."
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route
            index
            element={
              <div className="px-4 py-6 sm:px-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Featured Stores */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">Featured Stores</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Popular auto parts and hardware stores near you.
                      </p>
                      {/* Add store list here */}
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Track your recent orders and deliveries.
                      </p>
                      {/* Add order list here */}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                      <div className="mt-2 space-y-2">
                        <Link
                          to="/customer/search"
                          className="block text-sm text-blue-600 hover:text-blue-500"
                        >
                          Browse All Stores
                        </Link>
                        <Link
                          to="/customer/orders"
                          className="block text-sm text-blue-600 hover:text-blue-500"
                        >
                          View All Orders
                        </Link>
                        <Link
                          to="/customer/profile"
                          className="block text-sm text-blue-600 hover:text-blue-500"
                        >
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          {/* Add other customer routes here */}
        </Routes>
      </main>
    </div>
  );
} 