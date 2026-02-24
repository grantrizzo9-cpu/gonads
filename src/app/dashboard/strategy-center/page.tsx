import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { strategyArticles } from "@/lib/site";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookOpen } from "lucide-react";

export default function DashboardStrategyCenterPage() {
  return (
    <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="font-headline text-3xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8"/>
                Strategy Center
            </h1>
            <p className="text-muted-foreground">
              Deep-dive marketing guides to help you scale your network and maximize your daily income.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {strategyArticles.map((article) => {
            const image = PlaceHolderImages.find(img => img.id === article.image);
            return (
            <Link href={`/dashboard/strategy-center/${article.slug}`} key={article.slug}>
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
                </CardContent>
                </Card>
            </Link>
            );
        })}
        </div>
    </div>
  );
}
