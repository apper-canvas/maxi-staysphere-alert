import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8 
          }}
        >
          <ApperIcon name="Home" className="w-12 h-12 text-primary" />
        </motion.div>
        
        <motion.h1
          className="text-6xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          className="text-2xl font-display font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Oops! Page not found
        </motion.h2>
        
        <motion.p
          className="text-gray-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          The page you're looking for seems to have wandered off. Let's get you back to exploring amazing places to stay.
        </motion.p>
        
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/search" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Search properties
            </Link>
            <span className="hidden sm:block text-gray-300">•</span>
            <Link 
              to="/help" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Get help
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;