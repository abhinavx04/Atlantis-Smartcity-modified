import React from 'react';
import gmail from '../../assets/gmail.png';
import twitter from '../../assets/twitter.png';
import instagram from '../../assets/instagram.png';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
      <div className="container mx-auto px-4 py-4 text-center">
        {/* About Section */}
        <div className="mb-2">
          <h3 className="font-['Syncopate'] text-xl text-white mb-2">DWARKA</h3>
          <p className="text-gray-400 text-sm">
            Building a smarter, more connected future through innovative urban solutions 
            and sustainable development.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mb-2">
          <h4 className="font-['Syncopate'] text-lg text-white mb-2">CONNECT</h4>
          <div className="space-y-1 text-sm">
            <p className="text-gray-400">
              <span className="text-blue-400">Address:</span> 123 Dwarka, the Gatway to Moksha
            </p>
            <p className="text-gray-400">
              <span className="text-blue-400">Contact Us:</span> 033 000 000
            </p>
            <div className="flex justify-center space-x-3 mt-2">
              <a href="mailto:contact@atlantis.city" target="_blank" rel="noreferrer">
                <img src={gmail} alt="Gmail" className="w-6 h-6 filter invert brightness-0" />
              </a>
              <a href="https://twitter.com/theatlantis_sc" target="_blank" rel="noreferrer">
                <img src={twitter} alt="Twitter" className="w-6 h-6 filter invert brightness-0" />
              </a>
              <a href="https://www.instagram.com/theatlantis_sc/" target="_blank" rel="noreferrer">
                <img src={instagram} alt="Instagram" className="w-6 h-6 filter invert brightness-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-2 border-t border-gray-800/50">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Atlantis Smart City. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
