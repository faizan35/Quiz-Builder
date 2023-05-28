import React, { useState } from "react";
import "./QuizPage.css";

const QuizPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correct: 2,
    },
    {
      question: "Which planet is known as the 'Red Planet'?",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      correct: 0,
    },
    {
      question: "Which of the following is not a prime number?",
      options: ["2", "3", "4", "5"],
      correct: 2,
    },
    {
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: [
        "Charles Dickens",
        "William Shakespeare",
        "Jane Austen",
        "George Orwell",
      ],
      correct: 1,
    },
    {
      question: "What is the largest mammal?",
      options: ["Elephant", "Whale", "Giraffe", "Hippopotamus"],
      correct: 1,
    },
    {
      question: "Which gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
      correct: 1,
    },
    {
      question: "Which country is known as the 'Land of the Rising Sun'?",
      options: ["China", "South Korea", "Japan", "Thailand"],
      correct: 2,
    },
    {
      question: "Which element has the chemical symbol 'Au'?",
      options: ["Silver", "Gold", "Aluminum", "Argon"],
      correct: 1,
    },
    {
      question: "Which ocean is the largest?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      correct: 3,
    },
    // ... add more questions as needed
  ];

  const handleOptionChange = (index) => {
    setSelectedOption(index);
  };

  const handleNavigation = (direction) => {
    if (direction === "prev" && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    } else if (
      direction === "next" &&
      currentQuestionIndex < questions.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="quiz-container">
      <h2>{questions[currentQuestionIndex].question}</h2>
      <div className="options">
        {questions[currentQuestionIndex].options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              value={index}
              checked={selectedOption === index}
              onChange={() => handleOptionChange(index)}
            />
            {option}
          </label>
        ))}
      </div>
      <div className="timer">00:30</div> {/* Implement timer logic */}
      <div className="navigation-buttons">
        <button onClick={() => handleNavigation("prev")}>Previous</button>
        <button onClick={() => handleNavigation("next")}>Next</button>
      </div>
      <div className="question-navigation">
        {questions.map((_, index) => (
          <button
            key={index}
            className={currentQuestionIndex === index ? "active" : ""}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
