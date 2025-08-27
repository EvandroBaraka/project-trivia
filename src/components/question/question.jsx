import "./question.css"

const Question = ({question, incorrect_answers, correct_answer, register, index}) => {
    const decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const decodedQuestion = decodeHtml(question);
    const decodedAnswers = [...incorrect_answers, correct_answer].map(answer => decodeHtml(answer));


    return (
        <div className="trivia-question">
            <p className="question-text">{`${index + 1} - ${decodedQuestion}`}</p>
            <div className="options">
                {decodedAnswers
                    .sort(() => Math.random() - 0.5)
                    .map((answer, answerIndex) => (
                        <label key={answerIndex} className="option-label">
                            <input 
                                type="radio" 
                                value={answer} 
                                {...register(`question_${index}`, { required: 'Selecione uma resposta' })} 
                            />
                            {answer}
                        </label>
                    ))}
            </div>
        </div>
    )
}

export default Question
