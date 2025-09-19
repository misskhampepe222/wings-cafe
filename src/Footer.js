import React from 'react';
import './Footer.css';

const Header = () => {   // 👈 keep the name Header here
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-logo">MISS KHAMPEPE</span>
        <span className="footer-copy"> {new Date().getFullYear()} KHAMPEPEMOROESI60@GMAIL

        </span>
      </div>

      <div className="footer-center">
        <button className="icon-btn" title="Help">
          <span className="btn-icon">❓</span>
          <span className="btn-text">Help</span>
        </button>
        <button className="icon-btn" title="Settings">
          <span className="btn-icon">⚙️</span>
          <span className="btn-text">Settings</span>
        </button>
        <button className="icon-btn" title="Feedback">
          <span className="btn-icon">💬</span>
          <span className="btn-text">Feedback</span>
        </button>
      </div>

      <div className="footer-right">
        <span className="footer-info">Made with ❤️ at Wings Cafe</span>
      </div>
    </footer>
  );
};

export default Header;  // 👈 export it as Header
