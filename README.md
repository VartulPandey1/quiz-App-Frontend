# Quiz App (React frontend)

This React frontend is a simple Quiz application UI.

It expects a backend that exposes quiz metadata and quiz detail endpoints. This README documents how to run the frontend, the expected API contract (field names and types) used by the components, and quick troubleshooting steps specific to this implementation.

## Quick start

Requirements:
- Node.js (LTS) and npm
- A running backend exposing the quiz endpoints (defaults to http://localhost:3000)

Install and run the app:

```powershell
npm install
npm start
```

Open http://localhost:3000 in your browser to view the app.

## Where to look in the code
- `src/component/QuizList.js` — lists quizzes and starts a quiz (calls GET /quiz and GET /quiz/:id)
- `src/component/QuizPage.js` — renders a quiz, supports MCQ / true-false / short-answer and performs client-side grading
- `src/component/ResultPage.js` — displays score and reset button

## Backend API contract (expected shapes)

1) GET /quiz
- Response: array of quiz metadata. Example:

```json
[
  { "_id": "quiz1", "title": "JavaScript Basics" },
  { "_id": "quiz2", "title": "React Basics" }
]
```

2) GET /quiz/:id
- Response: a quiz object with this shape (fields used by the frontend):

```json
{
  "_id": "quiz1",
  "title": "JavaScript Basics",
  "questions": [
    {
      "_id": "q1",
      "questionText": "Which is a primitive?",
      "type": "MCQ", // the frontend handles either a string or an array like ["MCQ"]
      "options": [
        { "_id": "o1", "text": "Object" },
        { "_id": "o2", "text": "String" }
      ],
      "answer": "o2"
    }
  ]
}
```

Notes:
- The frontend uses `_id` for stable IDs and `questionText` for the question prompt.
- Options should be an array under `options` where each option has `_id` and `text`. The frontend also tolerates options that are plain strings or slightly different names (e.g., `choices`).
- `type` may be a string ("MCQ", "true/false", "short answer") or an array where the first element is the type; the frontend handles both.

## How grading works
- `QuizPage` performs client-side grading when you press Submit. It compares the user's answers (keyed by question `_id`) with the `answer` field on each question.
- Short-answer comparisons are case-insensitive and trimmed. MCQ and true/false compare string values.
- `QuizPage` calls its `onSubmit` callback with an object: `{ score, total, answers }`.

## Troubleshooting
- Blank quiz list or buttons:
  - Check GET /quiz response in the browser DevTools network tab.
  - Ensure the items contain `_id` and `title`.

- Quiz page shows questions but no options:
  - Check GET /quiz/:id response. Confirm `questions[].options` is present and non-empty. Options may be an array of objects with `_id` and `text`, or an array of strings.
  - If your backend uses different names (e.g., `choices` or `answers`), tell me and I will adapt the frontend to that exact shape.

- Console errors in the browser:
  - Copy and paste the error text here and I will help diagnose it.

## Next improvements (optional)
- Server-side grading: POST answers to an endpoint and let the backend return `{ score, total }`.
- Show per-question feedback (correct/incorrect) after submit.
- Add tests for rendering and grading logic.

If you want, paste a sample quiz JSON (the full response from GET /quiz/:id) and I will adapt the frontend to match it exactly.
