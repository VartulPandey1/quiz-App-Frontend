import axios from 'axios'
import React, { useEffect, useState } from 'react'

// Reverted clean QuizList: expects quizzes from server with fields:
// _id, title (or name), questions: [{ _id, questionText, type, options: [{ _id, text }], answer }]
export default function QuizList({ onSelect }) {
    const [quizzes, setQuizzes] = useState([])

    useEffect(() => {
        let mounted = true
        axios.get('http://localhost:3000/quiz')
            .then(response => {
                if (!mounted) return
                const data = (response.data || []).map(q => ({
                    ...q,
                    // prefer _id/title from server
                    id: q._id || q.id,
                    title: q.title || q.name || `Quiz ${q._id || q.id}`
                }))
                setQuizzes(data)
            })
            .catch(err => {
                console.error('Failed to fetch quizzes', err)
            })

        return () => { mounted = false }
    }, [])

    async function handleClick(quizId) {
        if (!quizId) return
        try {
            const res = await axios.get(`http://localhost:3000/quiz/${quizId}`)
            const quizData = res.data || {}
            // ensure server shape is returned directly; downstream expects _id/questionText/type/options/answer
            onSelect && onSelect(quizData)
        } catch (err) {
            console.error('Failed to fetch quiz details', err)
        }
    }

    return (
        <div>
            <h2>Available Quizzes</h2>
            <ul>
                {quizzes.map(quiz => (
                    <li key={quiz.id}>
                        <h3>{quiz.questionText}</h3>
                        <button onClick={() => handleClick(quiz.id)}>Start Quiz</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
