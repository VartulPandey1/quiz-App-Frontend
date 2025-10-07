import React, { useEffect, useState } from "react";
import { getQuizzes, submitQuiz } from "../api";

export default function UserDashboard({ user, onLogout }) {
  const [quizzes, setQuizzes] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getQuizzes();
      setQuizzes(Array.isArray(data) ? data : [data]);
    };
    fetchQuizzes();
  }, []);

  if (quizzes.length === 0) return <div>Loading quizzes...</div>;

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const isCorrectAnswer = (userAnswer, correctAnswer, type) => {
    if (!userAnswer && userAnswer !== false) return false;
    if (type[0].toLowerCase() === "true/false") {
      const selected = userAnswer === "true";
      const correct = Array.isArray(correctAnswer) ? correctAnswer[0] === "true" : Boolean(correctAnswer);
      return selected === correct;
    } else {
      const correctVal = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
      return String(userAnswer).toLowerCase() === String(correctVal).toLowerCase();
    }
  };

  const handleSubmit = (quiz) => {
    let sc = 0;

    // Single question quiz (top-level questionText)
    if (quiz.questionText) {
      const userAnswer = answers[quiz._id];
      if (isCorrectAnswer(userAnswer, quiz.answer, quiz.type)) sc += 1;
    }

    // Multi-question quiz
    if (quiz.questions && quiz.questions.length > 0) {
      quiz.questions.forEach((q) => {
        const userAnswer = answers[q._id];
        if (q.answer) {
          if (isCorrectAnswer(userAnswer, q.answer, q.type)) sc += 1;
        }
      });
    }

    setScore((prev) => prev + sc);

    // Optional: send to backend
    // submitQuiz(user.username, quiz._id, answers);
  };

  const handleLogout = () => {
    setAnswers({});
    setScore(0);
    if (onLogout) onLogout();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>User Dashboard</h2>
        <button onClick={handleLogout} style={{ padding: "5px 10px" }}>
          <a href="/">Logout</a>
        </button>
      </div>

      <h3>Total Score: {score}</h3>

      {quizzes.map((quiz) => {
        // Determine questions to display: top-level single question or questions array
        const quizQuestions = quiz.questions && quiz.questions.length > 0
          ? quiz.questions
          : quiz.questionText
          ? [{ ...quiz, _id: quiz._id }] // wrap single question
          : [];

        return (
          <div key={quiz._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{quiz.name || quizQuestions[0]?.questionText}</h3>

            {quizQuestions.map((q) => (
              <div key={q._id} style={{ marginBottom: "10px" }}>
                <p>{q.questionText}</p>

                {(q.type[0].toLowerCase() === "mcq" || q.type[0].toLowerCase() === "true/false") &&
                  (q.options || ["True", "False"]).map((opt, idx) => (
                    <label key={idx} style={{ display: "block", margin: "3px 0" }}>
                      <input
                        type="radio"
                        name={q._id}
                        value={opt.toLowerCase()}
                        checked={answers[q._id] === opt.toLowerCase()}
                        onChange={() => handleChange(q._id, opt.toLowerCase())}
                      />
                      {opt}
                    </label>
                  ))}

                {q.type[0].toLowerCase() === "short answer" && (
                  <input
                    type="text"
                    value={answers[q._id] || ""}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    style={{ display: "block", marginTop: "5px" }}
                  />
                )}
              </div>
            ))}

            <button onClick={() => handleSubmit(quiz)} style={{ padding: "5px 10px", marginTop: "10px" }}>
              Submit Quiz
            </button>
          </div>
        );
      })}
    </div>
  );
}
