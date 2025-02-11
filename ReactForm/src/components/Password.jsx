import React, { useState } from "react";

export function Password({ setFormData }) {
  const [formData, setLocalFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  // Regex to ensure password has at least 4 characters, one uppercase, one lowercase, one number, and one symbol
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,}$/;

  const validatePassword = (password) => {
    return passwordRegex.test(password)
      ? ""
      : "Debe tener al menos 4 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      setErrors((prevErrors) => ({ ...prevErrors, password: validatePassword(value) }));
    }

    if (name === "confirmPassword") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: value !== formData.password ? "Las contraseñas no coinciden." : "",
      }));
    }
  };

  return (
    <div>
      <label>Contraseña:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />
      <p style={{ color: "red", minHeight: "10px" }}>{errors.password || "\u00A0"}</p>

      <label>Confirmar Contraseña:</label>
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
      <p style={{ color: "red", minHeight: "10px" }}>{errors.confirmPassword || "\u00A0"}</p>
    </div>
  );
}
