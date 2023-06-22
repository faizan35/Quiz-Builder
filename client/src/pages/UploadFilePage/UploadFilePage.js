import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadFilePage.css";

const UploadFilePage = () => {
  const [fileContent, setFileContent] = useState("");
  const [numOfQuestions, setNumOfQuestions] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [gptOutputs, setGptOutputs] = useState([]);
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFileContent(e.target.result);
      reader.onerror = (error) =>
        console.error("Error reading the file:", error);
      reader.readAsText(file);
    } else {
      console.error("No file selected");
    }
  };

  const generatePrompt = () => {
    let generatedPrompts = [];
    for (let i = 0; i < numOfQuestions; i += 5) {
      let startFrom = i + 1;
      let tillHere = Math.min(i + 5, numOfQuestions);
      const promptContent = `This is my mcq quiz questions, options and their correct answer 
    ===>> ${fileContent} ====>> Generate JSON format of this quiz, example of JSON format
    ====>> [ {
          "questionId": "1001",
          "questionText": "Question 1",
          "options": [
              {
                  "optionId": "1001A",
                  "optionText": "option 1"
              },
              {
                  "optionId": "1001B",
                  "optionText": "option 2"
              },
              {
                  "optionId": "1001C",
                  "optionText": "Option 3"
              },
              {
                  "optionId": "1001D",
                  "optionText": "Option 4"
              }
          ],
          "rightAns": "1",
          "rightAnsStr": "option 1"
      },
      {
          "questionId": "1002",
          "questionText": "Question 2",
          "options": [
              {
                  "optionId": "1002A",
                  "optionText": "Option 1"
              },
              {
                  "optionId": "1002B",
                  "optionText": "Option 2"
              },
              {
                  "optionId": "1002C",
                  "optionText": "Option 3"
              },
              {
                  "optionId": "1002D",
                  "optionText": "Option 4"
              }
          ],
          "rightAns": "2",
          "rightAnsStr": "Option 2"
      } ] ===>> startFrom=${startFrom} and tillHere=${tillHere} 
      ===>> do not change the format and do not leave anything.`;

      generatedPrompts.push(promptContent);
    }
    setPrompts(generatedPrompts);
  };

  const copyToClipboard = (promptData) => {
    navigator.clipboard.writeText(promptData);
  };

  const handleGptOutputChange = (index, value) => {
    let outputs = [...gptOutputs];
    outputs[index] = value;
    setGptOutputs(outputs);
  };

  const finalizeQuizCreation = () => {
    for (let output of gptOutputs) {
      try {
        let parsedData = JSON.parse(output);
        if (
          !Array.isArray(parsedData) ||
          !parsedData.every(
            (item) =>
              item.hasOwnProperty("questionId") &&
              item.hasOwnProperty("options") &&
              item.hasOwnProperty("rightAns")
          )
        ) {
          console.error("Invalid format in GPT output");
          return;
        }
      } catch (err) {
        console.error("Failed to parse GPT output:", err);
        return;
      }
    }
    let combinedOutput = [].concat(
      ...gptOutputs.map((output) => JSON.parse(output))
    );
    navigate("/quiz-add-edit", {
      state: { quizData: { quiz: combinedOutput } },
    });
  };

  return (
    <div className="upload-container">
      <h3>Upload your Quiz TXT file</h3>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <input
        type="number"
        value={numOfQuestions}
        onChange={(e) => setNumOfQuestions(e.target.value)}
        placeholder="Total number of questions"
      />
      <button onClick={generatePrompt}>Generate Prompt</button>
      <button onClick={() => window.open("https://chat.openai.com", "_blank")}>
        chatGPT
      </button>
      <button onClick={() => window.open("https://bard.google.com", "_blank")}>
        Bard
      </button>
      {prompts.map((prompt, index) => (
        <div key={index} className="prompt-container">
          <button onClick={() => copyToClipboard(prompt)}>
            Copy Prompt {index + 1}
          </button>
          <textarea
            onChange={(e) => handleGptOutputChange(index, e.target.value)}
            value={gptOutputs[index] || ""}
            placeholder="Paste Quiz here..."
          ></textarea>
        </div>
      ))}
      <button onClick={finalizeQuizCreation}>Done</button>
    </div>
  );
};

export default UploadFilePage;

// -------------------------------------------------------------------------

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./UploadFilePage.css";

// const UploadFilePage = () => {
//   const [fileContent, setFileContent] = useState("");
//   const [numOfQuestions, setNumOfQuestions] = useState(null);
//   const [prompts, setPrompts] = useState([]);
//   const [gptOutputs, setGptOutputs] = useState([]);
//   const navigate = useNavigate();

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => setFileContent(e.target.result);
//       reader.onerror = (error) =>
//         console.error("Error reading the file:", error);
//       reader.readAsText(file);
//     } else {
//       console.error("No file selected");
//     }
//   };

//   const generatePrompt = () => {
//     let generatedPrompts = [];
//     for (let i = 0; i < numOfQuestions; i += 5) {
//       let startFrom = i + 1;
//       let tillHere = Math.min(i + 5, numOfQuestions);
//       const promptContent = `This is my mcq quiz questions, options and their correct answer
//     ===>> ${fileContent} ====>> Generate JSON format of this quiz, example of JSON format
//     ====>> [ {
//           "questionId": "1001",
//           "questionText": "Question 1",
//           "options": [
//               {
//                   "optionId": "1001A",
//                   "optionText": "option 1"
//               },
//               {
//                   "optionId": "1001B",
//                   "optionText": "option 2"
//               },
//               {
//                   "optionId": "1001C",
//                   "optionText": "Option 3"
//               },
//               {
//                   "optionId": "1001D",
//                   "optionText": "Option 4"
//               }
//           ],
//           "rightAns": "1",
//           "rightAnsStr": "option 1"
//       },
//       {
//           "questionId": "1002",
//           "questionText": "Question 2",
//           "options": [
//               {
//                   "optionId": "1002A",
//                   "optionText": "Option 1"
//               },
//               {
//                   "optionId": "1002B",
//                   "optionText": "Option 2"
//               },
//               {
//                   "optionId": "1002C",
//                   "optionText": "Option 3"
//               },
//               {
//                   "optionId": "1002D",
//                   "optionText": "Option 4"
//               }
//           ],
//           "rightAns": "2",
//           "rightAnsStr": "Option 2"
//       } ] ===>> startFrom=${startFrom} and tillHere=${tillHere}
//       ===>> do not change the format and do not leave anything.`;

//       generatedPrompts.push(promptContent);
//     }
//     setPrompts(generatedPrompts);
//   };

//   const copyToClipboard = (promptData) => {
//     navigator.clipboard.writeText(promptData);
//   };

//   const handleGptOutputChange = (index, value) => {
//     let outputs = [...gptOutputs];
//     outputs[index] = value;
//     setGptOutputs(outputs);
//   };

//   const finalizeQuizCreation = () => {
//     for (let output of gptOutputs) {
//       try {
//         let parsedData = JSON.parse(output);
//         if (
//           !Array.isArray(parsedData) ||
//           !parsedData.every(
//             (item) =>
//               item.hasOwnProperty("questionId") &&
//               item.hasOwnProperty("options") &&
//               item.hasOwnProperty("rightAns")
//           )
//         ) {
//           console.error("Invalid format in GPT output");
//           return;
//         }
//       } catch (err) {
//         console.error("Failed to parse GPT output:", err);
//         return;
//       }
//     }
//     let combinedOutput = [].concat(
//       ...gptOutputs.map((output) => JSON.parse(output))
//     );
//     navigate("/quiz-add-edit", {
//       state: { quizData: { quiz: combinedOutput } },
//     });
//   };

//   return (
//     <div className="upload-container">
//       <h3>Upload your Quiz TXT file</h3>
//       <input type="file" accept=".txt" onChange={handleFileUpload} />
//       <input
//         type="number"
//         value={numOfQuestions}
//         onChange={(e) => setNumOfQuestions(e.target.value)}
//         placeholder="Total number of questions"
//       />
//       <button onClick={generatePrompt}>Generate Prompt</button>
//       <button onClick={() => window.open("https://chat.openai.com", "_blank")}>
//         chatGPT
//       </button>
//       <button onClick={() => window.open("https://bard.google.com", "_blank")}>
//         Bard
//       </button>
//       {prompts.map((prompt, index) => (
//         <div key={index}>
//           <button onClick={() => copyToClipboard(prompt)}>Copy Prompt</button>
//           <textarea
//             onChange={(e) => handleGptOutputChange(index, e.target.value)}
//             value={gptOutputs[index] || ""}
//           ></textarea>
//         </div>
//       ))}
//       <button onClick={finalizeQuizCreation}>Done</button>
//     </div>
//   );
// };

// export default UploadFilePage;

//----------------------------------------------------------------------------------

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const UploadFilePage = () => {
//   const [fileContent, setFileContent] = useState("");
//   const [step, setStep] = useState(1);
//   const [promptData, setPromptData] = useState("");
//   const [gptOutput, setGptOutput] = useState("");
//   const navigate = useNavigate();

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     console.log("Selected File:", file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         console.log("File read result:", e.target.result);
//         setFileContent(e.target.result);
//         setStep(3); // directly move to generate prompt step after file upload
//       };
//       reader.onerror = (error) => {
//         console.error("Error reading the file:", error);
//       };
//       reader.readAsText(file);
//     } else {
//       console.error("No file selected");
//     }
//   };

//   const generatePrompt = () => {
//     const promptContent = `This is my mcq quiz questions, options and their correct answer ===>> ${fileContent} ====>> Generate JSON format of this quiz, example of JSON format
//     ====>> [ {
//           "questionId": "1001",
//           "questionText": "Question 1",
//           "options": [
//               {
//                   "optionId": "1001A",
//                   "optionText": "option 1"
//               },
//               {
//                   "optionId": "1001B",
//                   "optionText": "option 2"
//               },
//               {
//                   "optionId": "1001C",
//                   "optionText": "Option 3"
//               },
//               {
//                   "optionId": "1001D",
//                   "optionText": "Option 4"
//               }
//           ],
//           "rightAns": "1",
//           "rightAnsStr": "option 1"
//       },
//       {
//           "questionId": "1002",
//           "questionText": "Question 2",
//           "options": [
//               {
//                   "optionId": "1002A",
//                   "optionText": "Option 1"
//               },
//               {
//                   "optionId": "1002B",
//                   "optionText": "Option 2"
//               },
//               {
//                   "optionId": "1002C",
//                   "optionText": "Option 3"
//               },
//               {
//                   "optionId": "1002D",
//                   "optionText": "Option 4"
//               }
//           ],
//           "rightAns": "2",
//           "rightAnsStr": "Option 2"
//       } ] ===>> do not change the format and do not leave anything.`;

//     setPromptData(promptContent);
//     console.log("Generated prompt = ", promptContent);
//     setStep(4);
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(promptData);
//     setStep(5);
//   };

//   const goToChatGPT = () => {
//     window.open("https://chat.openai.com", "_blank"); // '_blank' opens a new tab
//     setStep(6);
//   };

//   const handleGptOutputChange = (e) => {
//     setGptOutput(e.target.value);
//   };

//   const finalizeQuizCreation = () => {
//     // Assuming gptOutput is a valid JSON string.
//     // If you need further checks, you should add them.
//     try {
//       const parsedData = JSON.parse(gptOutput);

//       navigate("/quiz-add-edit", { state: { quizData: { quiz: parsedData } } });
//     } catch (err) {
//       console.error("Failed to parse GPT output:", err);
//     }
//   };

//   return (
//     <div>
//       {step === 1 && (
//         <div>
//           <p>Step 1 - Upload your Quiz file.</p>
//           <input type="file" accept=".txt" onChange={handleFileUpload} />
//         </div>
//       )}

//       {step === 3 && (
//         <div>
//           <p>Step 3 - Generate chatGPT Prompt</p>
//           <button onClick={generatePrompt}>Generate Prompt</button>
//         </div>
//       )}

//       {step === 4 && (
//         <div>
//           <p>Step 4 - Copy your prompt from here.</p>
//           <button onClick={copyToClipboard}>Copy Prompt</button>
//         </div>
//       )}

//       {step === 5 && (
//         <div>
//           <p>Step 5 - Go to chatGPT and paste your prompt</p>
//           <button onClick={goToChatGPT}>chatGPT</button>
//         </div>
//       )}

//       {step === 6 && (
//         <div>
//           <p>Step 6 - Paste the code that chatGPT gave you</p>
//           <textarea
//             onChange={handleGptOutputChange}
//             value={gptOutput}
//           ></textarea>
//           <button onClick={finalizeQuizCreation}>Done</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadFilePage;
