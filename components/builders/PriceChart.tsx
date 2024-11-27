"use client";

import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { calculateChange, formatCurrency } from "@/libs/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceData {
  prices: [number, number][];
}

const timeRanges = {
  "15m": { days: 0.0104167, interval: "minute" },
  "1h": { days: 0.0416667, interval: "5minute" },
  "1D": { days: 1, interval: "hour" },
  "1W": { days: 7, interval: "day" },
} as const;

type TimeRange = keyof typeof timeRanges;

const PriceChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<{
    crypto1: number[];
    crypto2: number[];
    labels: string[];
  }>({ crypto1: [], crypto2: [], labels: [] });

  const fetchPriceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const days = timeRanges[timeRange].days;

      const [btcResponse, ethResponse] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}`
        ),
      ]);

      if (!btcResponse.ok || !ethResponse.ok) {
        throw new Error("Failed to fetch price data");
      }

      const [btcData, ethData]: [PriceData, PriceData] = await Promise.all([
        btcResponse.json(),
        ethResponse.json(),
      ]);

      const labels = btcData.prices.map(([timestamp]) => {
        const date = new Date(timestamp);
        switch (timeRange) {
          case "15m":
          case "1h":
            return date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });
          case "1D":
            return date.toLocaleTimeString("en-US", { hour: "2-digit" });
          case "1W":
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
        }
      });

      setPriceData({
        crypto1: btcData.prices.map(([, price]) => price),
        crypto2: ethData.prices.map(([, price]) => price),
        labels,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Error fetching price data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();

    const interval = setInterval(
      () => {
        fetchPriceData();
      },
      timeRange === "15m" ? 30000 : 60000
    );

    return () => clearInterval(interval);
  }, [timeRange]);

  const chartData = {
    labels: priceData.labels,
    datasets: [
      {
        label: "Bitcoin (USD)",
        data: priceData.crypto1,
        backgroundColor: "rgba(255, 99, 132, 0.8)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: timeRange === "1W" ? 12 : 8,
      },
      {
        label: "Ethereum (USD)",
        data: priceData.crypto2,
        backgroundColor: "rgba(53, 162, 235, 0.8)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
        borderRadius: 4,
        barThickness: timeRange === "1W" ? 12 : 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cryptocurrency Price Comparison",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        position: "left",
        ticks: {
          callback: function (value) {
            return new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number);
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  return (
    <>
      <div className="bg-background_light rounded-xl shadow-lg p-6 w-full max-w-4xl hidden">
        <div className="mb-6">
          <div className="flex space-x-2 mb-6">
            {Object.keys(timeRanges).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as TimeRange)}
                className={`
                px-4 py-2 rounded-md font-medium transition-all duration-200
                ${
                  timeRange === range
                    ? "bg-accent text-background_light shadow-md"
                    : "bg-gray-100 text-background_light hover:bg-gray-200"
                }
              `}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={fetchPriceData}
            disabled={isLoading}
            className={`
            px-4 py-2 rounded-md font-medium mb-4
            ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }
          `}
          >
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>

        <div className="h-[400px] relative">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-500 text-center">
                <p className="font-medium mb-2">Error loading data</p>
                <p className="text-sm text-gray-600">{error}</p>
                <button
                  onClick={fetchPriceData}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading price data...</p>
              </div>
            </div>
          ) : (
            <Bar options={chartOptions} data={chartData} />
          )}
        </div>
      </div>

      {/* Price statistics */}
      {!isLoading && !error && (
        <div className="mt-[3.4rem] grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Bitcoin</h3>
            <p className="text-gray-600">
              Current:{" "}
              {formatCurrency(priceData.crypto1[priceData.crypto1.length - 1])}
            </p>
            <p className="text-gray-600">
              24h Change: {calculateChange(priceData.crypto1)}%
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Ethereum</h3>
            <p className="text-gray-600">
              Current:{" "}
              {formatCurrency(priceData.crypto2[priceData.crypto2.length - 1])}
            </p>
            <p className="text-gray-600">
              24h Change: {calculateChange(priceData.crypto2)}%
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default PriceChart;
