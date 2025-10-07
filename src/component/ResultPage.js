import React from 'react'

function ResultPage({ result, reset }) {
  return (<>
    <div>ResultPage</div>
    <p>Score {result.score}/{result.total}</p>
    <button onClick={reset}>Back</button>
    </>
  )
}

export default ResultPage