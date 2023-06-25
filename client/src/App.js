import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import HowToPage from "./pages/HowToPage/HowToPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import QuizPage from "./pages/QuizPage/QuizPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import CreateQuizPage from "./pages/CreateQuizPage/CreateQuizPage";
import AddEditQuestionPage from "./pages/AddEditQuestionPage/AddEditQuestionPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import UploadFilePage from "./pages/UploadFilePage/UploadFilePage";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (token && tokenExpiry) {
      const now = new Date();
      const expiry = new Date(tokenExpiry);

      if (now > expiry) {
        // Token has expired
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        // Dispatch a logout action if you have one
      } else {
        // Extend the token expiry time
        const newExpiryTime = new Date(
          now.getTime() + 24 * 60 * 60 * 1000
        ).toISOString();
        localStorage.setItem("tokenExpiry", newExpiryTime);
        // Dispatch a login action to update the Redux state if needed
      }
    }
  }, []);

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-to" element={<HowToPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/createquiz" element={<CreateQuizPage />} />
          <Route path="/quiz-add-edit" element={<AddEditQuestionPage />} />
          <Route path="/upload-file" element={<UploadFilePage />} />
          <Route path="/quizpage" element={<QuizPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
