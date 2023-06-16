import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1>About</h1>

      <section className="features-section">
        {[
          {
            icon: "🔧",
            title: "Dynamic Quiz Creation",
            description:
              "Craft quizzes that resonate with your style. From MCQs to short answers, we've got you covered.",
          },
          {
            icon: "⏰",
            title: "Adaptive Timer Functionality",
            description:
              "Unique timers for each quiz. An on-screen timer ensures students manage their time.",
          },
          {
            icon: "🔀",
            title: "Intelligent Question Shuffling",
            description:
              "Fairness is key. Our platform shuffles questions for every student from a vast question bank.",
          },
          {
            icon: "📊",
            title: "Comprehensive Dashboard",
            description:
              "Insights, analytics, and management tools right at your fingertips.",
          },
          {
            icon: "📝",
            title: "Easy Question Import",
            description:
              "Bulk import questions using our simple template. Making quiz creation faster than ever.",
          },
          {
            icon: "🌐",
            title: "Global Accessibility",
            description:
              "CreateQuiz is accessible from anywhere around the world. Ensuring no one misses out.",
          },
        ].map((feature, index) => (
          <div className="feature" key={index}>
            <i className="feature-icon" aria-hidden="true">
              {feature.icon}
            </i>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AboutPage;
