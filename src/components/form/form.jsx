import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useCategories } from "../../hooks/useCategories";
import { useTrivia } from "../../hooks/useTrivia";
import QuizInitialForm from "../quiz-initial-form/quiz-initial-form";
import QuizQuestions from "../quiz-questions/quiz-questions";
import QuizResults from "../quiz-results/quiz-results";

const decodeHtml = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

const Form = () => {
    const { register, handleSubmit, reset } = useForm();
    const [quizParams, setQuizParams] = useState(null);
    const [trivia, setTrivia] = useState([]);
    const {
        data: categories,
        isLoading: isCategoriesLoading,
        error: categoriesError,
    } = useCategories();
    const [showQuestions, setShowQuestions] = useState(false);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState({
        correct: 0,
        show: false,
    });

    const {
        data: triviaData,
        isLoading: isTriviaLoading,
        error: triviaError,
    } = useTrivia(
        quizParams?.amount,
        quizParams?.dificuldade,
        quizParams?.categoria,
        quizParams?.gameId,
        !!quizParams,
    );

    // EFEITO PARA PROCESSAR OS DADOS (Embaralhar e Decodificar)
    // Roda automaticamente quando 'triviaData' chega da API
    useEffect(() => {
        if (triviaData && triviaData.results) {
            const shuffledTrivia = triviaData.results.map((item) => {
                const allAnswers = [
                    ...item.incorrect_answers,
                    item.correct_answer,
                ];
                const decodedQuestion = decodeHtml(item.question);
                const decodedAnswers = allAnswers.map((answer) =>
                    decodeHtml(answer)
                );

                const shuffledAnswers = decodedAnswers.sort(
                    () => Math.random() - 0.5
                );

                return {
                    ...item,
                    decoded_question: decodedQuestion,
                    shuffled_answers: shuffledAnswers,
                };
            });
            setTrivia(shuffledTrivia);
        }
    }, [triviaData]);

    const handleSubmitForm = async (data) => {
        if (!showQuestions) {
            setShowQuestions(true);
            setResult({ correct: 0, show: false });

            setQuizParams({
                amount: data.amount,
                dificuldade: data.dificuldade,
                categoria: data.categoria,
                gameId: Date.now(),
            });
        } else if (showQuestions && result.show === false) {
            let correctCount = 0;
            const newAnswers = {};

            trivia.forEach((item, index) => {
                const decodedCorrectAnswer = decodeHtml(item.correct_answer);

                if (data[`question_${index}`] === decodedCorrectAnswer) {
                    correctCount++;
                    newAnswers[`question_${index}`] = true;
                } else {
                    newAnswers[`question_${index}`] = false;
                }
            });

            setAnswers(newAnswers);
            setResult({ correct: correctCount, show: true });
        }
    };

    const handleReset = () => {
        setShowQuestions(false);
        setAnswers({});
        setTrivia([]);
        setQuizParams(null); // Reseta os parametros para parar o hook
        setResult({ correct: 0, show: false });
        reset();
    };

    return (
        <StyledSection>
            <div className="header">
                <h1>Trivia</h1>
            </div>

            <div className="form-container">
                <StyledForm onSubmit={handleSubmit(handleSubmitForm)}>
                    {!showQuestions ? (
                        isCategoriesLoading ? (
                            <p>Carregando...</p>
                        ) : categoriesError ? (
                            <p>Erro ao carregar categorias.</p>
                        ) : (
                            <QuizInitialForm
                                categories={categories}
                                register={register}
                            />
                        )
                    ) : isTriviaLoading ? (
                        <p>Carregando perguntas...</p>
                    ) : triviaError ? (
                        <div>
                            <p>Erro ao buscar perguntas. Tente novamente.</p>
                            <StyledButton onClick={handleReset}>
                                Voltar
                            </StyledButton>
                        </div>
                    ) : (
                        <QuizQuestions
                            trivia={trivia}
                            selectedAnswer={answers}
                            showResult={result.show}
                            register={register}
                        />
                    )}

                    {!isTriviaLoading && !triviaError && (
                        <div>
                            {result.show && (
                                <QuizResults trivia={trivia} result={result} />
                            )}

                            {!result.show ? (
                                <StyledSubmit
                                    type="submit"
                                    value={!showQuestions ? "Enviar" : "Finalizar Quiz"}
                                />
                            ) : (
                                <StyledButton
                                    primary
                                    onClick={handleReset} // Usa a nova função de reset
                                    type="button" // Importante para não submeter form
                                >
                                    Jogar novamente
                                </StyledButton>
                            )}

                            {showQuestions ? (
                                <StyledButton type="button" onClick={() => reset()}>
                                    Limpar respostas
                                </StyledButton>
                            ) : null}
                        </div>
                    )}
                </StyledForm>
            </div>
        </StyledSection>
    );
};

const StyledSubmit = styled.input`
    width: 150px;
    margin: 15px;
    padding: 10px 20px;
    align-self: center;
    font-size: 1em;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const StyledButton = styled.button`
    width: 150px;
    margin: 15px;
    padding: 10px 20px;
    align-self: center;
    font-size: 1em;
    background-color: ${(props) => (props.primary ? "#4CAF50" : "#c71212")};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => (props.primary ? "#45a049" : "#a50f0f")};
    }
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
`;

const StyledSection = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default Form;
