import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const API_URL = API_BASE_URL;

const TerminalLogin = ({ onLoginSuccess }) => {
  const { t, i18n } = useTranslation();
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
    // Only initialize history if it's empty
    if (history.length === 0) {
      setHistory([
        { text: "Earth Online [Version 2.0.24]", type: "info" },
        { text: "(c) 2026 System Corp. All rights reserved.", type: "info" },
        { text: " ", type: "info" },
        { key: "login.initialize_link", type: "success" },
        { text: " ", type: "info" },
        { key: "login.select_mode", type: "system" },
        {
          key: "login.access_terminal",
          params: { prefix: "  [1] " },
          type: "option",
        },
        {
          key: "login.register_new",
          params: { prefix: "  [2] " },
          type: "option",
        },
        { text: " ", type: "info" },
        { key: "login.enter_selection", type: "prompt_line" },
      ]);
    }
  }, []); // Run once on mount

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Focus input but DO NOT reset mode or history
    inputRef.current?.focus();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [history, mode]);

  const addToHistory = (content, type = "info") => {
    // Content can be a string (raw text) or object { key, params }
    if (typeof content === "string") {
      setHistory((prev) => [...prev, { text: content, type }]);
    } else {
      setHistory((prev) => [...prev, { ...content, type }]);
    }
  };

  const showMenu = () => {
    setMode("MENU");
    setCredentials({ username: "", password: "" });
    addToHistory(" ", "info");
    addToHistory({ key: "login.select_mode" }, "system");
    addToHistory(
      { key: "login.access_terminal", params: { prefix: "  [1] " } },
      "option",
    );
    addToHistory(
      { key: "login.register_new", params: { prefix: "  [2] " } },
      "option",
    );
    addToHistory(" ", "info");
    addToHistory({ key: "login.enter_selection" }, "prompt_line");
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
      addToHistory({ key: "login.op_cancelled" }, "warning");
      showMenu();
      return;
    }

    if (!cmd.trim()) return;

    // State Machine
    switch (mode) {
      case "MENU":
        if (normalizedCmd === "1" || normalizedCmd === "login") {
          setMode("LOGIN_USER");
          addToHistory({ key: "login.init_login" }, "warning");
          addToHistory({ key: "login.enter_identity" }, "prompt");
        } else if (normalizedCmd === "2" || normalizedCmd === "register") {
          setMode("REG_USER");
          addToHistory({ key: "login.init_register" }, "warning");
          addToHistory({ key: "login.enter_new_identity" }, "prompt");
        } else {
          addToHistory(
            { key: "login.invalid_selection", params: { cmd } },
            "error",
          );
          addToHistory({ key: "login.enter_selection" }, "prompt_line");
        }
        break;

      case "LOGIN_USER":
        setCredentials((prev) => ({ ...prev, username: rawCmd.trim() }));
        setMode("LOGIN_PASS");
        addToHistory({ key: "login.enter_key" }, "prompt");
        break;

      case "LOGIN_PASS":
        setCredentials((prev) => ({ ...prev, password: rawCmd.trim() }));
        await performLogin(credentials.username, rawCmd.trim());
        break;

      case "REG_USER":
        setCredentials((prev) => ({ ...prev, username: rawCmd.trim() }));
        setMode("REG_PASS");
        addToHistory({ key: "login.set_key" }, "prompt");
        break;

      case "REG_PASS":
        setCredentials((prev) => ({ ...prev, password: rawCmd.trim() }));
        setMode("REG_CONFIRM");
        addToHistory({ key: "login.confirm_key" }, "prompt");
        break;

      case "REG_CONFIRM":
        if (rawCmd.trim() !== credentials.password) {
          addToHistory({ key: "login.key_mismatch" }, "error");
          addToHistory({ key: "login.restarting_reg" }, "warning");
          setMode("REG_USER");
          addToHistory({ key: "login.enter_new_identity" }, "prompt");
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
    addToHistory({ key: "login.authenticating" }, "info");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      handleSuccess(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        addToHistory({ key: "login.access_denied" }, "error");
      } else if (err.response && err.response.status === 404) {
        addToHistory({ key: "login.server_error" }, "error");
      } else {
        addToHistory({ key: "login.connection_error" }, "error");
      }
      addToHistory({ key: "login.return_menu" }, "info");
      setTimeout(showMenu, 1000);
    }
    setLoading(false);
  };

  const performRegister = async (username, password) => {
    setLoading(true);
    addToHistory({ key: "login.allocating" }, "info");

    try {
      await new Promise((r) => setTimeout(r, 600)); // Fake delay
      const res = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
      });
      addToHistory({ key: "login.identity_established" }, "success");
      handleSuccess(res.data);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        addToHistory({ key: "login.identity_exists" }, "error");
      } else {
        addToHistory(
          { key: "login.reg_failed", params: { error: err.message } },
          "error",
        );
      }
      addToHistory({ key: "login.return_menu" }, "info");
      setTimeout(showMenu, 1000);
    }
    setLoading(false);
  };

  const handleSuccess = (data) => {
    addToHistory({ key: "login.access_granted" }, "success");
    addToHistory({ key: "login.loading_env" }, "success");

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
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col relative">
        {/* Language Switcher - Enhanced Visibility */}
        <div className="absolute top-0 right-0 z-10 flex gap-2 text-xs font-mono bg-black/80 p-2 rounded border border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.5)] backdrop-blur-sm">
          <button
            onClick={() => changeLanguage("en")}
            className={`px-3 py-1 rounded transition-all border ${
              i18n.language === "en"
                ? "border-cyan-500 text-cyan-400 bg-cyan-900/20 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            EN
          </button>
          <div className="w-px bg-white/10 my-1"></div>
          <button
            onClick={() => changeLanguage("zh")}
            className={`px-3 py-1 rounded transition-all border ${
              i18n.language === "zh"
                ? "border-cyan-500 text-cyan-400 bg-cyan-900/20 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            中文
          </button>
        </div>

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
              {line.params?.prefix ? (
                <>
                  {line.params.prefix}
                  {line.key ? t(line.key, line.params) : line.text}
                </>
              ) : line.key ? (
                t(line.key, line.params)
              ) : (
                line.text
              )}
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
