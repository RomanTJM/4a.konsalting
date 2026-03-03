"use client";

import { Tariff } from "@/types/tariff";

interface TariffCardProps {
    tariff: Tariff;
    isSelected: boolean;
    timerExpired: boolean;
    onClick: () => void;
}

function calculateDiscount(price: number, fullPrice: number): number {
    return Math.round(((fullPrice - price) / fullPrice) * 100);
}

export default function TariffCard({
    tariff,
    isSelected,
    timerExpired,
    onClick,
}: TariffCardProps) {
    const discount = calculateDiscount(tariff.price, tariff.full_price);
    const isBest = tariff.is_best;

    return (
        <div
            className={`plan-card ${isBest ? "plan-card--featured" : "plan-card--secondary"} ${isSelected ? "selected" : ""}`}
            onClick={onClick}
        >
            <div className={`plan-badges-row ${timerExpired ? "opacity-0" : ""}`}>
                <div className="plan-sale-badge">
                    -{discount}%
                </div>
                {isBest && <div className="plan-hit-label">хит!</div>}
            </div>

            <div className="plan-card-content">
                <div className="plan-left-side">
                    <span className="plan-name">{tariff.period}</span>
                    <div className="plan-pricing">
                        <span className="plan-price">
                            {timerExpired ? tariff.full_price : tariff.price} ₽
                        </span>
                        <span className={`plan-old-price ${timerExpired ? "hidden" : ""}`}>
                            {tariff.full_price} ₽
                        </span>
                    </div>
                </div>

                <div className="plan-right-side">
                    <p className="plan-description desktop-text">{tariff.text}</p>
                    {tariff.mobileText && (
                        <p className="plan-description mobile-text">{tariff.mobileText}</p>
                    )}
                    {!tariff.mobileText && (
                        <p className="plan-description mobile-text">{tariff.text}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
