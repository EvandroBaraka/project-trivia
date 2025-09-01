import Question from "../question/question";

const QuizQuestions = ({ trivia, showResult, selectedAnswer, register }) => {
    return (
        <>
            {Array.isArray(trivia) &&
            trivia.length > 0 &&
            trivia.map((item, index) => (
                <Question
                    key={index}
                    question={item.question}
                    incorrect_answers={item.incorrect_answers}
                    correct_answer={item.correct_answer}
                    selectedAnswer={selectedAnswer[`question_${index}`]}
                    showResult={showResult}
                    register={register}
                    index={index}
                />
            ))}
         </>
    );
};

export default QuizQuestions;