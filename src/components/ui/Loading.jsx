const Loading = ({ type = "cards" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(12)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="shimmer h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex justify-between items-center">
                <div className="shimmer h-3 bg-gray-200 rounded w-16"></div>
                <div className="shimmer h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="shimmer h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="shimmer h-80 bg-gray-200 rounded-xl mb-4"></div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="shimmer h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="shimmer h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="shimmer h-4 bg-gray-200 rounded w-full"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="shimmer h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="shimmer h-32 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loading;