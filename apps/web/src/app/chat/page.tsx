"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Send, Copy, Check, Loader2, Database, Code2, Download } from "lucide-react";
import { exportToCSV, exportToExcel } from "@/lib/export-utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: any[];
  explanation?: string;
}

const EXAMPLE_QUERIES = [
  "What's the total spend in the last 90 days?",
  "List top 5 vendors by spend",
  "Show overdue invoices as of today",
  "What's the average invoice value?",
  "How many invoices are pending?",
  "Show invoices by category",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState<string | null>(null);
  const [sessionId] = useState(() => {
    // Generate or retrieve session ID from localStorage
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('chatSessionId');
      if (!sid) {
        sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatSessionId', sid);
      }
      return sid;
    }
    return `session_${Date.now()}`;
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
        const response = await fetch(`${apiBase}/chat-history/${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadHistory();
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save message to database
  const saveMessage = async (message: Message) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
      await fetch(`${apiBase}/chat-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          role: message.role,
          content: message.content,
          sql: message.sql,
          data: message.data,
          explanation: message.explanation,
        }),
      });
    } catch (error) {
      console.error('Failed to save message:', error);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSql(id);
      setTimeout(() => setCopiedSql(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    saveMessage(userMessage); // Save user message
    const query = input.trim();
    setInput("");
    setLoading(true);

    // Create a placeholder assistant message that we'll update as we stream
    const initialAssistantMessage: Message = {
      role: "assistant",
      content: "",
      sql: "",
      data: [],
      explanation: "",
    };
    setMessages((prev) => [...prev, initialAssistantMessage]);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || '/api';
      const response = await fetch(`${apiBase}/chat-with-data/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let currentSql = "";
      let currentExplanation = "";
      let currentResults: any[] = [];
      let statusMessage = "";

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              switch (data.type) {
                case "status":
                  statusMessage = data.message;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.content = statusMessage;
                    }
                    return newMessages;
                  });
                  break;

                case "sql_chunk":
                  currentSql += data.chunk;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.sql = currentSql;
                    }
                    return newMessages;
                  });
                  break;

                case "sql":
                  currentSql = data.sql;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.sql = currentSql;
                    }
                    return newMessages;
                  });
                  break;

                case "results":
                  currentResults = Array.isArray(data.results) ? data.results : [];
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.data = currentResults;
                    }
                    return newMessages;
                  });
                  break;

                case "explanation":
                  currentExplanation = data.explanation;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.content = currentExplanation;
                      lastMsg.explanation = currentExplanation;
                    }
                    return newMessages;
                  });
                  break;

                case "error":
                  throw new Error(data.message || "Unknown error");

                case "done":
                  // Final update
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === "assistant") {
                      lastMsg.content = currentExplanation || "Query executed successfully";
                      lastMsg.sql = currentSql;
                      lastMsg.data = currentResults;
                      lastMsg.explanation = currentExplanation;
                      // Save assistant message
                      saveMessage(lastMsg);
                    }
                    return newMessages;
                  });
                  break;
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, line);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === "assistant") {
          lastMsg.content = `Sorry, I encountered an error: ${errorMessage}`;
        }
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'number') {
      // Format large numbers with commas
      return value.toLocaleString();
    }
    return String(value);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-0">
        <Header title="Chat with Data" />
        <main className="flex flex-1 flex-col overflow-hidden bg-gray-50 p-4 sm:p-6">
          <Card className="flex flex-1 flex-col shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Ask questions about your data
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 min-h-0 p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-4 sm:px-6 py-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <Database className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Start a conversation by asking a question about your data.</p>
                      <p className="text-sm text-gray-500 mb-6">Try one of these example queries:</p>
                      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto px-4">
                        {EXAMPLE_QUERIES.map((query, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            className="text-xs whitespace-normal break-words"
                            onClick={() => handleExampleClick(query)}
                          >
                            {query}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message, index) => {
                    const sqlId = `sql-${index}`;
                    return (
                      <div
                        key={index}
                        className={`flex gap-3 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Database className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-4 max-w-[85%] ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white border shadow-sm"
                          }`}
                        >
                          <div className="font-semibold mb-2 text-sm">
                            {message.role === "user" ? "You" : "Assistant"}
                          </div>
                          
                          {message.role === "user" ? (
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                          ) : (
                            <>
                              {/* Explanation */}
                              <div className="text-sm text-gray-700 mb-3">
                                {message.content || message.explanation}
                              </div>

                              {/* SQL Query */}
                              {message.sql && (
                                <div className="mt-4 mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                      <Code2 className="h-3 w-3" />
                                      Generated SQL
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => copyToClipboard(message.sql!, sqlId)}
                                    >
                                      {copiedSql === sqlId ? (
                                        <>
                                          <Check className="h-3 w-3 mr-1" />
                                          Copied
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3 w-3 mr-1" />
                                          Copy
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                  <div className="rounded-md bg-gray-900 p-2 sm:p-3 overflow-x-auto">
                                    <pre className="text-xs sm:text-sm text-green-400 font-mono whitespace-pre-wrap break-words">
                                      {message.sql}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {/* Results Table */}
                              {message.data && message.data.length > 0 && (
                                <div className="mt-4">
                                  <div className="mb-2 flex items-center justify-between">
                                    <div className="text-xs font-semibold text-gray-600">
                                      Results ({message.data.length} {message.data.length === 1 ? 'row' : 'rows'})
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => exportToCSV(message.data!, 'chat_results')}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        CSV
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => exportToExcel(message.data!, 'chat_results')}
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Excel
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="rounded-md border bg-white overflow-hidden">
                                    <div className="max-h-96 overflow-x-auto">
                                      {typeof message.data[0] === 'object' && message.data[0] !== null ? (
                                        <Table>
                                          <TableHeader className="bg-gray-50 sticky top-0">
                                            <TableRow>
                                              {Object.keys(message.data[0]).map((key) => (
                                                <TableHead 
                                                  key={key} 
                                                  className="text-xs font-semibold text-gray-700 whitespace-nowrap px-2 sm:px-3 py-2"
                                                >
                                                  {key}
                                                </TableHead>
                                              ))}
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {message.data.map((row, i) => (
                                              <TableRow key={i} className="hover:bg-gray-50">
                                                {Object.values(row).map((value, j) => (
                                                  <TableCell 
                                                    key={j} 
                                                    className="text-xs px-2 sm:px-3 py-2 whitespace-nowrap"
                                                  >
                                                    {formatValue(value)}
                                                  </TableCell>
                                                ))}
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      ) : (
                                        <div className="p-4">
                                          {message.data.map((item, i) => (
                                            <div key={i} className="text-sm mb-2">
                                              {formatValue(item)}
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* No Results */}
                              {message.data && message.data.length === 0 && (
                                <div className="mt-3 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                                  Query executed successfully but returned no results.
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {message.role === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">U</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Database className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="rounded-lg p-4 bg-white border shadow-sm">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing your query...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-3 sm:p-4 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask a question about your data..."
                    disabled={loading}
                    className="flex-1 text-sm sm:text-base"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={loading || !input.trim()}
                    className="px-4 sm:px-6 flex-shrink-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
