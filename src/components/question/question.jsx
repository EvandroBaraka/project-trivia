import styled from "styled-components";

const Question = ({question, incorrect_answers, correct_answer, selectedAnswer, showResult, register, index}) => {
    const decodeHtml = (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    const decodedQuestion = decodeHtml(question);
    const decodedAnswers = [...incorrect_answers, correct_answer].map(answer => decodeHtml(answer));

    return (
        <StyledQuestion className={showResult ? (selectedAnswer ? "correct" : "incorrect") : ""}>
            <p className="question-text">{`${index + 1} - ${decodedQuestion}`}</p>
            <OptionsContainer>
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
            </OptionsContainer>
        </StyledQuestion>
    )
}

const StyledQuestion = styled.div`
    padding: 5px 15px 15px;
    border: 1px solid white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 10px 0;

    &.correct {
        border-color: #4CAF50;
    }

    &.incorrect {
        border-color: #F44336;
    }
`;

const OptionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

export default Question