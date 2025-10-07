const BASE_URL = process.env.REACT_APP_API_BASE;

// Auth APIs
export const loginUser = async (username) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return res.json();
};

export const signupUser = async (username, role) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, role }),
  });
  return res.json();
};

// Quiz APIs
export const getQuizzes = async () => {
  const res = await fetch(`${BASE_URL}/quiz`);
  return res.json();
};

// Create quiz
export const createQuiz = async (quizData) => {
  const res = await fetch(`${BASE_URL}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  return res.json();
};

// Update quiz
export const updateQuiz = async (quizId, quizData) => {
  const res = await fetch(`${BASE_URL}/quiz/${quizId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quizData),
  });
  return res.json();
};

// Delete quiz
export const deleteQuiz = async (quizId) => {
  const res = await fetch(`${BASE_URL}/quiz/${quizId}`, {
    method: "DELETE",
  });
  return res.json();
};

// Submit quiz
export const submitQuiz = async (username, quizId, answers) => {
  const res = await fetch(`${BASE_URL}/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, quizId, answers }),
  });
  return res.json();
};
