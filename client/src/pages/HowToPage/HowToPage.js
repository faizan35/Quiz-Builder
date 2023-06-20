import React from 'react';
import './HowToPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faPencilAlt, faClock, faFileExcel, faTachometerAlt, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const HowToPage = () => {
    return (
        <div className="how-to-page">
            <h2>How to Use QuikQuiz</h2>

            <div className="step">
                <FontAwesomeIcon icon={faSignInAlt} className="icon" />
                <h3>Step 1: Visit and Login</h3>
                <p>Visit our QuikQuiz website. To create a quiz, you need to first log in for authentication.</p>
            </div>

            <div className="step">
                <FontAwesomeIcon icon={faPencilAlt} className="icon" />
                <h3>Step 2: Create or Try a Demo Quiz</h3>
                <p>If you're new, you can try our Demo Quiz. To create your own quiz, navigate to the dashboard after logging in.</p>
            </div>

            <div className="step">
                <FontAwesomeIcon icon={faClock} className="icon" />
                <h3>Step 3: Customize Your Quiz</h3>
                <p>Set the time duration, marks for each question, and choose from various options like real-time quiz start.</p>
            </div>

            <div className="step">
                <FontAwesomeIcon icon={faFileExcel} className="icon" />
                <h3>Step 4: Get Responses</h3>
                <p>After the quiz completion, view all participant responses. You can download these responses as an Excel file.</p>
            </div>

            <div className="step">
                <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                <h3>Step 5: Dashboard Features</h3>
                <p>Participants can view their past quizzes, answers, and more from their dashboard after logging in.</p>
            </div>

            <div className="step">
                <FontAwesomeIcon icon={faQuestionCircle} className="icon" />
                <h3>Step 6: Join Using Quiz ID</h3>
                <p>If you're not the creator but want to participate, simply log in and join using the provided Quiz ID.</p>
            </div>
        </div>
    );
}

export default HowToPage;
