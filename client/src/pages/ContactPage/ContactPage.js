import React from "react";
import "./ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h1>Contact CreateQuiz</h1>
      <p>
        We're dedicated to providing the best experience for our users. Whether you have questions, feedback, or need assistance, our team is here to support you. Use the form below to get in touch with us.
      </p>

      <div className="contact-details">
        <div className="detail">
          <i className="icon" aria-hidden="true">📞</i>
          <h2>Phone</h2>
          <p>+1 (123) 456-7890</p>
        </div>
        <div className="detail">
          <i className="icon" aria-hidden="true">📧</i>
          <h2>Email</h2>
          <p>support@createquiz.com</p>
        </div>
        <div className="detail">
          <i className="icon" aria-hidden="true">📍</i>
          <h2>Address</h2>
          <p>123 Quiz Street, QuizCity, QZ 12345</p>
        </div>
      </div>

      <div className="feedback-form">
        <h2>Feedback Form</h2>
        <p>Your feedback helps us improve. Let us know your thoughts!</p>
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Your Name" required />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Your Email" required />
        </div>

        <div className="input-group">
          <label htmlFor="feedback">Feedback</label>
          <textarea id="feedback" placeholder="Share your feedback" rows="5" required></textarea>
        </div>

        <button type="submit">Submit Feedback</button>
      </div>
    </div>
  );
};

export default ContactPage;
