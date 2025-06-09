import { Link } from 'react-router-dom';
import { Database } from '../lib/database.types';

type Store = Database['public']['Tables']['stores']['Row'];

interface StoreCardProps {
  store: Store;
  distance?: number;
}

export default function StoreCard({ store, distance }: StoreCardProps) {
  return (
    <Link to={`/store/${store.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{store.description}</p>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              {store.address}, {store.city}, {store.state} {store.zip}
            </p>
            {distance !== undefined && (
              <p className="text-sm text-gray-600 mt-1">
                {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`} away
              </p>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  store.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {store.status === 'active' ? 'Open' : 'Closed'}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {JSON.parse(store.hours as string)[new Date().getDay()]}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 