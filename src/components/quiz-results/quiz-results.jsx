const QuizResults = ({ trivia, result }) => {
    return (
        <div className="results">
            <p>
                Você acertou {result.correct} de {trivia.length} perguntas.
            </p>
        </div>
    )
}

export default QuizResults