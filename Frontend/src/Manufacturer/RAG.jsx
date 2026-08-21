import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Wand2
} from "lucide-react";


const RAG_API_URL = "http://localhost:5000/api/rag/query";

const QUICK_PROMPTS = [
  "📋 Summarize pending orders",
  "🧵 Kanchipuram silk warp & weft specs",
  "💰 Calculate pricing for bridal Zari saree",
  "⚙️ How to optimize loom production?",
  "✨ Silk saree care & preservation guide"
];

export default function RAG() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Namaste! 🙏 I am your **Vastra AI Artisan Assistant**. How can I assist you with handloom products, production, yarns, silk care, or manufacturing today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewNotification(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  const speakText = (text) => {
    if (!("speechSynthesis" in window) || !isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_\[\]()]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    try {
      console.log("Sending question to Vastra RAG:", query);
      const response = await fetch(RAG_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        let errorMessage = "RAG service failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Ignore JSON parse error
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Vastra RAG response:", data);

      const aiResponseText = data.response || data.answer || "I couldn't generate an answer from the Vastra knowledge base.";

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources || []
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (isVoiceEnabled) {
        speakText(aiResponseText);
      }
    } catch (error) {
      console.error("Vastra RAG Error:", error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text: "Sorry, I couldn't connect to the Vastra AI service right now. Please make sure the RAG and backend servers are running.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Conversation cleared. How can I assist you with your handloom operations now?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className={`mb-3 flex flex-col overflow-hidden rounded-3xl border border-[#E5DCD0] bg-[#FFFDF9] shadow-[0_20px_50px_rgba(74,21,37,0.25)] transition-all duration-300 ${isExpanded
              ? "fixed inset-4 sm:inset-8 z-50 md:inset-auto md:bottom-6 md:right-6 md:h-[680px] md:w-[620px]"
              : "h-[560px] w-[92vw] max-w-[420px]"
            }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {/* HEADER */}
          <div className="relative flex items-center justify-between border-b border-[#EADFD2] bg-gradient-to-r from-[#4A1525] via-[#5F192E] to-[#7D293E] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D09229] to-[#FCDA8B] text-[#4A1525] shadow-sm">
                <Bot className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#4A1525] bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold tracking-tight text-[#FAF5EE]">
                    Vastra AI Assistant
                  </h3>
                  <span className="flex items-center gap-1 rounded-full border border-[#D09229]/30 bg-[#D09229]/25 px-2 py-0.5 text-[9px] font-bold text-[#FCDA8B]">
                    <Sparkles className="h-2.5 w-2.5" />
                    RAG Active
                  </span>
                </div>
                <p className="text-[11px] text-[#F3E7DA]/80">
                  Kathar Weaves • Handloom Intelligence
                </p>
              </div>
            </div>

            {/* HEADER ACTIONS */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                title={isVoiceEnabled ? "Mute Voice" : "Enable Voice Readout"}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isVoiceEnabled ? "bg-[#D09229] text-[#4A1525]" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={handleClearChat}
                title="Clear Chat History"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white sm:flex"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* RAG STATUS */}
          <div className="flex items-center justify-between border-b border-[#F0E6DA] bg-[#FAF5EE] px-4 py-1.5 text-[11px] text-[#7C6E61]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Context: <strong>Vastra Knowledge Base</strong></span>
            </div>
            <span className="text-[10px] text-[#A49688]">ChromaDB • RAG</span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-3.5 overflow-y-auto bg-[#FAF7F2]/50 p-4">
            {messages.map((msg, index) => {
              const isAi = msg.sender === "ai";

              return (
                <div
                  key={msg.id || index}
                  className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
                >
                  {isAi && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#4A1525] to-[#7A263B] text-white shadow-2xs">
                      <Sparkles className="h-3.5 w-3.5 text-[#FCDA8B]" />
                    </div>
                  )}

                  <div className={`group relative max-w-[85%] ${isAi ? "items-start" : "items-end"}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs transition ${isAi
                          ? "border border-[#EBDED0] bg-white text-[#292421]"
                          : "bg-gradient-to-r from-[#4A1525] to-[#6A1E34] text-white"
                        }`}
                    >
                      {/* MESSAGE CONTENT */}
                      <div className="space-y-1.5 whitespace-pre-wrap font-sans">
                        {msg.text.split("\n").map((line, lineIndex) => {
                          if (line.startsWith("### ")) {
                            return (
                              <h4 key={lineIndex} className="mt-1 mb-1 font-serif text-sm font-bold text-[#4A1525]">
                                {line.replace("### ", "")}
                              </h4>
                            );
                          }
                          if (line.startsWith("- ")) {
                            return (
                              <div key={lineIndex} className="my-0.5 flex items-start gap-1.5 pl-1">
                                <span className="font-bold text-[#D09229]">•</span>
                                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.slice(2)) }} />
                              </div>
                            );
                          }
                          if (line.startsWith("```")) {
                            return null;
                          }
                          return (
                            <p key={lineIndex} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
                          );
                        })}
                      </div>

                      {/* SOURCES */}
                      {isAi && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 border-t border-[#F0E6DA] pt-2">
                          <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#A49688]">
                            Retrieved Sources
                          </p>
                          {msg.sources.slice(0, 3).map((source, sourceIndex) => (
                            <div key={sourceIndex} className="text-[9px] text-[#8F8175]">
                              • {source.source || "Vastra Knowledge Base"}
                              {source.category && ` • ${source.category}`}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* TIMESTAMP + ACTIONS */}
                      <div
                        className={`mt-1.5 flex items-center justify-between text-[9px] ${isAi ? "text-[#9E8E80]" : "text-white/70"
                          }`}
                      >
                        <span>{msg.timestamp}</span>

                        {isAi && (
                          <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.text, index)}
                              className="rounded p-1 text-[#7C6E61] hover:bg-[#F3ECE1]"
                              title="Copy response"
                            >
                              {copiedIndex === index ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>

                            {isVoiceEnabled && (
                              <button
                                type="button"
                                onClick={() => speakText(msg.text)}
                                className="rounded p-1 text-[#7C6E61] hover:bg-[#F3ECE1]"
                                title="Listen again"
                              >
                                <Volume2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isAi && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#D09229] text-xs font-bold text-[#3B1502] shadow-2xs">
                      <User className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* TYPING INDICATOR */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#7C6E61]">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#4A1525] text-[#FCDA8B]">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl border border-[#EBDED0] bg-white px-3.5 py-2 shadow-xs">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#4A1525]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#D09229] [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7A263B] [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] font-medium text-[#8F8175]">
                    Searching Vastra knowledge...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="border-t border-[#F0E6DA] bg-[#FAF5EE]/80 px-3 py-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8F8175]">
                <Wand2 className="h-3 w-3 text-[#D09229]" />
                Suggested Inquiries:
              </span>
            </div>

            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isTyping}
                  className="shrink-0 rounded-xl border border-[#E5D9CC] bg-white px-2.5 py-1 text-[11px] font-medium text-[#56493F] shadow-2xs transition hover:border-[#4A1525] hover:bg-[#F7EFE6] hover:text-[#4A1525] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT */}
          <div className="border-t border-[#EBDED0] bg-white p-3">
            <div className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about handloom, silk, yarns, production..."
                className="w-full rounded-2xl border border-[#D9CBBF] bg-[#FAF7F2] py-2.5 pl-3.5 pr-11 text-xs text-[#292421] outline-none transition placeholder-[#A29487] focus:border-[#4A1525] focus:bg-white focus:ring-2 focus:ring-[#4A1525]/10 shadow-inner"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() || isTyping}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#4A1525] to-[#7A263B] text-white shadow-xs transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                title="Send Question"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#A49688]">
              <span>
                Press <strong>Enter ↵</strong> to send
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#805F36]">
                <Sparkles className="h-2.5 w-2.5 text-[#D09229]" />
                Powered by Vastra RAG
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 rounded-full border border-[#FCDA8B]/30 bg-gradient-to-r from-[#4A1525] via-[#5F1D32] to-[#7A263B] p-3 text-white shadow-[0_8px_25px_rgba(74,21,37,0.38)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_rgba(74,21,37,0.5)] active:scale-95"
        title="Open AI Handloom Assistant"
      >
        {/* Glow */}
        <span className="pointer-events-none absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-[#D09229] to-[#7A263B] opacity-40 blur-sm transition duration-500 group-hover:opacity-75" />

        {/* Icon */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#D09229] to-[#FCDA8B] text-[#4A1525] shadow-xs">
          <Bot className="h-5 w-5" />
          <Sparkles className="absolute -right-1 -top-1 h-3 w-3 animate-spin text-white [animation-duration:4s]" />
        </div>

        {/* Label */}
        <div className="relative pr-2 text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-xs font-bold tracking-wide text-white">
              AI Assistant
            </span>
            <span className="rounded-full bg-[#D09229] px-1.5 py-0.5 text-[8px] font-extrabold uppercase text-[#3B1502]">
              RAG
            </span>
          </div>
          <p className="text-[9px] text-[#F3E7DA]/80">Kathar Weaves Support</p>
        </div>

        {/* Notification */}
        {hasNewNotification && !isOpen && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D09229] opacity-75" />
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#D09229] text-[9px] font-black text-[#3B1502]">
              1
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// MARKDOWN FORMATTER
// ============================================================================

function formatInlineMarkdown(str) {
  if (!str) return "";

  let formatted = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#4A1525]">$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-[#704C91]">$1</em>');
  formatted = formatted.replace(/`(.*?)`/g, '<code class="rounded bg-[#F0E6DA] px-1 py-0.5 font-mono text-[11px] text-[#5A1C2C]">$1</code>');

  return formatted;
}