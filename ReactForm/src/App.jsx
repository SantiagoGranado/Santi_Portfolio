import { useState, useEffect } from 'react';
import './App.css';
import { Name } from "./components/Name.jsx";
import { Email } from "./components/Email.jsx";
import { Password } from "./components/Password.jsx";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [validForm, setValidForm] = useState(false);

  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateForm = () => {
    const nameRegex = /^[A-ZÑ][a-zñ]{2,9}$/;
    const lastNameRegex = /^[A-ZÑ][a-zñ]{2,9} [A-ZÑ][a-zñ]{2,9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.(com|es)$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,}$/;

    const isValid =
      nameRegex.test(formData.firstName) &&
      lastNameRegex.test(formData.lastName) &&
      emailRegex.test(formData.email) &&
      passwordRegex.test(formData.password) &&
      formData.password === formData.confirmPassword;

    setValidForm(isValid);
  };

  const handleSubmit = () => {
    console.log("Nombre:", formData.firstName);
    console.log("Apellido:", formData.lastName);
    console.log("Email:", formData.email);
    console.log("Contraseña:", formData.password);
  };

  return (
    <div>
      <h1>Formulario</h1>
      <p></p>
      <Name setFormData={setFormData} />
      <Email setFormData={setFormData} />
      <Password setFormData={setFormData} />
      <button onClick={handleSubmit} disabled={!validForm}>Enviar</button>
    </div>
  );
}

export default App;
