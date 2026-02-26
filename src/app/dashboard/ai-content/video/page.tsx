"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateVideoScript, type GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { describeVideo, type DescribeVideoOutput } from '@/ai/flows/describe-video-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film, Clapperboard, Sparkles, Video, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().min(10, 'Please enter a topic at least 10 characters long.'),
  targetAudience: z.string().min(5, 'Please describe the target audience.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VideoStudioPage() {
  const [generatedScript, setGeneratedScript] = useState<GenerateVideoScriptOutput | null>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [uploadedVideoUri, setUploadedVideoUri] = useState<string | null>(null);
  const [videoDescription, setVideoDescription] = useState<DescribeVideoOutput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      targetAudience: '',
    },
  });

  async function onScriptSubmit(values: FormValues) {
    setIsLoadingScript(true);
    setGeneratedScript(null);
    try {
      const result = await generateVideoScript({ 
          topic: values.topic,
          targetAudience: values.targetAudience
      });
      setGeneratedScript(result);
      toast({
        title: 'Script Generated!',
        description: 'Your video script has been successfully created.',
      });
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: 'Error Generating Script',
        description: error instanceof Error ? error.message : 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingScript(false);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: 'File too large',
          description: 'Please upload a video smaller than 4MB.',
          variant: 'destructive',
        });
        event.target.value = ''; // Reset the input
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedVideoUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleAnalyzeVideo() {
    if (!uploadedVideoUri) {
      toast({
        title: 'No video selected',
        description: 'Please upload a video to analyze.',
        variant: 'destructive',
      });
      return;
    }
    setIsAnalyzing(true);
    setVideoDescription(null);
    try {
      const result = await describeVideo({ videoDataUri: uploadedVideoUri });
      setVideoDescription(result);
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast({
        title: 'Error Analyzing Video',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }


  return (
    <div className="space-y-12">
        {/* Script Generator */}
        <div>
            <h2 className="text-2xl font-headline font-semibold mb-4">AI Video Script Writer</h2>
            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                    <CardTitle>Generate a Script</CardTitle>
                    <CardDescription>
                        Generate a complete, structured script for your next marketing video.
                    </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onScriptSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="topic"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Video Topic</FormLabel>
                                <FormControl>
                                <Textarea
                                    placeholder="e.g., 'Why NVMe hosting is essential for e-commerce in 2024'"
                                    rows={3}
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="targetAudience"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Audience</FormLabel>
                                <FormControl>
                                <Input
                                    placeholder="e.g., 'Shopify store owners, digital marketers'"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoadingScript} className="w-full">
                            {isLoadingScript ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                            <Film className="mr-2 h-4 w-4" />
                            )}
                            Generate Script
                        </Button>
                        </form>
                    </Form>
                    </CardContent>
                </Card>
                <Card className="min-h-[400px]">
                    <CardHeader>
                    <CardTitle>Generated Script</CardTitle>
                    <CardDescription>Your AI-generated video script will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    {isLoadingScript && (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Writing your script...</p>
                        </div>
                    )}
                    {!isLoadingScript && generatedScript && (
                        <div className="space-y-6 text-sm prose prose-sm max-w-none">
                        <h3 className="font-bold text-lg text-primary">{generatedScript.scriptTitle}</h3>
                        
                        <div>
                            <h4 className="font-semibold">Introduction:</h4>
                            <p className="text-muted-foreground">{generatedScript.introduction}</p>
                        </div>

                        <div>
                            <h4 className="font-semibold">Main Points:</h4>
                            <ul className="list-disc list-inside space-y-2">
                                {generatedScript.mainPoints.map((point, index) => (
                                    <li key={index}>
                                        <strong>{point.heading}:</strong> <span className="text-muted-foreground">{point.content}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold">Conclusion:</h4>
                            <p className="text-muted-foreground">{generatedScript.conclusion}</p>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold">Call to Action:</h4>
                            <p className="text-muted-foreground">{generatedScript.callToAction}</p>
                        </div>
                        </div>
                    )}
                    {!isLoadingScript && !generatedScript && (
                        <Alert variant="default">
                            <Clapperboard className="h-4 w-4" />
                            <AlertTitle>Ready to create?</AlertTitle>
                            <AlertDescription>
                                Enter a topic on the left to generate your first video script.
                            </AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                </Card>
            </div>
        </div>

        <Separator />

        {/* Video Analyzer */}
        <div>
            <h2 className="text-2xl font-headline font-semibold mb-4">AI Video Analyzer</h2>
            <div className="grid gap-8 md:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Upload & Analyze Video</CardTitle>
                        <CardDescription>
                        Upload a video file to get an AI-powered description and tags. Works on mobile too!
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="video-upload">Video File</Label>
                        <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} disabled={isAnalyzing} />
                        <FormDescription>Max file size: 4MB. Analysis uses advanced AI and may take a moment.</FormDescription>
                        </div>
                        {uploadedVideoUri && (
                        <div className="space-y-4 pt-4">
                            <video controls src={uploadedVideoUri} className="w-full rounded-lg border bg-muted" />
                            <Button onClick={handleAnalyzeVideo} disabled={isAnalyzing || !uploadedVideoUri} className="w-full">
                                {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Analyze Video
                            </Button>
                        </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Analysis Result</CardTitle>
                        <CardDescription>The AI's analysis of your video will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isAnalyzing && (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Analyzing your video... please wait.</p>
                        </div>
                        )}
                        {!isAnalyzing && videoDescription && (
                        <div className="space-y-6 text-sm">
                            <div>
                                <h4 className="font-semibold text-base">Description:</h4>
                                <p className="text-muted-foreground whitespace-pre-wrap">{videoDescription.description}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-base">Suggested Tags:</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {videoDescription.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                        )}
                        {!isAnalyzing && !videoDescription && (
                        <Alert variant="default">
                            <Video className="h-4 w-4" />
                            <AlertTitle>Ready to analyze?</AlertTitle>
                            <AlertDescription>
                                Upload a video on the left to get started.
                            </AlertDescription>
                        </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
