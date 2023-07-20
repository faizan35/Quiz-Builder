# MERN Quiz Web App

This is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for creating and taking quizzes.

![homepage](client\src\assets\images\homepage.png)

## Table of Contents

- [MERN Quiz Web App](#mern-quiz-web-app)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Folder Structure](#folder-structure)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Environment Variables](#environment-variables)
  - [Take a Demo](#take-a-demo)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This web application allows users to register, create quizzes, and take quizzes. It includes user authentication, CRUD operations for quizzes, and result tracking.

## Features

- User Registration and Authentication
- Quiz Creation, Editing, and Deletion
- User Dashboard with Quiz Results
- Report Card for Detailed Results
- Deployment to GitHub Pages

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   cd Quiz-Builder
   npm install
   ```

## Usage

1. Start the server & client together:

   ```bash
   npm run start:both
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000).

## Folder Structure

The project is structured into server and client folders. The server handles backend logic, and the client contains the React frontend.

## Backend

- **Routes:** Located in `server/routes`, these files define the API routes.
- **Controllers:** Located in `server/controllers`, these files handle the logic for each route.
- **Models:** Located in `server/models`, these files define Mongoose schemas.

## Frontend

- **Components:** Located in `client/src/components`, these files define React components.
- **Redux:** State management using Redux is implemented in `client/src/redux`.

## Environment Variables

- Create a `.env` file in the `server` directory with the following content:

```env
MONGO_URI=mongodb://127.0.0.1:27017/QuizApp
JWT_SECRET=<your-secret-key>
```

## Take a Demo

To create `Take a Demo` page to work you have to add Demo data to the database from `demoQuiz-Schema.json` located at `client\src\assets\demo Quiz+users\demoQuiz-Schema.json`.

## Contributing

Feel free to contribute to this project. Create an issue or submit a pull request.

## License

This project is licensed under the [ISC License](LICENSE).
