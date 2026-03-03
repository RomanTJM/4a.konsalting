"use client";

import { useEffect, useState } from "react";
import { Tariff } from "@/types/tariff";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    tariff: Tariff | null;
}

export default function Modal({ isOpen, onClose, tariff }: ModalProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
            const timer = setTimeout(() => setIsSuccess(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePay = () => {
        setIsSuccess(true);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {!isSuccess ? (
                    <>
                        <h2 className="modal-title">Оформление подписки</h2>
                        <div className="modal-info">
                            <p className="modal-period">Тариф: {tariff?.period}</p>
                            <p className="modal-price">{tariff?.price} ₽</p>
                        </div>
                        <div className="modal-buttons">
                            <button className="modal-pay-btn" onClick={handlePay}>
                                Оплатить
                            </button>
                            <button className="modal-close-btn" onClick={onClose}>
                                Отмена
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="success-content">
                        <div className="success-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="#1D5B43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h2 className="modal-title" style={{ marginBottom: '8px' }}>Спасибо за покупку!</h2>
                        <p style={{ color: 'var(--txt-gray)', marginBottom: '24px' }}>Ваш тариф активирован.</p>
                        <button className="modal-pay-btn" onClick={onClose}>
                            Закрыть
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
