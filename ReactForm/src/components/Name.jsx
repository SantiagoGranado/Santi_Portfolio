import React, { useState } from "react";

export function Name({ setFormData }) {
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });

  // Function to validate first name (one word, capitalized, 3-10 characters)
  const validateName = (name) => {
    if (!/^[A-Z\u00D1][a-z\u00F1]{2,9}$/.test(name)) {
      return "Debe ser una sola palabra con mayúscula inicial y entre 3 y 10 caracteres.";
    }
    return "";
  };

  // Function to validate last name (two words, each capitalized, separated by space)
  const validateLastName = (lastName) => {
    if (!/^[A-Z\u00D1][a-z\u00F1]{2,9} [A-Z\u00D1][a-z\u00F1]{2,9}$/.test(lastName)) {
      return "Debe contener dos apellidos, cada uno con mayúscula inicial, separados por un espacio.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "firstName") {
      setErrors((prevErrors) => ({ ...prevErrors, firstName: validateName(value) }));
    } else if (name === "lastName") {
      setErrors((prevErrors) => ({ ...prevErrors, lastName: validateLastName(value) }));
    }
  };

  return (
    <div>
      <label>Nombre:</label>
      <input type="text" name="firstName" onChange={handleChange} />
      <p style={{ color: "red", minHeight: "10px" }}>{errors.firstName || "\u00A0"}</p>

      <label>Apellidos:</label>
      <input type="text" name="lastName" onChange={handleChange} />
      <p style={{ color: "red", minHeight: "10px" }}>{errors.lastName || "\u00A0"}</p>
    </div>
  );
}
