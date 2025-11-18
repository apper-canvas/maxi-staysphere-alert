import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams();
    if (searchParams.location) params.set("location", searchParams.location);
    if (searchParams.checkIn) params.set("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) params.set("checkOut", searchParams.checkOut);
    if (searchParams.guests) params.set("guests", searchParams.guests.toString());
    
    navigate(`/search?${params.toString()}`);
    setShowSearch(false);
  };

  const navItems = [
    { label: "Explore", href: "/", icon: "Compass" },
    { label: "Saved", href: "/saved", icon: "Heart" },
    { label: "Trips", href: "/trips", icon: "Calendar" },
    { label: "Messages", href: "/messages", icon: "MessageCircle" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Home" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              StaySphere
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            {showSearch ? (
              <SearchBar onSearch={handleSearch} />
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full bg-white border border-gray-300 rounded-full px-6 py-2 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <span className="text-sm font-medium text-gray-600">Start your search</span>
                <div className="ml-auto bg-primary text-white p-2 rounded-full">
                  <ApperIcon name="Search" className="w-4 h-4" />
                </div>
              </button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
              <ApperIcon name="User" className="w-4 h-4 text-gray-600" />
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="lg:hidden py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-2">
              <button
                onClick={() => {
                  setShowSearch(true);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <ApperIcon name="Search" className="w-5 h-5" />
                Start your search
              </button>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 gap-1 px-2 py-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center gap-1 py-2 px-1 text-xs font-medium text-white bg-primary rounded-lg mx-1 hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="Search" className="w-5 h-5" />
            Search
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;