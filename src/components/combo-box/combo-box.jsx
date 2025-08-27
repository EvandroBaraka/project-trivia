const ComboBox = ({ label, name, options, register }) => {
    return (
        <div className="combo-box">
            <label htmlFor={name}>{label}: </label>
            <select id={name} {...register(name)} >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ComboBox