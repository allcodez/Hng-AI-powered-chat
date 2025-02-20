import { useEffect } from "react";
import { Link } from "react-router-dom";

import "./Home.css";

import Transition from "../../components/transition/Transition";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const enhance = (id) => {
  const element = document.getElementById(id),
    text = element.innerText.split("");
  element.innerText = "";

  text.forEach((value, index) => {
    const outer = document.createElement("span");
    outer.className = "outer";

    const inner = document.createElement("span");
    inner.className = "inner";
    inner.style.animationDelay = `${rand(-5000, 0)}ms`;

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.innerText = value;
    letter.style.animationDelay = `${index * 1000}ms`;

    inner.appendChild(letter);
    outer.appendChild(inner);
    element.appendChild(outer);
  });
};

const Home = () => {
  useEffect(() => {
    enhance("hero-link-01");
  }, []);

  return (
    <>
      <div className="hero-header">
        <div id="text">
          <div className="line">
            <p className="word">AI - Powered</p>
            {/* <p className="word">Powered</p> */}
          </div>

          <div className="line">
            <p className="word">Language</p>
            <p className="word">&</p>
          </div>

          <div className="line">
            <p className="word">Text <span></span></p>
            <p className="word">Solution</p>
          </div>
          <br />

          <div className="line">
            <Link
              id="hero-link-01"
              to="/ai"
              className="word fancy"
            >
              &#x2192;Use_Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transition(Home);
