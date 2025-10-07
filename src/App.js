import './App.css';
import QuizList from './component/QuizList';
import QuizPage from './component/QuizPage';
import ResultPage from './component/ResultPage';
import { useState } from 'react';

function App() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [result, setResult] = useState(null);
  return (
    <div className="App">
      <h1>Quiz App</h1>
      {!selectedQuiz && !result && <QuizList onSelect={setSelectedQuiz} />}
      {selectedQuiz && !result && (
        <QuizPage quiz={selectedQuiz} onSubmit={setResult} />
      )}
      {result && <ResultPage result={result} reset={() => { setSelectedQuiz(null); setResult(null); }} />}
    </div>
  );
}

export default App;
