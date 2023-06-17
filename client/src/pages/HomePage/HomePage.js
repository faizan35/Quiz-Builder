import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [quizIdInput, setQuizIdInput] = useState("");

  const fetchAndNavigateToQuiz = async (quizId) => {
    try {
      // console.log("hit 1...");
      const response = await axios.get(
        `http://localhost:5000/api/quiz/${quizId}`
      );
      // console.log("hit 1...");
      const quizData = response.data;

      // Check if startTime exists and if it's in the future
      if (quizData.startTime) {
        const currentDateTime = new Date();
        const startTime = new Date(quizData.startTime);

        if (startTime > currentDateTime) {
          alert(`Time to Start the Quiz is ${startTime.toLocaleTimeString()}.`);
          return; // Do not proceed further
        }
      }

      // Show the instructions alert
      alert(
        "Instructions for the Quiz :-" +
          "\n" +
          "   1. " +
          quizData.instructions[0] +
          "\n" +
          "   2. " +
          quizData.instructions[1] +
          "\n" +
          "\n" +
          "Total time for the Quiz is = " +
          quizData.timeOfQuiz +
          " minutes."
      );

      navigate("/quizpage", { state: { quizData, quizId } });
    } catch (error) {
      console.error("Failed to fetch the quiz", error);
    }
  };

  const handleDemoClick = () => {
    fetchAndNavigateToQuiz("xxx00");
  };

  const handleStartQuiz = async () => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAndNavigateToQuiz(quizIdInput);
  };

  const handleCreateQuizClick = () => {
    if (auth.isAuthenticated) {
      navigate("/createquiz");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="animated-title">Unleash the Power of Quizzing!</h1>
        <p className="animated-description">
          Craft engaging quizzes in minutes, gauge knowledge effortlessly.
        </p>
        <button className="cta-button" onClick={handleCreateQuizClick}>
          Create Quiz
        </button>
        <button className="cta-button" onClick={handleDemoClick}>
          Take a Demo
        </button>
        <div className="start-quiz-section">
          <label className="ID">Enter Quiz ID to start your Quiz:</label>
          <input
            className="quiz-id-input"
            type="text"
            value={quizIdInput}
            onChange={(e) => setQuizIdInput(e.target.value)}
            placeholder="Enter Quiz ID"
          />
          <button className="cta-button" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      </div>

      <div className="features-overview">
        {/* Add features overview content here */}
      </div>
    </div>
  );
};

export default HomePage;

// --------------------------------------------------------------

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./HomePage.css";

// const HomePage = () => {
//   const auth = useSelector((state) => state.auth);
//   const navigate = useNavigate();
//   const [quizIdInput, setQuizIdInput] = useState("");

//   const fetchAndNavigateToQuiz = async (quizId) => {
//     try {
//       const response = await axios.get(`/api/quiz/${quizId}`);
//       const quizData = response.data;

//       // Show the instructions alert
//       alert(
//         "Instructions for the Quiz :-" +
//           "\n" +
//           "   1. " +
//           quizData.instructions[0] +
//           "\n" +
//           "   2. " +
//           quizData.instructions[1] +
//           "\n" +
//           "\n" +
//           "Total time for the Quiz is = " +
//           quizData.timeOfQuiz +
//           " minutes."
//       );

//       navigate("/quizpage", { state: { quizData, quizId } });
//     } catch (error) {
//       console.error("Failed to fetch the quiz", error);
//     }
//   };

//   const handleDemoClick = () => {
//     fetchAndNavigateToQuiz("xxx00");
//   };

//   const handleStartQuiz = async () => {
//     if (!auth.isAuthenticated) {
//       navigate("/login");
//       return;
//     }
//     fetchAndNavigateToQuiz(quizIdInput);
//   };

//   const handleCreateQuizClick = () => {
//     if (auth.isAuthenticated) {
//       navigate("/createquiz");
//     } else {
//       navigate("/login");
//     }
//   };

//   return (
//     <div className="home-container ">
//       <div className="hero-section">
//         <h1>Catchy Headline Here</h1>
//         <p>Brief description or tagline.</p>
//         <button onClick={handleCreateQuizClick}>Create Quiz</button>
//         <button onClick={handleDemoClick}>Take a Demo</button>
//         <div className="start-quiz-section">
//           <label className="ID">Enter Quiz ID to start your Quiz:</label>
//           <input
//             type="text"
//             value={quizIdInput}
//             onChange={(e) => setQuizIdInput(e.target.value)}
//             placeholder="Enter Quiz ID"
//           />
//           <button onClick={handleStartQuiz}>Start Quiz</button>
//         </div>
//       </div>

//       {
//         <div className="features-overview">
//           {/* Add features overview content here */}
//         </div>
//       }
//     </div>
//   );
// };

// export default HomePage;

// ----------------------------------------------------------------
