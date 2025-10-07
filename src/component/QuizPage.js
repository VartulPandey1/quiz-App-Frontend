import React from 'react';

function QuizPage({ quiz, onSubmit }) {
  const [answers, setAnswers] = React.useState({});
  console.log(quiz);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  if (!quiz) return <div>Select a quiz</div>;

  const question = quiz; // your single question object

  return (
    <div>
      <h2>{quiz.questionText || quiz.name}</h2>
      <h3>{question.questionText}</h3>

      {/* MCQ */}
      {question.type && question.type[0]?.toLowerCase() === 'mcq' && (
        <div>
          {(question.options || []).map((opt, idx) => (
            <label key={idx} style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name={`q_${question._id}`} // use _id to group radios
                value={opt}
                checked={answers[question._id] === opt}
                onChange={() => handleChange(question._id, opt)}
              />
              {opt} {/* visible option text */}
            </label>
          ))}
        </div>
      )}

      {/* True/False */}
      {question.type && question.type[0]?.toLowerCase() === 'true/false' && (
        <div>
          {['true', 'false'].map(val => (
            <label key={val} style={{ display: 'block', margin: '5px 0' }}>
              <input
                type="radio"
                name={`q_${question._id}`}
                value={val}
                checked={answers[question._id] === val}
                onChange={() => handleChange(question._id, val)}
              />
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </label>
          ))}
        </div>
      )}

      {/* Short Answer */}
      {question.type && question.type[0]?.toLowerCase() === 'short answer' && (
        <input
          type="text"
          value={answers[question._id] || ''}
          onChange={e => handleChange(question._id, e.target.value)}
          style={{ display: 'block', marginTop: '5px' }}
        />
      )}

      <button
        onClick={() => {
          let score = 0;
          let total = 0;

          if (question.answer !== undefined) {
            total = 1;
            const user = answers[question._id];
            const correct = question.answer;

            if (question.type[0]?.toLowerCase() === 'short answer') {
              if ((user || '').toString().trim().toLowerCase() ===
                  (correct || '').toString().trim().toLowerCase())
                score = 1;
            } else {
              if (Array.isArray(correct) ? correct.includes(user) : user === correct)
                score = 1;
            }
          }

          onSubmit && onSubmit({ score, total, answers });
        }}
        style={{ marginTop: '20px', padding: '10px 20px' }}
      >
        Submit
      </button>
    </div>
  );
}

export default QuizPage;
