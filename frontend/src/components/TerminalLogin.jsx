import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Dev env

const TerminalLogin = ({ onLoginSuccess }) => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");

  // Modes: MENU, LOGIN_USER, LOGIN_PASS, REG_USER, REG_PASS, REG_CONFIRM
  const [mode, setMode] = useState("MENU");
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  // 初始化欢迎界面
  useEffect(() => {
    if (!initialized.current) {
      setHistory([
        { text: "Earth Online [Version 2.0.24]", type: "info" },
        { text: "(c) 2026 System Corp. All rights reserved.", type: "info" },
        { text: " ", type: "info" },
        { text: "AUTHENTICATION PROTOCOL INITIATED...", type: "success" },
        { text: " ", type: "info" },
        { text: "Select Operation Mode:", type: "system" },
        { text: "  [1] Login (Access System)", type: "option" },
        { text: "  [2] Register (New Identity)", type: "option" },
        { text: " ", type: "info" },
        { text: "Enter selection [1-2]:", type: "prompt_line" },
      ]);
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [history, mode]);

  const addToHistory = (text, type = "info") => {
    setHistory((prev) => [...prev, { text, type }]);
  };

  const showMenu = () => {
    setMode("MENU");
    setCredentials({ username: "", password: "" });
    setHistory((prev) => [
      ...prev,
      { text: " ", type: "info" },
      { text: "Select Operation Mode:", type: "system" },
      { text: "  [1] Login (Access System)", type: "option" },
      { text: "  [2] Register (New Identity)", type: "option" },
      { text: " ", type: "info" },
      { text: "Enter selection [1-2]:", type: "prompt_line" },
    ]);
  };

  const handleCommand = async (cmd) => {
    const rawCmd = cmd;
    const normalizedCmd = cmd.trim().toLowerCase();

    // Echo input (hide password)
    const isPasswordInput =
      mode === "LOGIN_PASS" || mode === "REG_PASS" || mode === "REG_CONFIRM";
    const displayCmd = isPasswordInput ? "********" : rawCmd;

    // 如果是 prompt_line 类型，我们通常不显示用户的输入行，或者显示在 prompt 后面
    // 这里为了保持记录，还是显示一下
    if (cmd.trim() || mode !== "MENU") {
      addToHistory(`> ${displayCmd}`, "input");
    }

    // 全局取消命令
    if (["cancel", "back", "menu", "exit"].includes(normalizedCmd)) {
      addToHistory("Operation cancelled.", "warning");
      showMenu();
      return;
    }

    if (!cmd.trim()) return;

    // State Machine
    switch (mode) {
      case "MENU":
        if (normalizedCmd === "1" || normalizedCmd === "login") {
          setMode("LOGIN_USER");
          addToHistory("INITIATING LOGIN SEQUENCE...", "warning");
          addToHistory("Enter Identity (Username):", "prompt");
        } else if (normalizedCmd === "2" || normalizedCmd === "register") {
          setMode("REG_USER");
          addToHistory("INITIATING NEW SOUL REGISTRATION...", "warning");
          addToHistory("Enter New Identity (Username):", "prompt");
        } else {
          addToHistory(`Invalid selection: ${cmd}. Enter [1] or [2].`, "error");
          addToHistory("Enter selection [1-2]:", "prompt_line");
        }
        break;

      case "LOGIN_USER":
        setCredentials((prev) => ({ ...prev, username: rawCmd.trim() }));
        setMode("LOGIN_PASS");
        addToHistory("Enter Security Key (Password):", "prompt");
        break;

      case "LOGIN_PASS":
        setCredentials((prev) => ({ ...prev, password: rawCmd.trim() }));
        await performLogin(credentials.username, rawCmd.trim());
        break;

      case "REG_USER":
        setCredentials((prev) => ({ ...prev, username: rawCmd.trim() }));
        setMode("REG_PASS");
        addToHistory("Set Security Key (Password):", "prompt");
        break;

      case "REG_PASS":
        setCredentials((prev) => ({ ...prev, password: rawCmd.trim() }));
        setMode("REG_CONFIRM");
        addToHistory("Confirm Security Key:", "prompt");
        break;

      case "REG_CONFIRM":
        if (rawCmd.trim() !== credentials.password) {
          addToHistory("Error: Security Keys do not match.", "error");
          addToHistory("Restarting registration...", "warning");
          setMode("REG_USER");
          addToHistory("Enter New Identity (Username):", "prompt");
        } else {
          await performRegister(credentials.username, credentials.password);
        }
        break;

      default:
        showMenu();
    }
  };

  const performLogin = async (username, password) => {
    setLoading(true);
    addToHistory("Authenticating...", "info");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      handleSuccess(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        addToHistory("Access Denied: Invalid credentials.", "error");
      } else if (err.response && err.response.status === 404) {
        addToHistory("Error: Server endpoint not found.", "error");
      } else {
        addToHistory("Connection Error: Server unreachable.", "error");
      }
      addToHistory("Returning to menu...", "info");
      setTimeout(showMenu, 1000);
    }
    setLoading(false);
  };

  const performRegister = async (username, password) => {
    setLoading(true);
    addToHistory("Allocating memory blocks...", "info");

    try {
      await new Promise((r) => setTimeout(r, 600)); // Fake delay
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      addToHistory("Identity Established.", "success");
      handleSuccess(res.data);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        addToHistory("Error: Identity already exists.", "error");
      } else {
        addToHistory(`Registration Failed: ${err.message}`, "error");
      }
      addToHistory("Returning to menu...", "info");
      setTimeout(showMenu, 1000);
    }
    setLoading(false);
  };

  const handleSuccess = (data) => {
    addToHistory("ACCESS GRANTED.", "success");
    addToHistory("Loading environment...", "success");

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("player_info", JSON.stringify(data.player));

    setTimeout(() => {
      onLoginSuccess(data.player);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    }
  };

  // Helper to determine prompt label
  const getPrompt = () => {
    switch (mode) {
      case "MENU":
        return "sys@boot:~$";
      case "LOGIN_USER":
      case "REG_USER":
        return "Identity:";
      case "LOGIN_PASS":
      case "REG_PASS":
      case "REG_CONFIRM":
        return "Key:";
      default:
        return ">";
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 text-sm md:text-base overflow-hidden flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
        {/* History Area */}
        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-hide">
          {history.map((line, i) => (
            <div
              key={i}
              className={`${
                line.type === "error"
                  ? "text-red-500"
                  : line.type === "success"
                  ? "text-cyan-400 font-bold"
                  : line.type === "warning"
                  ? "text-yellow-400"
                  : line.type === "option"
                  ? "text-white pl-4"
                  : line.type === "system"
                  ? "text-green-400 font-bold mt-2"
                  : line.type === "prompt"
                  ? "text-white/80 mt-2"
                  : line.type === "prompt_line"
                  ? "text-cyan-400 mt-2 font-bold"
                  : line.type === "input"
                  ? "text-white/60"
                  : "text-green-500/80"
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center border-t border-green-900/30 pt-4">
          <span className="mr-3 text-cyan-500 font-bold">{getPrompt()}</span>
          <input
            ref={inputRef}
            type={
              mode === "LOGIN_PASS" ||
              mode === "REG_PASS" ||
              mode === "REG_CONFIRM"
                ? "password"
                : "text"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="bg-transparent border-none outline-none flex-1 text-green-400 font-bold placeholder-green-900"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <div
            className={`w-2 h-5 bg-green-500 ${
              loading ? "opacity-50" : "animate-pulse"
            } ml-1`}
          />
        </div>

        {/* Hint */}
        <div className="text-xs text-gray-600 mt-2 text-center">
          Type 'menu' or 'back' at any time to return to options.
        </div>
      </div>
    </div>
  );
};

export default TerminalLogin;
