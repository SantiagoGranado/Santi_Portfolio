import { useState } from "react";

export function Email({ setFormData }) {
  const [error, setError] = useState("");

  // Function to validate email format (only allows Gmail with .com or .es)
  const validateEmail = (email) => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.(com|es)$/.test(email)) {
      return "Solo se permiten correos Gmail con dominio .com o .es.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError(validateEmail(value));
  };

  return (
    <div>
      <label>Email:</label>
      <input type="email" name="email" onChange={handleChange} />
      <p style={{ color: "red", minHeight: "10px" }}>{error || "\u00A0"}</p>
    </div>
  );
}
