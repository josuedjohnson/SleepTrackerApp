interface InputBoxProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const InputBox: React.FC<InputBoxProps> = ({
  value,
  placeholder,
  onChange,
  type = "text",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default InputBox;
