import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import getTrivia from "../../scripts/requests/trivia_request";
import getCategories from "../../scripts/requests/categories-request";
import Question from "../question/question";
import ComboBox from "../combo-box/combo-box";
import "./form.css";

const Form = () => {
  const { register, handleSubmit, reset } = useForm();
  const [trivia, setTrivia] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showQuestions, setShowQuestions] = useState(false);
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
    console.log(data);
    if (!showQuestions) {
      setShowQuestions(true);
      setResult({ correct: 0, show: false });

      try {
        const triviaData = await getTrivia(data.amount, data.dificuldade, data.categoria);
        if (triviaData && triviaData.results) {
          console.log(triviaData);
          setTrivia(triviaData.results);
          console.log(triviaData.results);
          console.log("Trivia carregada com sucesso.");
        } else {
          setTrivia([]);
          console.log("Trivia não encontrada ou formato inválido.");
        }
      } catch (error) {
        setTrivia([]);
        console.error("Erro ao buscar trivia:", error);
      }
    } else if (showQuestions){
        console.log("Respostas: ", data);
        let correctCount = 0;
        
        trivia.forEach((item, index) => {
          console.log(item);
          if (data[`question_${index}`] === item.correct_answer) {
            correctCount++;
          }
        });

        setResult({ correct: correctCount, show: true });
        console.log(`Você acertou ${correctCount} de ${trivia.length} perguntas.`);
    }
  };

  return (
    <section className="container">
      <div className="header">
        <h1>Trivia</h1>
      </div>

      <div className="form-container">
        <form className="form" onSubmit={handleSubmit(handleSubmitForm)}>
          {!showQuestions ? (
            <>
              <ComboBox
                label="Dificuldade"
                name="dificuldade"
                options={[
                  { label: "Fácil", value: "easy" },
                  { label: "Médio", value: "medium" },
                  { label: "Difícil", value: "hard" },
                ]}
                register={register}
              />

              <ComboBox
                label="Categoria"
                name="categoria"
                options={categories}
                register={register}
              />
            </>
          ) : (
            <>
              {Array.isArray(trivia) &&
                trivia.length > 0 &&
                trivia.map((item, index) => (
                  <Question
                    key={index}
                    question={item.question}
                    incorrect_answers={item.incorrect_answers}
                    correct_answer={item.correct_answer}
                    register={register}
                    index={index}
                  />
                ))}
            </>
          )}

          {result.show && (
            <div className="result">
              <p>
                Você acertou {result.correct} de {trivia.length} perguntas.
              </p>
            </div>
          )}

          <input
            className="inputs"
            type="submit"
            id="btn-enviar"
            value={!showQuestions ? "Enviar" : "Finalizar Quiz"}
          />

          {showQuestions ? (
            <button onClick={() => reset()}>Limpar respostas</button>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export default Form;
