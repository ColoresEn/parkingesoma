"use client";

import axios from "axios";
import { Coin } from "@/types/Coin.interface";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const loadCriptos = async (): Promise<Coin[]> => {
  const { data } = await axios.get<Coin[]>(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  return data;
};

function CriptosPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCoins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setCoins(await loadCriptos());
    } catch (requestError) {
      console.error("Could not load market data:", requestError);
      setError("Market data is unavailable right now. Try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    loadCriptos()
      .then((data) => {
        if (active) setCoins(data);
      })
      .catch((requestError) => {
        if (active) {
          console.error("Could not load market data:", requestError);
          setError("Market data is unavailable right now. Try again in a moment.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="section-page page-frame crypto-page">
      <header className="section-intro">
        <div>
          <h1>Crypto market</h1>
          <p>Prices and daily movement, ranked by market capitalisation.</p>
        </div>
        {!isLoading && !error && (
          <p>Prices shown in US dollars. Market data updates on refresh.</p>
        )}
      </header>
      {error ? (
        <div className="empty-state" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="editorial-link editorial-link--primary"
            onClick={() => void refreshCoins()}
          >
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <p className="empty-state" role="status">Loading market data…</p>
      ) : (
        <div className="crypto-table-wrap">
          <table className="crypto-table" aria-label="Cryptocurrency market prices">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Asset</th>
                <th scope="col">Symbol</th>
                <th scope="col">Price</th>
                <th scope="col">24h change</th>
                <th scope="col">24h volume</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, index) => (
                <tr key={`${coin.symbol}-${coin.name}`}>
                  <td>{index + 1}</td>
                  <td className="crypto-asset">
                    <Image
                      src={coin.image}
                      alt=""
                      width={32}
                      height={32}
                      unoptimized
                      className="w-auto max-h-7"
                    />
                    <span>{coin.name}</span>
                  </td>
                  <td className="crypto-symbol">{coin.symbol.toUpperCase()}</td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumSignificantDigits: 7,
                    }).format(coin.current_price)}
                  </td>
                  <td
                    className={
                      coin.price_change_percentage_24h === null
                        ? undefined
                        : coin.price_change_percentage_24h >= 0
                          ? "crypto-positive"
                          : "crypto-negative"
                    }
                  >
                    {coin.price_change_percentage_24h === null
                      ? "—"
                      : `${coin.price_change_percentage_24h.toFixed(2)}%`}
                  </td>
                  <td>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 2,
                    }).format(coin.total_volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default CriptosPage;
