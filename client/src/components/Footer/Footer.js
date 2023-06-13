import React from "react";
import "./Footer.css";
import {
  AiFillGoogleCircle,
  AiFillGithub,
  AiFillYoutube,
  AiFillInstagram,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="social-icons">
        <AiFillGoogleCircle className="icon" />
        <AiFillGithub className="icon" />
        <AiFillYoutube className="icon" />
        <AiFillInstagram className="icon" />
      </div>

      <div className="contact-info">
        Email: contact@yourdomain.com
        <br />
        Phone: +1 (123) 456-7890
      </div>

      <div className="rights">
        Quickquiz
        <br />
        @all rights reserved
      </div>
    </footer>
  );
};

export default Footer;
