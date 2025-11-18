import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ title = "Something went wrong", message = "We're sorry, but something unexpected happened.", onRetry }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[400px] px-6 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-3">
          {title}
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorView;