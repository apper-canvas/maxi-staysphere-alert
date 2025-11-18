import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Footer = () => {
  const footerSections = [
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Safety information", href: "/safety" },
        { label: "Cancellation options", href: "/cancellation" },
        { label: "Report issue", href: "/report" }
      ]
    },
    {
      title: "Community",
      links: [
        { label: "StaySphere.org", href: "/community" },
        { label: "Disaster relief", href: "/relief" },
        { label: "Combat discrimination", href: "/inclusion" },
        { label: "Invite friends", href: "/invite" }
      ]
    },
    {
      title: "Hosting",
      links: [
        { label: "Host your home", href: "/host" },
        { label: "Host an experience", href: "/experience" },
        { label: "Responsible hosting", href: "/responsible" },
        { label: "Community Center", href: "/center" }
      ]
    },
    {
      title: "StaySphere",
      links: [
        { label: "Newsroom", href: "/news" },
        { label: "New features", href: "/features" },
        { label: "Careers", href: "/careers" },
        { label: "Investors", href: "/investors" }
      ]
    }
  ];

  const socialLinks = [
    { icon: "Facebook", href: "#" },
    { icon: "Twitter", href: "#" },
    { icon: "Instagram", href: "#" },
    { icon: "Youtube", href: "#" }
  ];

  return (
    <footer className="hidden lg:block bg-background border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex flex-col lg:flex-row items-center gap-4 text-sm text-gray-600">
              <span>© 2024 StaySphere, Inc.</span>
              <div className="hidden lg:block w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-4">
                <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                  Privacy
                </Link>
                <span>·</span>
                <Link to="/terms" className="hover:text-gray-900 transition-colors">
                  Terms
                </Link>
                <span>·</span>
                <Link to="/sitemap" className="hover:text-gray-900 transition-colors">
                  Sitemap
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Language/Currency */}
              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ApperIcon name="Globe" className="w-4 h-4" />
                  English (US)
                </button>
                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                  $ USD
                </button>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <ApperIcon name={social.icon} className="w-4 h-4 text-gray-600" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;