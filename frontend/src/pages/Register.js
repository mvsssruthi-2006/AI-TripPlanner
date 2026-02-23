import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* PASSWORD VALIDATIONS */
  const validations = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isEmailValid = email.endsWith("@gmail.com");
  const isPasswordValid = Object.values(validations).every(Boolean);
  const isConfirmValid = password === confirmPassword && confirmPassword !== "";

  /* REGISTER HANDLER */
  const handleRegister = async () => {
  const res = await fetch("http://localhost:8000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: "User",
      email,
      password
    }),
  });

  if (res.ok) {
    navigate("/login");
  }
};

  return (
    <motion.div
      className="register-page"
      style={{ backgroundImage: "url(/img15.png)" }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="register-card"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2>Create Account</h2>
        <p className="subtitle" >
          Join Trip Navigator and start exploring
        </p>

        <label>Full Name</label>
        <input type="text" placeholder="Enter your full name" />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={!isEmailValid && email ? "error" : ""}
        />
        {!isEmailValid && email && (
          <small className="error-text">
            Email must end with @gmail.com
          </small>
        )}

        <label>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="password-rules">
          <Rule ok={validations.length} text="At least 8 characters" />
          <Rule ok={validations.uppercase} text="At least 1 uppercase letter" />
          <Rule ok={validations.number} text="At least 1 number" />
          <Rule ok={validations.special} text="At least 1 special character" />
        </div>

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={!isConfirmValid && confirmPassword ? "error" : ""}
        />

        <button
          className="register-btn"
          disabled={!isEmailValid || !isPasswordValid || !isConfirmValid}
          onClick={handleRegister}
        >
          Create Account
        </button>

        <p className="signin-text">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </motion.div>
    </motion.div>
  );
}

/* PASSWORD RULE COMPONENT */
function Rule({ ok, text }) {
  return (
    <div className={`rule ${ok ? "ok" : ""}`}>
      {ok ? "✔" : "✖"} {text}
    </div>
  );
}

export default Register;
