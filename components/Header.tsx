"use client";

import Timer from "./Timer";

interface HeaderProps {
    onTimerExpire: () => void;
}

export default function Header({ onTimerExpire }: HeaderProps) {
    return (
        <header className="offer-banner">
            <p className="offer-text">Успейте открыть пробную неделю</p>
            <Timer onExpire={onTimerExpire} />
        </header>
    );
}
