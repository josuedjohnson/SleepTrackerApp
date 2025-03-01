interface InputBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  placeholder,
  onChange,
  type = "text",
  className
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input-box ${className || ""}`}
    />
  );
};

export default InputBox;
