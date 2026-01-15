import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Dev env

const TerminalLogin = ({ onLoginSuccess }) => {
  const [history, setHistory] = useState([
    { text: "Earth Online [Version 2.0.24]", type: "info" },
    { text: "(c) 2026 System Corp. All rights reserved.", type: "info" },
    { text: " ", type: "info" },
    { text: "Initialize connection...", type: "info" },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState("username"); // username, password, command
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [history]);

  const addToHistory = (text, type = "info") => {
    setHistory((prev) => [...prev, { text, type }]);
  };

  const handleCommand = async (cmd) => {
    if (!cmd.trim()) return;

    addToHistory(`> ${step === "password" ? "********" : cmd}`, "input");

    if (step === "username") {
      setCredentials((prev) => ({ ...prev, username: cmd }));
      setStep("password");
      addToHistory("Enter Password:", "prompt");
    } else if (step === "password") {
      setCredentials((prev) => ({ ...prev, password: cmd }));
      await performLogin(credentials.username, cmd);
    }
  };

  const performLogin = async (username, password) => {
    setLoading(true);
    addToHistory("Authenticating...", "info");

    try {
      // Try Login
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      handleSuccess(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // If login fails, ask to register?
        // For hackathon, let's just try register automatically if login fails (lazy mode)
        // Or provide specific command.
        // Let's implement: Login failed. Try 'register' command?
        // Actually, let's auto-register for smoother UX in hackathon demo
        addToHistory("User not found or password incorrect.", "error");
        addToHistory("Initiating new user protocol...", "warning");
        try {
          const regRes = await axios.post(`${API_URL}/auth/register`, {
            username,
            password,
          });
          addToHistory("Registration successful.", "success");
          handleSuccess(regRes.data);
        } catch (regErr) {
          addToHistory(
            `Error: ${regErr.response?.data?.message || "Connection Refused"}`,
            "error"
          );
          reset();
        }
      } else {
        addToHistory("Connection Error: Server unreachable.", "error");
        reset();
      }
    }
    setLoading(false);
  };

  const handleSuccess = (data) => {
    addToHistory("Access Granted.", "success");
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("player_info", JSON.stringify(data.player));
    setTimeout(() => {
      onLoginSuccess(data.player);
    }, 1000);
  };

  const reset = () => {
    setStep("username");
    setCredentials({ username: "", password: "" });
    addToHistory(" ", "info");
    addToHistory("Login: ", "prompt");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 text-sm md:text-base overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-3xl mx-auto space-y-1">
        {history.map((line, i) => (
          <div
            key={i}
            className={`${
              line.type === "error"
                ? "text-red-500"
                : line.type === "success"
                ? "text-cyan-400"
                : line.type === "warning"
                ? "text-yellow-400"
                : "text-green-500/80"
            }`}
          >
            {line.text}
          </div>
        ))}

        <div className="flex items-center">
          <span className="mr-2 text-cyan-500">
            {step === "username"
              ? "user@earth-online:~$ Login:"
              : step === "password"
              ? "Password:"
              : ">"}
          </span>
          <input
            ref={inputRef}
            type={step === "password" ? "password" : "text"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="bg-transparent border-none outline-none flex-1 text-green-400 font-bold"
            autoFocus
            autoComplete="off"
          />
          <div className="w-2 h-4 bg-green-500 animate-pulse ml-1" />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default TerminalLogin;
