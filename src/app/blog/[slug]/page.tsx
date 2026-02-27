
'use client';

import { Suspense } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { blogArticles } from "@/lib/blog";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function BlogPostPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const image = PlaceHolderImages.find(img => img.id === article.image);

  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <article className="container max-w-4xl px-4 sm:px-6 py-12 md:py-20">
            <div className="space-y-4 text-center">
                <h1 className="font-headline text-4xl font-extrabold tracking-tighter lg:text-5xl text-accent">
                    {article.title}
                </h1>
                <p className="text-muted-foreground md:text-xl">
                    {article.description}
                </p>
                <p className="text-sm text-muted-foreground">
                    Published on {article.date} by {article.author}
                </p>
            </div>
            {image && (
            <div className="relative my-8 h-96 w-full rounded-lg overflow-hidden border">
                <Image
                src={image.imageUrl}
                alt={article.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
                />
            </div>
            )}
            <div
            className="prose mx-auto mt-8 max-w-none prose-h2:font-headline prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-h2:text-accent prose-h3:text-accent"
            dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </article>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
