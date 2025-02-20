import { Link } from "react-router-dom";
import { ReactLenis, useLenis } from "lenis/react";

import "./Information.css";

import Transition from "../../components/transition/Transition";

import {
  services,
} from "./info";

const About = () => {
  const lenis = useLenis(({ scroll }) => {});

  return (
    <ReactLenis root>
      <div className="information">
        <div className="container">
          <h1>
          This project is designed to provide seamless, AI-driven text processing for users who need instant translation, smart summarization, and accurate language detection. Powered by Chrome AI API, it ensures efficiency, precision, and ease of use for individuals and professionals.
          </h1>
          <div className="info-services">
            <div className="col">
              <div className="sub-col">
                <ul>
                  {services.map((item) => (
                    <li key={item.id}>&#x2192; {item.lang}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col">
              <p>
              We’re committed to breaking language barriers and making AI-powered text solutions accessible to everyone. Your support helps us improve and expand our services.
              </p>
              <div className="contact-link">
                <Link to="/">&#x2192; Donate Now</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ReactLenis>
  );
};

export default Transition(About);
