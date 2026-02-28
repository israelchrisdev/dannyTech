import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Buy Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Buy</h3>
            <ul className="space-y-2">
              <li><Link to="/registration" className="hover:text-white">Registration</Link></li>
              <li><Link to="/buying-essentials" className="hover:text-white">Buying Essentials</Link></li>
              <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
              <li><Link to="/stores" className="hover:text-white">Stores</Link></li>
            </ul>
          </div>

          {/* Sell Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Sell</h3>
            <ul className="space-y-2">
              <li><Link to="/sell/start" className="hover:text-white">Start Selling</Link></li>
              <li><Link to="/learn-to-sell" className="hover:text-white">Learn to Sell</Link></li>
              <li><Link to="/business-sellers" className="hover:text-white">Business Sellers</Link></li>
              <li><Link to="/affiliates" className="hover:text-white">Affiliates</Link></li>
            </ul>
          </div>

          {/* Tools & Apps Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools & Apps</h3>
            <ul className="space-y-2">
              <li><Link to="/mobile-apps" className="hover:text-white">Mobile Apps</Link></li>
              <li><Link to="/developer" className="hover:text-white">Developers</Link></li>
              <li><Link to="/security-center" className="hover:text-white">Security Center</Link></li>
              <li><Link to="/site-map" className="hover:text-white">Site Map</Link></li>
            </ul>
          </div>

          {/* Help & Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Help & Contact</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link to="/feedback" className="hover:text-white">Feedback</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm">
              Copyright © {currentYear} eBay Clone. All Rights Reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-white">
                Terms of Use
              </Link>
              <Link to="/cookies" className="text-sm hover:text-white">
                Cookie Notice
              </Link>
              <Link to="/accessibility" className="text-sm hover:text-white">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;