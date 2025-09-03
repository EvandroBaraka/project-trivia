import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import getTrivia from "../../scripts/requests/trivia_request";
import getCategories from "../../scripts/requests/categories-request";
import QuizInitialForm from "../quiz-initial-form/quiz-initial-form";
import QuizQuestions from "../quiz-questions/quiz-questions";
import QuizResults from "../quiz-results/quiz-results";


const decodeHtml = (html) => {
  var txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}


const Form = () => {
  const { register, handleSubmit, reset } = useForm();
  const [trivia, setTrivia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState({
    correct: 0,
    show: false
  });

  useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                if (data) {
                    const formattedCategories = data.map(category => ({
                      value: category.id,
                      label: category.name
                    }));
                    formattedCategories.unshift({ value: '', label: 'Qualquer Categoria' });

                    setCategories(formattedCategories);
                    console.log("Categorias carregadas com sucesso.");
                } else {
                    console.log("Categorias não encontradas.");
                }
            } catch (error) {
                console.error("Erro ao buscar categorias:", error);
            }
        };

        fetchCategories();
    }, []);

  const handleSubmitForm = async (data) => {
    if (!showQuestions) {
      setShowQuestions(true);
      setResult({ correct: 0, show: false });
      
      try {
        const triviaData = await getTrivia(data.amount, data.dificuldade, data.categoria);
        if (triviaData && triviaData.results) {

          const shuffledTrivia = triviaData.results.map(item => {
            const allAnswers = [...item.incorrect_answers, item.correct_answer];
            const decodedQuestion = decodeHtml(item.question);
            const decodedAnswers = allAnswers.map(answer => decodeHtml(answer));
            
            const shuffledAnswers = decodedAnswers.sort(() => Math.random() - 0.5);

            return { ...item, decoded_question: decodedQuestion, shuffled_answers: shuffledAnswers };
          });
          
          setTrivia(shuffledTrivia);
          console.log("Trivia carregada com sucesso.");
        } else {
          setTrivia([]);
          console.log("Trivia não encontrada ou formato inválido.");
        }
      } catch (error) {
        setTrivia([]);
        console.error("Erro ao buscar trivia:", error);
      }
    } else if (showQuestions && result.show === false) {
        let correctCount = 0;
        const newAnswers = {};
        
        trivia.forEach((item, index) => {
          const decodedCorrectAnswer = decodeHtml(item.correct_answer);

          if (data[`question_${index}`] === decodedCorrectAnswer) {
            correctCount++;
            newAnswers[`question_${index}`] = true;
            console.log(data[`question_${index}`], decodedCorrectAnswer, " - Correto");
          } else {
            newAnswers[`question_${index}`] = false;
            console.log(data[`question_${index}`], decodedCorrectAnswer, " - Incorreto");
          }
        });

        setAnswers(newAnswers);
        setResult({ correct: correctCount, show: true });
    }
  };

  return (
    <StyledSection>
      <div className="header">
        <h1>Trivia</h1>
      </div>

      <div className="form-container">
        <StyledForm onSubmit={handleSubmit(handleSubmitForm)}>
          {!showQuestions ? (
            <QuizInitialForm categories={categories} register={register} />
          ) : (
            <QuizQuestions trivia={trivia} selectedAnswer={answers} showResult={result.show} register={register} />
          )}

          {result.show && (
            <QuizResults trivia={trivia} result={result} />
          )}

          {!result.show ? (
            <StyledSubmit
            type="submit"
            value={!showQuestions ? "Enviar" : "Finalizar Quiz"}
            />
          ) : (
            <StyledButton primary onClick={() => { 
              setShowQuestions(false); 
              setAnswers({}); 
              setTrivia([]); 
              setResult({ correct: 0, show: false }); 
              reset(); } }>
                Jogar novamente
            </StyledButton>
          )}

          {showQuestions ? (
            <StyledButton onClick={() => reset()}>Limpar respostas</StyledButton>
          ) : null}
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
    background-color: #4CAF50;
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
    background-color: ${props => props.primary ? '#4CAF50' : '#c71212'};
    color: white; 
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: ${props => props.primary ? '#45a049' : '#a50f0f'};
    }
`;

const StyledForm = styled.form `
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
`;

const StyledSection = styled.section `
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default Form;
