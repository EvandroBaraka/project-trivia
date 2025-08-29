import ComboBox from "../combo-box/combo-box";

const QuizInitialForm = ({ categories, register }) => {
    return (
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
    );
};

export default QuizInitialForm;