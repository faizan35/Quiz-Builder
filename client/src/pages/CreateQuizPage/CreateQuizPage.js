import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import "./CreateQuizPage.css";

const CreateQuizPage = () => {
  const username = useSelector((state) => state.auth.user?.username || "");
  const location = useLocation();

  const initialQuizData = location.state?.quizData || {};

  // Store quizId in sessionStorage if it exists
  if (initialQuizData.quizId) {
    sessionStorage.setItem("currentQuizId", initialQuizData.quizId);
  }

  // Retrieve quizId from sessionStorage if initialQuizData.quizId is undefined
  const storedQuizId = sessionStorage.getItem("currentQuizId");
  const quizIdToUse = initialQuizData.quizId || storedQuizId;

  // console.log("Received from dashboard in CreateQuizPage => ", initialQuizData);

  const [quizName, setQuizName] = useState(
    initialQuizData.quizName || "**Not Set**"
  );
  const [marksPerQuestion, setMarksPerQuestion] = useState(
    initialQuizData.marksPerQuestion || 1
  );
  const [instructions, setInstructions] = useState(
    initialQuizData.instructions || [
      "**Best Of Luck**",
      "**Read Question's before Answering**",
    ]
  );
  const [timeOfQuiz, setTimeOfQuiz] = useState(
    initialQuizData.timeOfQuiz || 10
  );
  const [startTime, setStartTime] = useState(initialQuizData.startTime || "");
  const navigate = useNavigate();

  useEffect(() => {
    const storedQuizName = sessionStorage.getItem("quizName");
    const storedMarksPerQuestion = sessionStorage.getItem("marksPerQuestion");
    const storedInstructions = JSON.parse(
      sessionStorage.getItem("instructions")
    );
    const storedStartTime = sessionStorage.getItem("startTime");

    if (storedQuizName) setQuizName(storedQuizName);
    if (storedMarksPerQuestion) setMarksPerQuestion(storedMarksPerQuestion);
    if (storedInstructions) setInstructions(storedInstructions);
    if (storedStartTime) setStartTime(storedStartTime);
  }, []);

  const generateQuizId = () => {
    const letters = "a1bc2de3fg7hi54jkl0m7n6op3qr9st8uvwx9yz";
    let randomLetters = "";
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      randomLetters += letters.charAt(randomIndex);
    }
    return randomLetters;
  };

  const handleAddEditClick = () => {
    sessionStorage.setItem("quizName", quizName);
    sessionStorage.setItem("marksPerQuestion", marksPerQuestion);
    sessionStorage.setItem("instructions", JSON.stringify(instructions));
    sessionStorage.setItem("startTime", startTime);
    navigate("/quiz-add-edit", { state: { quizData: initialQuizData } });
  };

  const handleUploadFileClick = () => {
    sessionStorage.setItem("quizName", quizName);
    sessionStorage.setItem("marksPerQuestion", marksPerQuestion);
    sessionStorage.setItem("instructions", JSON.stringify(instructions));
    sessionStorage.setItem("startTime", startTime);
    navigate("/upload-file", { state: { quizData: initialQuizData } });
  };

  const handleSubmit = async () => {
    // First, navigate to "/quiz-add-edit"
    navigate("/quiz-add-edit");
    handleAddEditClick();

    // Wait for 1 second
    setTimeout(async () => {
      // Navigate back to "/createquiz"
      navigate(-1); // Navigates back to the previous route

      const storedQuestions = JSON.parse(
        sessionStorage.getItem("tempQuestions")
      );

      storedQuestions.forEach((question, index) => {
        question.questionId = (1001 + index).toString();
        question.options.forEach((option, oIndex) => {
          const optionLetter = String.fromCharCode(65 + oIndex);
          option.optionId = question.questionId + optionLetter;
        });
      });

      const generatedQuizId = quizIdToUse || generateQuizId();

      const quizData = {
        createdByUsername: username,
        quizId: generatedQuizId,
        quizName,
        timeOfQuiz,
        startTime,
        marksPerQuestion: Number(marksPerQuestion),
        instructions,
        quiz: storedQuestions,
      };

      const updatingQuizId = {
        username,
        quizId: generatedQuizId,
      };

      const addingResult = {
        createdByUsername: username,
        quizId: generatedQuizId,
      };

      if (quizIdToUse) {
        // Editing mode
        try {
          await axios.patch(`http://localhost:5000/api/quiz/edit`, quizData);

          sessionStorage.clear();

          alert("Quiz updated successfully!");
          navigate("/dashboard");
        } catch (error) {
          console.error("Failed to update the quiz", error);
          alert("Failed to update quiz. Please try again.");
        }
      } else {
        // Creation mode
        try {
          await axios.post("http://localhost:5000/api/quiz/create", quizData);
          await axios.patch(
            "http://localhost:5000/api/users/addQuizToUser",
            updatingQuizId
          );
          await axios.post(
            "http://localhost:5000/api/result/updateQuizId",
            addingResult
          );
          alert("Quiz created. Quiz ID = " + generatedQuizId);
          navigate("/");
        } catch (error) {
          console.error("Failed to create the quiz", error);
          alert("Failed to create quiz. Please try again.");
        }
      }

      setQuizName("");
      setMarksPerQuestion("");
      setInstructions(["", ""]);
      setTimeOfQuiz(10);
      setStartTime("");

      sessionStorage.removeItem("quizName");
      sessionStorage.removeItem("marksPerQuestion");
      sessionStorage.removeItem("instructions");
      sessionStorage.removeItem("tempQuestions");
      sessionStorage.removeItem("startTime");
      sessionStorage.removeItem("currentQuizId");
    }, 100); // 1000 milliseconds = 1 second
  };

  return (
    <div className="create-quiz-page">
      <div className="create-quiz-container">
        <div className="quiz-name-section">
          <label>Quiz Name:</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Enter the name of the quiz"
          />
        </div>
        <div className="questions-section">
          <h2>Add Questions & Answers</h2>
          <button onClick={handleAddEditClick}>Add / Edit</button>
          <button onClick={handleUploadFileClick}>Upload File</button>
          <p>
            Total no of questions Added:
            {JSON.parse(sessionStorage.getItem("tempQuestions"))?.length || 0}
          </p>
          <label>Each Question is of:</label>
          <input
            type="number"
            min="1"
            max="4"
            value={marksPerQuestion}
            onChange={(e) => setMarksPerQuestion(e.target.value)}
            placeholder="Marks per question"
          />
        </div>
        <div className="instructions-section">
          <h2>Instructions to be displayed to students</h2>
          {instructions.map((instruction, index) => (
            <input
              key={index}
              type="text"
              value={instruction}
              onChange={(e) => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                setInstructions(newInstructions);
              }}
              placeholder={`Instruction ${index + 1}`}
            />
          ))}
        </div>
        <div className="quiz-timing-section">
          <h2>Quiz Timing</h2>
          <label>Quiz duration (in minutes):</label>
          <input
            type="number"
            min="1"
            max="180"
            value={timeOfQuiz}
            onChange={(e) => setTimeOfQuiz(e.target.value)}
            placeholder="Duration of the quiz"
          />
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start time of the quiz"
          />
        </div>
        <button onClick={handleSubmit}>
          {initialQuizData && Object.keys(initialQuizData).length > 0
            ? "Update Quiz"
            : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
};

export default CreateQuizPage;

// -----------------------------------------------------

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import "./CreateQuizPage.css";

// const CreateQuizPage = () => {
//   const username = useSelector((state) => state.auth.user?.username || "");
//   const location = useLocation();
//   const initialQuizData = location.state?.quizData || {};

//   // Store quizId in sessionStorage if it exists
//   if (initialQuizData.quizId) {
//     sessionStorage.setItem("currentQuizId", initialQuizData.quizId);
//   }

//   // Retrieve quizId from sessionStorage if initialQuizData.quizId is undefined
//   const storedQuizId = sessionStorage.getItem("currentQuizId");
//   const quizIdToUse = initialQuizData.quizId || storedQuizId;

//   // console.log("Received from dashboard in CreateQuizPage => ", initialQuizData);

//   const [quizName, setQuizName] = useState(
//     initialQuizData.quizName || "**Not Set**"
//   );
//   const [marksPerQuestion, setMarksPerQuestion] = useState(
//     initialQuizData.marksPerQuestion || 1
//   );
//   const [instructions, setInstructions] = useState(
//     initialQuizData.instructions || [
//       "**Best Of Luck**",
//       "**Read Question's before Answering**",
//     ]
//   );
//   const [timeOfQuiz, setTimeOfQuiz] = useState(
//     initialQuizData.timeOfQuiz || 10
//   );
//   const [startTime, setStartTime] = useState(initialQuizData.startTime || "");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedQuizName = sessionStorage.getItem("quizName");
//     const storedMarksPerQuestion = sessionStorage.getItem("marksPerQuestion");
//     const storedInstructions = JSON.parse(
//       sessionStorage.getItem("instructions")
//     );
//     const storedStartTime = sessionStorage.getItem("startTime");

//     if (storedQuizName) setQuizName(storedQuizName);
//     if (storedMarksPerQuestion) setMarksPerQuestion(storedMarksPerQuestion);
//     if (storedInstructions) setInstructions(storedInstructions);
//     if (storedStartTime) setStartTime(storedStartTime);
//   }, []);

//   const generateQuizId = () => {
//     const letters = "a1bc2de3fg7hi54jkl0m7n6op3qr9st8uvwx9yz";
//     let randomLetters = "";
//     for (let i = 0; i < 5; i++) {
//       const randomIndex = Math.floor(Math.random() * letters.length);
//       randomLetters += letters.charAt(randomIndex);
//     }
//     return randomLetters;
//   };

//   const handleAddEditClick = () => {
//     sessionStorage.setItem("quizName", quizName);
//     sessionStorage.setItem("marksPerQuestion", marksPerQuestion);
//     sessionStorage.setItem("instructions", JSON.stringify(instructions));
//     sessionStorage.setItem("startTime", startTime);
//     navigate("/quiz-add-edit", { state: { quizData: initialQuizData } });
//   };

//   const handleUploadFileClick = () => {
//     sessionStorage.setItem("quizName", quizName);
//     sessionStorage.setItem("marksPerQuestion", marksPerQuestion);
//     sessionStorage.setItem("instructions", JSON.stringify(instructions));
//     sessionStorage.setItem("startTime", startTime);
//     navigate("/upload-file", { state: { quizData: initialQuizData } });
//   };

//   const handleSubmit = async () => {
//     const storedQuestions = JSON.parse(sessionStorage.getItem("tempQuestions"));

//     storedQuestions.forEach((question, index) => {
//       question.questionId = (1000 + index).toString();
//       question.options.forEach((option, oIndex) => {
//         const optionLetter = String.fromCharCode(65 + oIndex);
//         option.optionId = question.questionId + optionLetter;
//       });
//     });

//     const generatedQuizId = quizIdToUse || generateQuizId();

//     const quizData = {
//       createdByUsername: username,
//       quizId: generatedQuizId,
//       quizName,
//       timeOfQuiz,
//       startTime,
//       marksPerQuestion: Number(marksPerQuestion),
//       instructions,
//       quiz: storedQuestions,
//     };

//     const updatingQuizId = {
//       username,
//       quizId: generatedQuizId,
//     };

//     const addingResult = {
//       createdByUsername: username,
//       quizId: generatedQuizId,
//     };

//     if (quizIdToUse) {
//       // Editing mode
//       try {
//         await axios.patch(`/api/quiz/edit`, quizData);

//         sessionStorage.clear();

//         alert("Quiz updated successfully!");
//         navigate("/dashboard");
//       } catch (error) {
//         console.error("Failed to update the quiz", error);
//         alert("Failed to update quiz. Please try again.");
//       }
//     } else {
//       // Creation mode
//       try {
//         await axios.post("/api/quiz/create", quizData);
//         await axios.patch("/api/users/addQuizToUser", updatingQuizId);
//         await axios.post("/api/result/updateQuizId", addingResult);
//         alert("Quiz created. Quiz ID = " + generatedQuizId);
//         navigate("/");
//       } catch (error) {
//         console.error("Failed to create the quiz", error);
//         alert("Failed to create quiz. Please try again.");
//       }
//     }

//     setQuizName("");
//     setMarksPerQuestion("");
//     setInstructions(["", ""]);
//     setTimeOfQuiz(10);
//     setStartTime("");

//     sessionStorage.removeItem("quizName");
//     sessionStorage.removeItem("marksPerQuestion");
//     sessionStorage.removeItem("instructions");
//     sessionStorage.removeItem("tempQuestions");
//     sessionStorage.removeItem("startTime");
//     sessionStorage.removeItem("currentQuizId");
//   };

//   return (
//     <div className="create-quiz-page">
//       <div className="create-quiz-container">
//         <div className="quiz-name-section">
//           <label>Quiz Name:</label>
//           <input
//             type="text"
//             value={quizName}
//             onChange={(e) => setQuizName(e.target.value)}
//             placeholder="Enter the name of the quiz"
//           />
//         </div>
//         <div className="questions-section">
//           <h2>Add Questions & Answers</h2>
//           <button onClick={handleAddEditClick}>Add / Edit</button>
//           <button onClick={handleUploadFileClick}>Upload File</button>
//           <p>
//             Total no of questions Added:
//             {JSON.parse(sessionStorage.getItem("tempQuestions"))?.length || 0}
//           </p>
//           <label>Each Question is of:</label>
//           <input
//             type="number"
//             min="1"
//             max="4"
//             value={marksPerQuestion}
//             onChange={(e) => setMarksPerQuestion(e.target.value)}
//             placeholder="Marks per question"
//           />
//         </div>
//         <div className="instructions-section">
//           <h2>Instructions to be displayed to students</h2>
//           {instructions.map((instruction, index) => (
//             <input
//               key={index}
//               type="text"
//               value={instruction}
//               onChange={(e) => {
//                 const newInstructions = [...instructions];
//                 newInstructions[index] = e.target.value;
//                 setInstructions(newInstructions);
//               }}
//               placeholder={`Instruction ${index + 1}`}
//             />
//           ))}
//         </div>
//         <div className="quiz-timing-section">
//           <h2>Quiz Timing</h2>
//           <label>Quiz duration (in minutes):</label>
//           <input
//             type="number"
//             min="1"
//             max="180"
//             value={timeOfQuiz}
//             onChange={(e) => setTimeOfQuiz(e.target.value)}
//             placeholder="Duration of the quiz"
//           />
//           <label>Start Time:</label>
//           <input
//             type="datetime-local"
//             value={startTime}
//             onChange={(e) => setStartTime(e.target.value)}
//             placeholder="Start time of the quiz"
//           />
//         </div>
//         <button onClick={handleSubmit}>
//           {initialQuizData && Object.keys(initialQuizData).length > 0
//             ? "Update Quiz"
//             : "Submit Quiz"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateQuizPage;
