import { Link } from "react-router-dom";

import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-col">
        <div className="footer-sub-col">
          <div className="footer-link">
            <Link to="/about">
              &#x2192; <b>ABOUT</b>
            </Link>
          </div>
          <div className="footer-link">
            <p>This project is designed to provide seamless, AI-driven text processing for users who need instant translation, smart summarization, and accurate language detection. Powered by advanced AI models, it ensures efficiency, precision, and ease of use for individuals, professionals, and businesses.</p>
          </div>
        </div>
      </div>

      <div className="footer-col-sm">
        <div className="footer-sub-col">
          <div className="footer-link">
            <b>&#x2192; 📝 Text Translation</b>
          </div>
          <div className="footer-link">
            <b>&#x2192; 🚀 Content Summary</b>
          </div>
          <div className="footer-link">
            <b>&#x2192; 🌍 Language Detection</b>
          </div>
        </div>
      </div>

      <div className="footer-col">
        <div className="footer-link">
          <p>&copy; Fahd Adebayo - (@fahd.dev)</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
