"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "claude" | "gpt";
  side: "for" | "against";
  content: string;
  streaming?: boolean;
}

interface DebateArenaProps {
  topic: string;
  onReset: () => void;
}

export function DebateArena({ topic, onReset }: DebateArenaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDebating, setIsDebating] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [winner, setWinner] = useState<"claude" | "gpt" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MAX_TURNS = 6; // 3 turns per side

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamResponse = async (
    model: "claude" | "gpt",
    side: "for" | "against"
  ) => {
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
      side: m.side,
    }));

    const response = await fetch("/api/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, model, debateSide: side, history }),
    });

    if (!response.ok) {
      console.error("Debate API error");
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let fullText = "";
    const messageIndex = messages.length;

    setMessages((prev) => [
      ...prev,
      { role: model, side, content: "", streaming: true },
    ]);

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[messageIndex] = {
            ...updated[messageIndex],
            content: fullText,
          };
          return updated;
        });
      }
    }

    setMessages((prev) => {
      const updated = [...prev];
      updated[messageIndex] = {
        ...updated[messageIndex],
        streaming: false,
      };
      return updated;
    });
  };

  const startDebate = async () => {
    setIsDebating(true);
    setMessages([]);
    setCurrentTurn(0);

    // Claude argues FOR, GPT argues AGAINST
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      if (turn % 2 === 0) {
        // Claude's turn (FOR)
        await streamResponse("claude", "for");
      } else {
        // GPT's turn (AGAINST)
        await streamResponse("gpt", "against");
      }
      setCurrentTurn(turn + 1);

      // Small delay between turns
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsDebating(false);
  };

  const voteWinner = (model: "claude" | "gpt") => {
    setWinner(model);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Debate</h1>
          <p className="text-purple-200 text-lg">Topic: {topic}</p>
        </div>
        <Button
          onClick={onReset}
          variant="outline"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          New Debate
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <Card className="bg-blue-500/20 backdrop-blur-lg border-blue-400/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Claude 3.5 Sonnet</span>
              <Badge className="bg-green-500 text-white">FOR</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100 text-sm">
              Arguing in favor of the topic
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/20 backdrop-blur-lg border-green-400/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>GPT-4o</span>
              <Badge className="bg-red-500 text-white">AGAINST</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-100 text-sm">
              Arguing against the topic
            </p>
          </CardContent>
        </Card>
      </div>

      {messages.length === 0 && !isDebating && (
        <div className="text-center py-12">
          <Button
            onClick={startDebate}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-12 py-6 text-xl"
          >
            Start Debate
          </Button>
        </div>
      )}

      {messages.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              Debate Progress ({currentTurn}/{MAX_TURNS} turns)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg animate-fade-in ${
                      message.role === "claude"
                        ? "bg-blue-500/20 border border-blue-400/50 ml-0 mr-12"
                        : "bg-green-500/20 border border-green-400/50 mr-0 ml-12"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={
                          message.role === "claude"
                            ? "bg-blue-500 text-white"
                            : "bg-green-500 text-white"
                        }
                      >
                        {message.role === "claude"
                          ? "Claude 3.5 Sonnet"
                          : "GPT-4o"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          message.side === "for"
                            ? "bg-green-500/20 text-green-200 border-green-400"
                            : "bg-red-500/20 text-red-200 border-red-400"
                        }
                      >
                        {message.side === "for" ? "FOR" : "AGAINST"}
                      </Badge>
                    </div>
                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {message.content}
                      {message.streaming && (
                        <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse" />
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {!isDebating && messages.length === MAX_TURNS && !winner && (
              <div className="mt-6 text-center">
                <p className="text-white text-lg mb-4 font-semibold">
                  Who made the better argument?
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => voteWinner("claude")}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  >
                    Claude Wins
                  </Button>
                  <Button
                    onClick={() => voteWinner("gpt")}
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white px-8"
                  >
                    GPT-4o Wins
                  </Button>
                </div>
              </div>
            )}

            {winner && (
              <div className="mt-6 text-center">
                <div
                  className={`p-6 rounded-lg ${
                    winner === "claude"
                      ? "bg-blue-500/30 border-2 border-blue-400"
                      : "bg-green-500/30 border-2 border-green-400"
                  }`}
                >
                  <p className="text-2xl font-bold text-white mb-2">
                    {winner === "claude" ? "Claude 3.5 Sonnet" : "GPT-4o"} Wins!
                  </p>
                  <p className="text-purple-200">
                    Thanks for watching this debate
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
