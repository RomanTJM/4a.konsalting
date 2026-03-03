"use client";

import { useEffect, useState, useRef } from "react";

interface TimerProps {
    onExpire: () => void;
}

export default function Timer({ onExpire }: TimerProps) {
    const INITIAL_SECONDS = 120;
    const [seconds, setSeconds] = useState(INITIAL_SECONDS);
    const [expired, setExpired] = useState(false);
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        intervalRef.current = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (seconds === 0 && !expired) {
            setExpired(true);
            const timeoutId = setTimeout(() => {
                onExpire();
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [seconds, expired, onExpire]);

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    const isWarning = seconds <= 30 && !expired;

    return (
        <div className="countdown-wrapper" suppressHydrationWarning data-testid="timer-wrapper">
            <span className="countdown-star" suppressHydrationWarning>✦</span>
            <span
                className={`countdown-time ${mounted && isWarning ? "timer-critical" : ""}`}
                suppressHydrationWarning
                data-testid="timer-display"
            >
                {!mounted ? "02:00" : formatted}
            </span>
            <span className="countdown-star" suppressHydrationWarning>✦</span>
        </div>
    );
}
