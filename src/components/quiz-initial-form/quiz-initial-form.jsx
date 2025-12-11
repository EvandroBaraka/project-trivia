import ComboBox from "../combo-box/combo-box";

const QuizInitialForm = ({ categories, register }) => {
    return (
        <>
            <ComboBox
                label="Dificuldade"
                name="dificuldade"
                options={[
                    { name: "Fácil", id: "easy" },
                    { name: "Médio", id: "medium" },
                    { name: "Difícil", id: "hard" },
                ]}
                register={register}
            />

            <ComboBox
                label="Categoria"
                name="categoria"
                options={categories}
                register={register}
            />

            <div>
                <label htmlFor="amount">Quantidade de perguntas: </label>
                <input
                    label="Quantidade de perguntas"
                    type="number"
                    min="1"
                    max="50"
                    defaultValue="10"
                    {...register("amount", {
                        required: "Defina a quantidade de perguntas",
                        min: { value: 1, message: "Mínimo 1 pergunta" },
                        max: { value: 50, message: "Máximo 50 perguntas" },
                    })}
                />
            </div>
        </>
    );
};

export default QuizInitialForm;