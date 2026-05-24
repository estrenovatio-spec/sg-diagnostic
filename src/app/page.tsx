import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Card className="max-w-md text-center shadow-lg">
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">SG Capital</p>
          <CardTitle className="text-2xl">Финансовая стратегия. Спокойствие. Наследие.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Пройдите мини-диагностику за 5–7 минут и получите персональный AI-отчёт с рекомендацией
            следующего шага.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/diagnostic">Начать диагностику</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
