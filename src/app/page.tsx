"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DebateArena } from "@/components/debate-arena";

const EXAMPLE_TOPICS = [
  "AI will create more jobs than it destroys",
  "Remote work is better than office work",
  "Social media does more harm than good",
  "Universal Basic Income should be implemented globally",
  "Space exploration should be prioritized over ocean exploration",
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [debating, setDebating] = useState(false);
  const [activeDebate, setActiveDebate] = useState<string | null>(null);

  const startDebate = () => {
    if (topic.trim()) {
      setActiveDebate(topic);
      setDebating(true);
    }
  };

  const resetDebate = () => {
    setDebating(false);
    setActiveDebate(null);
    setTopic("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {!debating ? (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
              DebateAI Arena
            </h1>
            <p className="text-xl text-purple-200 mb-2">
              Watch AI models battle it out in real-time debates
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-400">
                Claude 3.5 Sonnet
              </Badge>
              <span className="text-purple-300">vs</span>
              <Badge variant="outline" className="bg-green-500/20 text-green-200 border-green-400">
                GPT-4o
              </Badge>
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Start a Debate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-purple-200 font-medium">
                  Enter a debate topic
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., AI will replace most jobs by 2030"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && startDebate()}
                    className="bg-white/10 border-white/20 text-white placeholder:text-purple-300/50 text-lg"
                  />
                  <Button
                    onClick={startDebate}
                    disabled={!topic.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8"
                  >
                    Start Debate
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-purple-200 font-medium">
                  Or try one of these topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_TOPICS.map((exampleTopic) => (
                    <Button
                      key={exampleTopic}
                      variant="outline"
                      size="sm"
                      onClick={() => setTopic(exampleTopic)}
                      className="bg-white/5 hover:bg-white/20 text-purple-100 border-white/20 hover:border-white/40"
                    >
                      {exampleTopic}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">1. Choose Topic</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100">
                  Enter any debate topic or select from examples
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">2. Watch Live</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100">
                  AI models stream arguments in real-time
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-200">3. Vote Winner</CardTitle>
                </CardHeader>
                <CardContent className="text-purple-100">
                  Decide which AI made the best argument
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <DebateArena topic={activeDebate!} onReset={resetDebate} />
      )}
    </div>
  );
}
