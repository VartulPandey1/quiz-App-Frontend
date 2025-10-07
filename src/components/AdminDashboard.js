// File: src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getQuizzes, createQuiz, deleteQuiz } from "../api";

export default function AdminDashboard({ user, setUser }) {
  const [quizzes, setQuizzes] = useState([]);
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([]);

  // Fetch all quizzes
  const fetchQuizzes = async () => {
    const data = await getQuizzes();
    setQuizzes(Array.isArray(data) ? data : [data]);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Add new question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { questionText: "", type: "MCQ", options: ["", ""], answer: [""] },
    ]);
  };

  // Update question field
  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  // Update option
  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.map((opt, j) => (j === optionIndex ? value : opt)) }
          : q
      )
    );
  };

  // Add option to a question
  const addOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === questionIndex ? { ...q, options: [...q.options, ""] } : q))
    );
  };

  // Remove option
  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === questionIndex
          ? { ...q, options: q.options.filter((_, j) => j !== optionIndex) }
          : q
      )
    );
  };

  // Delete a question
  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // Add quiz
  const handleAddQuiz = async () => {
    if (!quizName) return alert("Enter quiz name");

    // Make sure answer is an array
    const quizData = {
  name: quizName,
  questions: questions.map((q) => ({
    questionText: q.questionText,
    type: Array.isArray(q.type) ? q.type : [q.type],
    options: q.options || [],
    answer: Array.isArray(q.answer) ? q.answer : [q.answer],
  })),
};

    const savedQuiz = await createQuiz(quizData);
    setQuizName("");
    setQuestions([]);
    fetchQuizzes();
  };

  // Delete quiz
  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm("Delete this quiz?")) {
      await deleteQuiz(quizId);
      fetchQuizzes();
    }
  };

  // Logout
  const handleLogout = () => {
    return
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>
          <a href="/">Logout</a>
        </button>
      </div>

      <h3>Create New Quiz</h3>
      <input
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
        style={{ marginBottom: "10px", display: "block" }}
      />

      <button onClick={addQuestion} style={{ marginBottom: "10px" }}>
        Add Question
      </button>

      {questions.map((q, questionIndex) => (
        <div key={questionIndex} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <input
            placeholder="Question Text"
            value={q.questionText}
            onChange={(e) => updateQuestion(questionIndex, "questionText", e.target.value)}
            style={{ display: "block", marginBottom: "5px" }}
          />

          <select
            value={q.type}
            onChange={(e) => updateQuestion(questionIndex, "type", e.target.value)}
            style={{ display: "block", marginBottom: "5px" }}
          >
            <option value="MCQ">MCQ</option>
            <option value="True/False">True/False</option>
            <option value="Short Answer">Short Answer</option>
          </select>

          {(q.type === "MCQ" || q.type === "True/False") &&
            q.options.map((opt, optIndex) => (
              <div key={optIndex} style={{ display: "flex", marginBottom: "3px" }}>
                <input
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(questionIndex, optIndex, e.target.value)}
                  style={{ marginRight: "5px", flex: 1 }}
                />
                <button onClick={() => removeOption(questionIndex, optIndex)}>X</button>
              </div>
            ))}

          {(q.type === "MCQ" || q.type === "True/False") && (
            <button onClick={() => addOption(questionIndex)}>Add Option</button>
          )}

          <input
            placeholder="Correct Answer"
            value={q.answer[0]}
            onChange={(e) => updateQuestion(questionIndex, "answer", [e.target.value])}
            style={{ display: "block", marginTop: "5px" }}
          />

          <button onClick={() => removeQuestion(questionIndex)} style={{ marginTop: "5px" }}>
            Remove Question
          </button>
        </div>
      ))}

      <button onClick={handleAddQuiz} style={{ padding: "5px 10px", marginTop: "10px" }}>
        Add Quiz
      </button>

      <h3>All Quizzes</h3>
      {quizzes.map((quiz) => (
        <div key={quiz._id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
          <h4>{quiz.questionText}</h4>
          {quiz.questions.map((q) => (
            <p key={q._id}>{q.questionText}</p>
          ))}
          <button onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
