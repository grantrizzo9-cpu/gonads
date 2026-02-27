
'use client';

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blogArticles } from "@/lib/blog";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookOpen } from "lucide-react";

export default function BlogIndexPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <div className="container max-w-6xl px-4 sm:px-6 py-12 md:py-20">
            <div className="space-y-4 text-center mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-4">
                    <BookOpen className="w-10 h-10"/>
                    The Rizzos Ai Blog
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Insights, strategies, and deep dives into the world of affiliate marketing, AI, and high-performance web infrastructure.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogArticles.map((article) => {
                const image = PlaceHolderImages.find(img => img.id === article.image);
                return (
                <Link href={`/blog/${article.slug}`} key={article.slug}>
                    <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
                    {image && (
                        <div className="relative h-48 w-full">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle className="font-headline text-xl text-accent">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{article.description}</CardDescription>
                         <p className="text-xs text-muted-foreground mt-4">{article.date} by {article.author}</p>
                    </CardContent>
                    </Card>
                </Link>
                );
            })}
            </div>
        </div>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
