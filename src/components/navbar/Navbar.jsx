import { useState } from "react";
import { Link } from "react-router-dom";

import "./Navbar.css";

import Service1 from "../../assets/service1.jpg";
import Service2 from "../../assets/service2.jpeg";
import Service3 from "../../assets/service3.jpeg";

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const navLinks = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "About",
      url: "/about",
    },
    {
      label: "Use AI",
      url: "/ai",
    },
  ];

  const articleItems = [
    {
      url: "",
      title: "Translation",
      subTitle: "Break language barriers with real-time",
      img: Service1,
    },
    {
      url: "",
      title: "Language Detection",
      subTitle: "Identify languages on the fly with high precision",
      img: Service3,
    },
    {
      url: "",
      title: "Summarization",
      subTitle: "Extract key insights from long texts instantly",
      img: Service2,
    }

  ];

  const handleArticleClick = () => {
    setIsActive(true);
  };

  const handleShowLessClick = (event) => {
    event.stopPropagation();
    setIsActive(false);
  };

  return (
    <div className="navbar">
      <div className="nav-links">
        {navLinks.map((link, index) => (
          <div className="nav-link" key={index}>
            <Link to={link.url}>{link.label}</Link>
          </div>
        ))}
      </div>

      <div
        className={`nav-external-links ${isActive ? "active" : ""}`}
        onClick={handleArticleClick}
      >
        {articleItems.map((item, index) => (
          <div
            className="article-item"
            id={`article-item-${index + 1}`}
            key={index}
          >
            <Link to={item.url}>
              <div className="article-item-img">
                <img src={item.img} alt={`Article Img ${index + 1}`} />
              </div>
              <div className="article-item-content">
                <p id="article-item-name">{item.title}</p>
                <p id="article-item-copy">{item.subTitle}</p>
              </div>
            </Link>
          </div>
        ))}

        <div className="toggle-articles" onClick={handleShowLessClick}>
          <button className="btn">Show less</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
