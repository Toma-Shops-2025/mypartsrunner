import { Database } from '../lib/database.types';

type Runner = Database['public']['Tables']['runners']['Row'];

interface RunnerCardProps {
  runner: Runner;
  distance?: number;
  onSelect?: (runner: Runner) => void;
}

export default function RunnerCard({ runner, distance, onSelect }: RunnerCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(runner);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        onSelect ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`h-3 w-3 rounded-full mr-2 ${
                runner.status === 'available'
                  ? 'bg-green-500'
                  : runner.status === 'busy'
                  ? 'bg-yellow-500'
                  : 'bg-gray-500'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                runner.status === 'available'
                  ? 'text-green-700'
                  : runner.status === 'busy'
                  ? 'text-yellow-700'
                  : 'text-gray-700'
              }`}
            >
              {runner.status.charAt(0).toUpperCase() + runner.status.slice(1)}
            </span>
          </div>
          {distance !== undefined && (
            <span className="text-sm text-gray-600">
              {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`} away
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">Rating:</span>
            <div className="ml-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    i < Math.floor(runner.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3.314l2.12-1.542a1 1 0 011.173 1.607l-1.715 1.666.404 2.36a1 1 0 01-1.451 1.054L10 7.868l-2.03.591a1 1 0 01-1.452-1.054l.404-2.36-1.715-1.666a1 1 0 011.173-1.607L10 3.314z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">
                ({runner.rating.toFixed(1)})
              </span>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-sm font-medium text-gray-900">Vehicle:</span>
            <span className="ml-2 text-sm text-gray-600">
              {runner.vehicle_type.charAt(0).toUpperCase() + runner.vehicle_type.slice(1)}
              {runner.vehicle_info && ` - ${runner.vehicle_info}`}
            </span>
          </div>

          <div className="mt-2">
            <span className="text-sm font-medium text-gray-900">Deliveries:</span>
            <span className="ml-2 text-sm text-gray-600">
              {runner.total_deliveries} completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 