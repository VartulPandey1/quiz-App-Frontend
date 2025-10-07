import React, { useState } from "react";
import LoginSignup from "./components/LoginSignup";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginSignup setUser={setUser} />;

  return user.role === "admin" ? (
    <AdminDashboard user={user} />
  ) : (
    <UserDashboard user={user} />
  );
}

export default App;
