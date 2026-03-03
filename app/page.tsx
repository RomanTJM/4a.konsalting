"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Header from "@/components/Header";
import TariffCard from "@/components/TariffCard";
import Modal from "@/components/Modal";
import { Tariff } from "@/types/tariff";

export default function Home() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [checkboxError, setCheckboxError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const checkboxRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const res = await fetch("/api/tariffs");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Tariff[] = await res.json();
        setTariffs(data);
        const best = data.find((t) => t.is_best);
        if (best) setSelectedId(best.id);
        else if (data.length > 0) setSelectedId(data[0].id);
      } catch {
        setError("Не удалось загрузить тарифы");
      } finally {
        setLoading(false);
      }
    };
    fetchTariffs();
  }, []);

  const handleTimerExpire = useCallback(() => {
    setTimerExpired(true);
  }, []);

  const handleBuyClick = () => {
    if (!agreed) {
      setCheckboxError(true);
      if (checkboxRef.current) {
        checkboxRef.current.classList.add("consent-error");
        setTimeout(() => {
          checkboxRef.current?.classList.remove("consent-error");
        }, 400);
      }
      return;
    }
    setIsModalOpen(true);
  };

  const sortedTariffs = [...tariffs].sort((a, b) => {
    if (a.is_best && !b.is_best) return -1;
    if (!a.is_best && b.is_best) return 1;
    return b.full_price - a.full_price;
  });

  const bestTariff = sortedTariffs.find((t) => t.is_best);
  const regularTariffs = sortedTariffs.filter((t) => !t.is_best);

  if (!mounted) {
    return (
      <div
        className="page-bg"
        style={{ minHeight: "100vh", backgroundColor: "#232829" }}
        suppressHydrationWarning
      />
    );
  }

  return (
    <div suppressHydrationWarning style={{ width: '100%' }}>
      <Header onTimerExpire={handleTimerExpire} />

      <main className="page-bg" suppressHydrationWarning data-testid="main-content">
        <h1 className="section-title" suppressHydrationWarning>
          Выбери подходящий для себя <span className="title-accent" suppressHydrationWarning>тариф</span>
        </h1>

        <section className="pricing-section" suppressHydrationWarning>
          <img
            className="athlete-img"
            src="/images/athlete.webp"
            alt="Спортсмен"
            suppressHydrationWarning
          />

          <div className="plans-col" suppressHydrationWarning>
            {loading && (
              <p style={{ color: "white" }} suppressHydrationWarning>
                Загрузка...
              </p>
            )}
            {error && (
              <p style={{ color: "red" }} suppressHydrationWarning>
                {error}
              </p>
            )}

            {!loading && !error && (
              <>
                {bestTariff && (
                  <TariffCard
                    tariff={bestTariff}
                    isSelected={selectedId === bestTariff.id}
                    timerExpired={timerExpired}
                    onClick={() => setSelectedId(bestTariff.id)}
                  />
                )}

                <div className="plans-row" suppressHydrationWarning>
                  {regularTariffs.map((tariff) => (
                    <TariffCard
                      key={tariff.id}
                      tariff={tariff}
                      isSelected={selectedId === tariff.id}
                      timerExpired={timerExpired}
                      onClick={() => setSelectedId(tariff.id)}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="attention-box" suppressHydrationWarning>
              <svg
                className="alert-icon"
                width="24"
                height="26"
                viewBox="0 0 24 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                suppressHydrationWarning
              >
                <path d="M10.8775 16.6437C10.8869 17.2578 11.3885 17.75 12.0025 17.75C12.6166 17.75 13.1181 17.2531 13.1275 16.6437L13.5025 6.5375C13.526 6.15313 13.3853 5.77813 13.1135 5.4875C12.8228 5.17813 12.4197 5 12.0025 5C11.5853 5 11.1822 5.17813 10.8916 5.4875C10.6197 5.77813 10.4791 6.15313 10.5025 6.5375L10.8775 16.6437Z" fill="#FDB056" />
                <path d="M12 23C12.8284 23 13.5 22.3284 13.5 21.5C13.5 20.6716 12.8284 20 12 20C11.1716 20 10.5 20.6716 10.5 21.5C10.5 22.3284 11.1716 23 12 23Z" fill="#FDB056" />
              </svg>
              <p className="attention-text" suppressHydrationWarning>
                Следуя плану на 3 месяца и более, люди получают в 2 раза лучший результат, чем за 1 месяц
              </p>
            </div>

            <label className="consent-label" ref={checkboxRef} suppressHydrationWarning>
              <input
                type="checkbox"
                className="consent-checkbox"
                checked={agreed}
                onChange={() => {
                  setAgreed(!agreed);
                  if (!agreed) setCheckboxError(false);
                }}
                suppressHydrationWarning
              />
              <span className="consent-custom-box" suppressHydrationWarning>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  suppressHydrationWarning
                >
                  <path d="M29.0909 0H2.90911C1.30541 0 0 1.30466 0 2.90911V29.0909C0 30.6953 1.30541 32.0001 2.90911 32.0001H29.0909C30.6946 32.0001 32.0001 30.6954 32.0001 29.0909V2.90911C32 1.30466 30.6946 0 29.0909 0ZM30.5455 29.0909C30.5455 29.8928 29.8934 30.5455 29.0909 30.5455H2.90911C2.10655 30.5455 1.45459 29.8928 1.45459 29.0909V2.90911C1.45459 2.1073 2.10661 1.45459 2.90911 1.45459H29.0909C29.8935 1.45459 30.5455 2.1073 30.5455 2.90911V29.0909Z" fill="#606566" />
                  {agreed && (
                    <path d="M25.2852 9.29688C25.3589 9.21835 25.4799 9.20441 25.5693 9.25977L25.6055 9.28809C25.6959 9.37367 25.7004 9.51782 25.6143 9.60938L13.251 22.7002C13.2071 22.7466 13.148 22.7724 13.0859 22.7725H13.084C13.0351 22.7718 12.9891 22.7552 12.9512 22.7275L12.916 22.6963L6.37109 15.4238C6.2873 15.3307 6.29484 15.1871 6.3877 15.1035C6.4802 15.0203 6.62371 15.0253 6.71094 15.1211L12.7266 21.8057L13.0898 22.209L13.4619 21.8145L25.2842 9.29785L25.2852 9.29688Z" fill="#FDB056" stroke="#FDB056" />
                  )}
                </svg>
              </span>
              <span className="consent-text" suppressHydrationWarning>
                Я согласен с <a href="#" className="consent-link" suppressHydrationWarning>офертой рекуррентных платежей</a> и <a href="#" className="consent-link" suppressHydrationWarning>Политикой конфиденциальности</a>
              </span>
            </label>

            <button className="buy-btn" onClick={handleBuyClick} suppressHydrationWarning>
              Купить
            </button>

            <p className="fine-print" suppressHydrationWarning>
              Нажимая кнопку «Купить», Пользователь соглашается на разовое списание денежных средств для получения пожизненного доступа к приложению. Пользователь соглашается, что данные кредитной/дебетовой карты будут сохранены для осуществления покупок дополнительных услуг сервиса в случае желания пользователя.
            </p>

          </div>
        </section>

        <section className="guarantee-section" suppressHydrationWarning>
          <span className="guarantee-tag" suppressHydrationWarning>
            гарантия возврата 30 дней
          </span>
          <p className="guarantee-text" suppressHydrationWarning>
            Мы уверены, что наш план сработает для тебя и ты увидишь видимые результаты уже через 4 недели! Мы даже готовы полностью вернуть твои деньги в течение 30 дней с момента покупки, если ты не получишь видимых результатов.
          </p>
        </section>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tariff={tariffs.find((t) => t.id === selectedId) || null}
      />
    </div>
  );
}
