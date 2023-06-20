import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./QuizPage.css";

const QuizPage = () => {
  const username = useSelector((state) => state.auth.user?.username || "");

  const location = useLocation();
  const navigate = useNavigate();
  const fetchedQuizData = location.state?.quizData;
  const quizId = location.state?.quizId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(fetchedQuizData?.timeOfQuiz * 60);
  const [isChecked, setIsChecked] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState([]);

  const fetchQuizData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/quiz/${quizId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch quiz data", error);
      return null;
    }
  }, [quizId]);

  // const calculateResult = useCallback(
  //   (userAnswers, correctAnswers) => {
  //     let score = 0;

  //     if (!userAnswers || !userAnswers[quizId]) {
  //       return score;
  //     }

  //     if (userAnswers[quizId]) {
  //       userAnswers[quizId].forEach((userAnswer) => {

  //         let question = correctAnswers.quiz.find(
  //           (q) => q.questionId === userAnswer.questionId
  //         );
  //         if (question) {
  //           let option = question.options.find(
  //             (opt) => opt.optionId === userAnswer.optionId
  //           );
  //           if (option && option.optionText === question.rightAnsStr) {
  //             score += correctAnswers.marksPerQuestion;
  //           }
  //         }
  //       });
  //     }
  //     return score;
  //   },
  //   [quizId]
  // );

  const calculateResult = useCallback(
    (userAnswers, correctAnswers) => {
      let score = 0;

      if (!userAnswers || !userAnswers[quizId]) {
        return score;
      }

      if (userAnswers[quizId]) {
        userAnswers[quizId].forEach((userAnswer) => {
          // Ignore if userAnswer is null
          if (!userAnswer) {
            return;
          }

          let question = correctAnswers.quiz.find(
            (q) => q.questionId === userAnswer.questionId
          );
          if (question) {
            let option = question.options.find(
              (opt) => opt.optionId === userAnswer.optionId
            );
            if (option && option.optionText === question.rightAnsStr) {
              score += correctAnswers.marksPerQuestion;
            }
          }
        });
      }
      return score;
    },
    [quizId]
  );

  const submitQuiz = useCallback(async () => {
    if (quizId.startsWith("xxx00")) {
      const userAnswersRaw =
        JSON.parse(sessionStorage.getItem("quizTaken")) || {};
      console.log("if -- ", userAnswersRaw);

      const userAnswers = { ...userAnswersRaw };
      if (userAnswers[quizId]) {
        userAnswers[quizId] = userAnswers[quizId].map(
          (answer) => answer || { questionId: "default", optionId: "0" }
        );
      }

      if (!userAnswers[quizId] || userAnswers[quizId].length === 0) {
        alert("You haven't answered any questions. Your score is 0.");
        navigate("/");
        return;
      }

      const fetchedData = await fetchQuizData();
      console.log("feched = ", fetchedData);

      if (fetchedData == null) {
        alert("No quiz data available. Your score is 0.");
        navigate("/");
        return;
      }

      const result = calculateResult(userAnswers, fetchedData);
      alert(`Your score is: ${result}`);
      sessionStorage.clear();
      navigate("/");
      return;
    }

    // Original code for non-demo quizzes:
    const fetchedData = await fetchQuizData();
    if (!fetchedData) {
      alert("Failed to fetch quiz data. Please try again.");
      return;
    }
    const userAnswers = JSON.parse(sessionStorage.getItem("quizTaken"));
    const result = calculateResult(userAnswers, fetchedData);
    const payload = {
      username: username,
      quizTaken: userAnswers,
      result: result,
    };

    try {
      await axios.patch(
        "http://localhost:5000/api/users/saveQuizResults",
        payload
      );
      try {
        await axios.patch(
          "http://localhost:5000/api/result/updateQuizResults",
          payload
        );
        console.log("quiz Taken ==> ", payload);
      } catch (error) {
        console.error(
          "Failed to update quiz results in Result collection",
          error
        );
      }
      alert("Quiz results saved successfully!");
    } catch (error) {
      console.error("Failed to save quiz results", error);
      alert("Failed to save quiz results. Please try again.");
    }

    sessionStorage.clear();

    navigate("/");
  }, [quizId, navigate, calculateResult, fetchQuizData, username]);

  useEffect(() => {
    // Get the saved start time from sessionStorage
    const startTime = sessionStorage.getItem("quizStartTime");

    // If there's no saved start time, it means the user is starting the quiz now
    if (!startTime) {
      sessionStorage.setItem("quizStartTime", Date.now().toString());
      setTimeLeft(fetchedQuizData?.timeOfQuiz * 60);
    } else {
      // Calculate the time elapsed since the quiz started
      const timeElapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);

      // Calculate the remaining time
      const remainingTime = fetchedQuizData?.timeOfQuiz * 60 - timeElapsed;
      setTimeLeft(remainingTime > 0 ? remainingTime : 0);
    }

    if (timeLeft <= 0) {
      submitQuiz();
    } else {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, submitQuiz, fetchedQuizData?.timeOfQuiz]);

  useEffect(() => {
    const quizTaken = JSON.parse(sessionStorage.getItem("quizTaken")) || {};
    const selectedAnswer = quizTaken[quizId]?.[currentQuestionIndex]?.optionId;
    setSelectedOption(selectedAnswer || null);
  }, [currentQuestionIndex, quizId]);

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
    let quizTaken = JSON.parse(sessionStorage.getItem("quizTaken")) || {};
    if (!quizTaken[quizId]) {
      quizTaken[quizId] = [];
    }
    quizTaken[quizId][currentQuestionIndex] = {
      questionId: fetchedQuizData.quiz[currentQuestionIndex].questionId,
      optionId: optionId,
    };
    sessionStorage.setItem("quizTaken", JSON.stringify(quizTaken));
  };

  const handleNext = () => {
    if (currentQuestionIndex < fetchedQuizData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
  };

  const handleMarkQuestion = () => {
    if (markedQuestions.includes(currentQuestionIndex)) {
      setMarkedQuestions(
        markedQuestions.filter((index) => index !== currentQuestionIndex)
      );
    } else {
      setMarkedQuestions([...markedQuestions, currentQuestionIndex]);
    }
  };

  const currentQuestion = fetchedQuizData.quiz[currentQuestionIndex];
  return (
    <div className="quiz-container">
      <div className="question-navigation">
        {fetchedQuizData.quiz.map((_, index) => {
          const quizTaken =
            JSON.parse(sessionStorage.getItem("quizTaken")) || {};
          const isAttempted = !!quizTaken[quizId]?.[index];
          const isMarked = markedQuestions.includes(index);
          return (
            <button
              key={index}
              onClick={() => handleJumpToQuestion(index)}
              className={`${currentQuestionIndex === index ? "active" : ""} ${
                isAttempted ? "attempted" : ""
              } ${isMarked ? "marked" : ""}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="quiz-content">
        <h2>{fetchedQuizData.quizName}</h2>
        <div className="timer">
          <h3>
            Time Left : {Math.floor(timeLeft / 60)}:
            {timeLeft % 60 < 10 ? "0" : ""}
            {timeLeft % 60}
          </h3>
        </div>

        <h2>{currentQuestion.questionText}</h2>
        <div className="options">
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <label
                key={option.optionId}
                className={`option option-${index + 1} ${
                  selectedOption === option.optionId ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  value={option.optionId}
                  checked={selectedOption === option.optionId}
                  onChange={() => handleOptionChange(option.optionId)}
                />
                {String.fromCharCode(65 + index)}. {option.optionText}
              </label>
            ))}
          </div>
        </div>
        <div className="button-container">
          <div className="button-group-left">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={
                currentQuestionIndex === fetchedQuizData.quiz.length - 1
              }
            >
              Next
            </button>
            {/* <button onClick={handleMarkQuestion}>Mark Question</button> */}
            <button onClick={handleMarkQuestion}>
              {markedQuestions.includes(currentQuestionIndex)
                ? "Unmark Question"
                : "Mark Question"}
            </button>
          </div>
        </div>
        <div className="final-submit-container">
          <span style={{ color: "red", marginRight: "10px" }}>
            If you submit it is final
          </span>
          <input
            type="checkbox"
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <button
            onClick={submitQuiz}
            disabled={!isChecked}
            style={{ opacity: isChecked ? 1 : 0.5 }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

// --------------------------------------
// MINE
// ------------------------------------------------------------------
// import React, { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const QuizPage = () => {
//   const username = useSelector((state) => state.auth.user?.username || "");

//   const location = useLocation();
//   const navigate = useNavigate();
//   const fetchedQuizData = location.state?.quizData;
//   const quizId = location.state?.quizId;

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(fetchedQuizData?.timeOfQuiz * 60);

//   const fetchQuizData = useCallback(async () => {
//     try {
//       const response = await axios.get(`/api/quiz/${quizId}`);
//       // console.log("Fetched Quiz Data:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("Failed to fetch quiz data", error);
//       return null;
//     }
//   }, [quizId]);

//   const calculateResult = useCallback((userAnswers, correctAnswers) => {
//     let score = 0;
//     if (userAnswers[quizId]) {
//       userAnswers[quizId].forEach((userAnswer) => {
//         let question = correctAnswers.quiz.find(
//           (q) => q.questionId === userAnswer.questionId
//         );
//         if (question) {
//           let option = question.options.find(
//             (opt) => opt.optionId === userAnswer.optionId
//           );
//           if (option && option.optionText === question.rightAnsStr) {
//             score += correctAnswers.marksPerQuestion;
//           }
//         }
//       });
//     }
//     // const percentageScore =
//     //   (score / (correctAnswers.quiz.length * correctAnswers.marksPerQuestion)) *
//     //   100;
//     return score;
//   }, []);

//   const submitQuiz = useCallback(async () => {
//     const fetchedData = await fetchQuizData();
//     if (!fetchedData) {
//       alert("Failed to fetch quiz data. Please try again.");
//       return;
//     }
//     const userAnswers = JSON.parse(sessionStorage.getItem("quizTaken"));
//     const result = calculateResult(userAnswers, fetchedData);
//     const payload = {
//       username: username,
//       quizTaken: userAnswers,
//       result: result,
//     };

//     try {
//       await axios.patch("/api/users/saveQuizResults", payload);

//       // Update the Result collection with the new quiz results
//       try {
//         await axios.patch("/api/result/updateQuizResults", payload);
//         console.log("quiz Taken ==> ", payload);
//       } catch (error) {
//         console.error(
//           "Failed to update quiz results in Result collection",
//           error
//         );
//       }
//       alert("Quiz results saved successfully!");
//     } catch (error) {
//       console.error("Failed to save quiz results", error);
//       alert("Failed to save quiz results. Please try again.");
//     }

//     sessionStorage.removeItem("quizTaken");
//     navigate(quizId === "xxx00" ? "/" : "/dashboard");
//   }, [quizId, navigate, calculateResult, fetchQuizData, username]);

//   useEffect(() => {
//     if (timeLeft <= 0) {
//       submitQuiz();
//     } else {
//       const timer = setTimeout(() => {
//         setTimeLeft(timeLeft - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [timeLeft, submitQuiz]);

//   const handleOptionChange = (optionId) => {
//     setSelectedOption(optionId);
//     let quizTaken = JSON.parse(sessionStorage.getItem("quizTaken")) || {};
//     if (!quizTaken[quizId]) {
//       quizTaken[quizId] = [];
//     }
//     quizTaken[quizId][currentQuestionIndex] = {
//       questionId: fetchedQuizData.quiz[currentQuestionIndex].questionId,
//       optionId: optionId,
//     };
//     sessionStorage.setItem("quizTaken", JSON.stringify(quizTaken));
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < fetchedQuizData.quiz.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOption(null);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//       setSelectedOption(null);
//     }
//   };

//   const handleJumpToQuestion = (index) => {
//     setCurrentQuestionIndex(index);
//     setSelectedOption(null);
//   };

//   const currentQuestion = fetchedQuizData.quiz[currentQuestionIndex];

//   return (
//     <div className="quiz-container">
//       <div className="question-navigation">
//         {fetchedQuizData.quiz.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => handleJumpToQuestion(index)}
//             className={currentQuestionIndex === index ? "active" : ""}
//           >
//             {index + 1}
//           </button>
//         ))}
//       </div>

//       <div className="quiz-content">
//         <h2>{fetchedQuizData.quizName}</h2>
//         <div className="timer">
//           <h3>
//             Time Left : {Math.floor(timeLeft / 60)}:
//             {timeLeft % 60 < 10 ? "0" : ""}
//             {timeLeft % 60}
//           </h3>
//         </div>

//         <h2>{currentQuestion.questionText}</h2>
//         <div className="options">
//           {currentQuestion.options.map((option) => (
//             <label key={option.optionId}>
//               <input
//                 type="radio"
//                 value={option.optionId}
//                 checked={selectedOption === option.optionId}
//                 onChange={() => handleOptionChange(option.optionId)}
//               />
//               {option.optionText}
//             </label>
//           ))}
//         </div>
//         <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
//           Previous
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={currentQuestionIndex === fetchedQuizData.quiz.length - 1}
//         >
//           Next
//         </button>
//         <button onClick={submitQuiz}>Submit</button>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;

// -------------------------------------------------------------------------
