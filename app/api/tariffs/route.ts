import { Tariff } from "@/types/tariff";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://t-core.fit-hub.pro/Test/GetTariffs", {
            next: { revalidate: 60 },
        });

        if (!res.ok) throw new Error("Failed to fetch tariffs");

        const data: Tariff[] = await res.json();

        const figmaTexts: Record<string, string> = {
            "Навсегда": "Для тех, кто хочет всегда быть в форме и поддерживать здоровье",
            "3 месяца": "Привести тело в порядок",
            "1 месяц": "Чтобы получить первые результаты",
            "1 неделя": "Чтобы просто начать"
        };

        const figmaMobileTexts: Record<string, string> = {
            "Навсегда": "Всегда быть в форме",
            "1 месяц": "Получить первые результаты"
        };

        const uniqueData = data.map(tariff => ({
            ...tariff,
            id: `${tariff.id}-${tariff.is_best ? 'best' : 'reg'}`,
            text: figmaTexts[tariff.period] || tariff.text,
            mobileText: figmaMobileTexts[tariff.period] || undefined
        }));

        return NextResponse.json(uniqueData);
    } catch (error) {
        console.error("Error fetching tariffs:", error);
        return NextResponse.json({ error: "Failed to fetch tariffs" }, { status: 500 });
    }
}
