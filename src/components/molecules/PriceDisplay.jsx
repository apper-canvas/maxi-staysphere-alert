const PriceDisplay = ({ 
  price, 
  period = "night", 
  size = "md", 
  showTotal = false, 
  nights = 1,
  className = "" 
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl"
  };

  const total = price * nights;

  return (
    <div className={`${className}`}>
      <div className={`flex items-baseline gap-1 ${sizeClasses[size]}`}>
        <span className="font-display font-bold text-gray-900">
          ${price.toLocaleString()}
        </span>
        <span className="text-gray-600 text-sm">
          {period}
        </span>
      </div>
      {showTotal && nights > 1 && (
        <div className="text-sm text-gray-500 mt-1">
          ${total.toLocaleString()} total
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;