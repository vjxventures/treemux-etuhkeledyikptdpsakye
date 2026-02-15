'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Code2,
  Sparkles,
  Upload,
  Zap,
  BookOpen,
  Camera,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [mode, setMode] = useState<'suggest' | 'explain'>('suggest');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!code && !screenshot) return;

    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, screenshot, mode })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const text = line.slice(2).replace(/^"(.*)"$/, '$1');
              setAnalysis((prev) => prev + text);
            }
          }
        }
      }
    } catch (error) {
      setAnalysis('Error analyzing code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CodeMentor Live</h1>
              <p className="text-sm text-slate-400">AI-Powered Pair Programming Assistant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Your Code</h2>
            </div>

            <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="mb-4">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="suggest" className="data-[state=active]:bg-blue-600">
                  <Zap className="w-4 h-4 mr-2" />
                  Suggestions
                </TabsTrigger>
                <TabsTrigger value="explain" className="data-[state=active]:bg-purple-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explain
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Language</label>
                <Input
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="typescript, python, java..."
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-2 block">Paste Code or Upload Screenshot</label>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  className="min-h-[300px] font-mono text-sm bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshot}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                    onClick={() => document.querySelector('input[type="file"]')?.dispatchEvent(new MouseEvent('click'))}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {screenshot ? 'Screenshot Uploaded' : 'Upload Screenshot'}
                  </Button>
                </label>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (!code && !screenshot)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>
              </div>

              {screenshot && (
                <div className="relative">
                  <img
                    src={screenshot}
                    alt="Uploaded screenshot"
                    className="w-full h-32 object-cover rounded-lg border border-slate-700"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setScreenshot(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Analysis Section */}
          <Card className="p-6 bg-slate-900/50 border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                {mode === 'suggest' ? (
                  <Zap className="w-4 h-4 text-white" />
                ) : (
                  <BookOpen className="w-4 h-4 text-white" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-white">
                {mode === 'suggest' ? 'AI Suggestions' : 'Code Explanation'}
              </h2>
              {isAnalyzing && (
                <Badge className="ml-auto bg-blue-600">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Analyzing
                </Badge>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              {analysis ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {analysis.split('\n').map((line, i) => {
                      if (line.startsWith('# ')) {
                        return (
                          <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">
                            {line.slice(2)}
                          </h3>
                        );
                      }
                      if (line.startsWith('## ')) {
                        return (
                          <h4 key={i} className="text-md font-semibold text-blue-400 mt-3 mb-2">
                            {line.slice(3)}
                          </h4>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <div key={i} className="flex gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                            <span>{line.slice(2)}</span>
                          </div>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p key={i} className="font-semibold text-purple-400 mt-2">
                            {line.slice(2, -2)}
                          </p>
                        );
                      }
                      return line ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="p-4 rounded-full bg-slate-800 mb-4">
                    <Code2 className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-400 mb-2">
                    Ready to analyze your code
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm">
                    Paste code or upload a screenshot, then click "Analyze Code" to get
                    AI-powered insights and suggestions.
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="p-4 bg-slate-900/30 border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Smart Analysis</h3>
                <p className="text-sm text-slate-400">
                  AI-powered code review with bug detection and optimization tips
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-900/30 border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Camera className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Multi-Modal</h3>
                <p className="text-sm text-slate-400">
                  Analyze code from screenshots or pasted text
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-900/30 border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Real-Time</h3>
                <p className="text-sm text-slate-400">
                  Streaming responses for instant feedback
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
