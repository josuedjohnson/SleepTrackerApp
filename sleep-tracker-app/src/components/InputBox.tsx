import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  className,
}) => {

  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="input-wrapper">
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-box ${className || ""}`}
      />
      {type === "password" && (
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        />
      )}
    </div>
  );
};

export default InputBox;
