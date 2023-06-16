import React, { useState, useEffect } from "react";
import axios from "axios";
import { utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

function DashboardPage() {
  const [takenQuizzes, setTakenQuizzes] = useState([]);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isTakenQuizSelected, setIsTakenQuizSelected] = useState(false);
  const [obtainedMarks, setObtainedMarks] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const navigate = useNavigate();

  const handleResultsButtonClick = async () => {
    // If we're currently showing the quiz, fetch results
    if (!showResults && selectedQuiz) {
      try {
        const storedUser = localStorage.getItem("user");
        const { username: localUsername } = JSON.parse(storedUser);

        // console.log(localUsername);
        // console.log(selectedQuiz.quizId);

        const response = await axios.post(
          "http://localhost:5000/api/result/all",
          {
            username: localUsername,
            quizId: selectedQuiz.quizId,
          }
        );

        // console.log("response", response.data);

        setQuizResults(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz results:", error);
        // Handle error (e.g., show an error message to the user)
      }
    }

    // Toggle between showing quiz and results
    setShowResults((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const { username: localUsername } = JSON.parse(storedUser);

        const responseUser = await axios.post(
          "http://localhost:5000/api/users/current/username",
          {
            username: localUsername,
          }
        );

        setUsername(responseUser.data.name);

        const takenQuizIds = responseUser.data.quizTaken
          .map((q) => q.quizzes.map((qz) => qz.quizId))
          .flat();
        const createdQuizIds = responseUser.data.quizCreated;

        const fetchQuizNameById = async (id) => {
          const response = await axios.get(
            `http://localhost:5000/api/quiz/${id}`
          );
          sessionStorage.setItem(
            response.data.quizName,
            JSON.stringify(response.data)
          );
          return response.data.quizName;
        };

        const takenQuizNames = await Promise.all(
          takenQuizIds.map((id) => fetchQuizNameById(id))
        );
        const createdQuizNames = await Promise.all(
          createdQuizIds.map((id) => fetchQuizNameById(id))
        );

        setTakenQuizzes(takenQuizNames);
        setCreatedQuizzes(createdQuizNames);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuizClick = async (e, quizName, isTakenQuiz) => {
    setShowResults(false);
    e.preventDefault();
    const quizData = JSON.parse(sessionStorage.getItem(quizName));
    setSelectedQuiz(quizData);
    setIsTakenQuizSelected(isTakenQuiz);

    if (isTakenQuiz) {
      try {
        const storedUser = localStorage.getItem("user");
        const { username: localUsername } = JSON.parse(storedUser);
        const response = await axios.post(
          "http://localhost:5000/api/users/fetchResultByUsername",
          {
            username: localUsername,
            quizId: selectedQuiz.quizId,
          }
        );

        const user = response.data;
        // console.log("response YO => ", user);
        // console.log("response YO => ", user.quizzes[0].questions);
        setUserAnswers(user.quizzes[0].questions || {});
        setObtainedMarks(user.result || "N/A");
      } catch (err) {
        console.error("Error fetching obtained marks:", err.message);
        setObtainedMarks("*Click Again*");
      }
    } else {
      setObtainedMarks(null);
    }
  };

  const renderQuestion = (question, index) => {
    const userAnswerOptionId = userAnswers[question.questionId];

    // Checking if the user attempted the question
    const isAnswered = userAnswerOptionId !== undefined;

    // Extract the corresponding optionText for the user's answer from the options array
    let userAnswerText = null;
    if (isAnswered) {
      const matchingOption = question.options.find(
        (opt) => opt.optionId === userAnswerOptionId
      );
      userAnswerText = matchingOption ? matchingOption.optionText : null;
    }

    // Checking if the user's answer is correct
    const isCorrect = userAnswerText === question.rightAnsStr;

    return (
      <div key={question.questionId} className="question-container">
        <h4>
          {index + 1}. {question.questionText}
        </h4>
        <ul>
          {question.options.map((option) => (
            <li
              key={option.optionId}
              style={
                isAnswered && option.optionId === userAnswerOptionId
                  ? isCorrect
                    ? { backgroundColor: "#28bf20" }
                    : { backgroundColor: "#d23131" }
                  : {}
              }
            >
              {option.optionText}
            </li>
          ))}
        </ul>
        <p>
          <strong>Correct Answer:</strong> {question.rightAnsStr}
        </p>
      </div>
    );
  };
  // first color is green
  const handleCreateQuiz = () => {
    navigate("/createquiz");
  };

  const handleEditQuiz = () => {
    console.log("selectedQuiz => ", selectedQuiz);
    navigate("/createquiz", { state: { quizData: selectedQuiz } });
  };

  const deleteQuiz = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const { username: localUsername } = JSON.parse(storedUser);

      console.log("delete quiz => ", selectedQuiz.quizId);
      const response = await axios.delete(
        `http://localhost:5000/api/quiz/delete`,
        {
          data: {
            username: localUsername,
            quizId: selectedQuiz.quizId,
          },
        }
      );

      if (response.status === 200) {
        alert("Quiz deleted successfully!");
        // Update the state to remove the deleted quiz from the list
        setCreatedQuizzes((prev) =>
          prev.filter((quizName) => quizName !== selectedQuiz.quizName)
        );
        setSelectedQuiz(null);
      } else {
        alert("There was an error deleting the quiz.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDownloadClick = () => {
    const ws = utils.json_to_sheet(quizResults);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Quiz Results");

    writeFile(wb, "quiz_results.xlsx");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-sidebar">
          <h2>Welcome, {username}!</h2>
          <h2>Your Quizzes</h2>
          <div className="taken-quiz">
            <h3>Taken Quizzes</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              takenQuizzes.map((quizName, index) => (
                <div key={index}>
                  <a
                    href="#!"
                    onClick={(e) => handleQuizClick(e, quizName, true)}
                  >
                    {quizName}
                  </a>
                </div>
              ))
            )}
          </div>
          <div className="created-quiz">
            <h3>Created Quizzes</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error: {error}</p>
            ) : (
              createdQuizzes.map((quizName, index) => (
                <div key={index}>
                  <a
                    href="#!"
                    onClick={(e) => handleQuizClick(e, quizName, false)}
                  >
                    {quizName}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="quiz-info">
          {selectedQuiz && (
            <>
              <h4>
                Quiz Name & ID : {selectedQuiz.quizName} &{" "}
                <em>{selectedQuiz.quizId}</em>
              </h4>
              {isTakenQuizSelected && <h4>Obtained Marks : {obtainedMarks}</h4>}
              {!isTakenQuizSelected && (
                <h4>Total Time : {selectedQuiz.timeOfQuiz} minutes</h4>
              )}
              {!isTakenQuizSelected && (
                <h4>
                  Laste Updated :{" "}
                  {new Date(selectedQuiz.updatedAt).toLocaleString()}
                </h4>
              )}
            </>
          )}
          <button onClick={handleCreateQuiz}>Create New Quiz</button>
          <button
            style={
              isTakenQuizSelected ? { opacity: 0.5, pointerEvents: "none" } : {}
            }
            onClick={handleEditQuiz}
          >
            Edit Quiz
          </button>
          <button
            style={
              isTakenQuizSelected ? { opacity: 0.5, pointerEvents: "none" } : {}
            }
            onClick={!isTakenQuizSelected ? deleteQuiz : undefined}
          >
            Delete Quiz
          </button>
        </div>

        <div className="quiz-display">
          {/* "Go to Results" button, visible only if a created quiz is selected */}
          {!isTakenQuizSelected && selectedQuiz && (
            <button onClick={handleResultsButtonClick}>
              {showResults ? "Show Quiz" : "Go to Results"}
            </button>
          )}
          {showResults && (
            <button onClick={handleDownloadClick}>Download Quiz</button>
          )}

          {showResults ? (
            // This block will render the results
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {quizResults?.map((result, index) => (
                  <tr key={index}>
                    <td>{result.name}</td>
                    <td>{result.email}</td>
                    <td>{result.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // This block will render the quiz
            selectedQuiz &&
            selectedQuiz.quiz.map((question, index) =>
              renderQuestion(question, index)
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
