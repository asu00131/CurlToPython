"use client";

import { useState } from "react";
import { Copy, ArrowRight, Bot, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { curlToPythonConversion } from "@/ai/flows/curl-to-python-conversion";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const [curlCommand, setCurlCommand] = useState("");
    const [pythonCode, setPythonCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const placeholderCurl = `curl -X POST 'https://api.example.com/v1/users' \\
-H 'Authorization: Bearer YOUR_API_KEY' \\
-H 'Content-Type: application/json' \\
-d '{
  "name": "John Doe",
  "email": "john.doe@example.com"
}'`;

    const handleConvert = async () => {
        if (!curlCommand) return;
        setIsLoading(true);
        setPythonCode("");
        try {
            const result = await curlToPythonConversion({ curlCommand });
            setPythonCode(result.pythonCode);
        } catch (error) {
            console.error("Conversion failed:", error);
            toast({
                title: "Error",
                description: "Failed to convert the cURL command. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!pythonCode) return;
        navigator.clipboard.writeText(pythonCode);
        toast({
            title: "Copied!",
            description: "Python code has been copied to your clipboard.",
        });
    };
    
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-semibold font-headline">CurlToPython</h1>
                </div>
            </header>
            <main className="flex flex-1 flex-col items-center p-4 sm:p-8 md:p-12">
                <div className="w-full max-w-6xl mx-auto flex-1">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">Instantly Convert cURL to Python</h2>
                        <p className="text-lg text-muted-foreground mt-2">Paste your cURL command and let our AI convert it into clean, readable Python code.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <Card className="shadow-lg rounded-xl">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">cURL Command</CardTitle>
                                <CardDescription>Enter the cURL command you want to convert.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={curlCommand}
                                    onChange={(e) => setCurlCommand(e.target.value)}
                                    placeholder={placeholderCurl}
                                    className="font-code h-72 lg:h-80 resize-none text-sm bg-muted/50 border-2 border-dashed focus-visible:ring-primary focus-visible:border-primary transition-colors"
                                    aria-label="cURL command input"
                                />
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleConvert} disabled={isLoading || !curlCommand} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                                    {isLoading ? (
                                        <>
                                            <Bot className="mr-2 h-5 w-5 animate-spin" />
                                            Converting...
                                        </>
                                    ) : (
                                        <>
                                            Convert to Python
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card className="shadow-lg rounded-xl">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="font-headline text-2xl">Python Code</CardTitle>
                                    <CardDescription>Generated Python `requests` code.</CardDescription>
                                </div>
                                <Button variant="outline" size="icon" onClick={handleCopy} disabled={!pythonCode || isLoading} aria-label="Copy code">
                                    <Copy className="h-5 w-5" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted rounded-lg p-4 h-80 lg:h-[23.5rem] overflow-auto relative">
                                    {isLoading ? (
                                        <div className="space-y-3 p-2">
                                            <Skeleton className="h-4 w-10/12 rounded-full" />
                                            <Skeleton className="h-4 w-full rounded-full" />
                                            <Skeleton className="h-4 w-8/12 rounded-full" />
                                            <Skeleton className="h-4 w-11/12 rounded-full" />
                                        </div>
                                    ) : (
                                        <pre className="text-sm font-code text-foreground whitespace-pre-wrap">
                                            <code className="transition-opacity duration-500">
                                                {pythonCode || <span className="text-muted-foreground">Your Python code will appear here...</span>}
                                            </code>
                                        </pre>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <footer className="text-center mt-12 text-muted-foreground text-sm">
                        <p>Powered by Firebase Genkit & Google Gemini</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
