import React, { useState } from "react";
import { loginUser, signupUser } from "../api";

export default function LoginSignup({ setUser }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      let res;
      if (isLogin) {
        res = await loginUser(username);
      } else {
        res = await signupUser(username, role);
      }
      if (res.error) {
        setError(res.error);
      } else {
        setUser(res.user);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {!isLogin && (
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )}
      <button onClick={handleSubmit}>{isLogin ? "Login" : "Signup"}</button>
      <p style={{ color: "red" }}>{error}</p>
      <p>
        {isLogin ? "No account?" : "Already have an account?"}{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Signup" : "Login"}
        </span>
      </p>
    </div>
  );
}
