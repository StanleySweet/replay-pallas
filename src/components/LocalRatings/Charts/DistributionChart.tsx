/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import axios, { AxiosResponse } from "axios";
import { ChartData, ChartOptions, TooltipItem } from "chart.js";
import { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import { useAuth } from "../../../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../../../contexts/Models/useTranslation";
import { LocalRatingUser } from "../../../types/LocalRatingUser";

interface DistributionChartProps {
    user?: LocalRatingUser
}

interface HistogramBar {
    x: number
    y: number
    rangeStart: number
    rangeEnd: number
    tier: number
}

const BIN_COUNT = 20;
const LEFT_COLOR = [100, 100, 140] as const;
const RIGHT_COLOR = [100, 140, 100] as const;
const CURRENT_COLOR = "rgba(200, 180, 0, 0.95)";

function interpolateColor(index: number, count: number): string {
    const ratio = count <= 1 ? 0 : index / (count - 1);
    const red = Math.round((1 - ratio) * LEFT_COLOR[0] + ratio * RIGHT_COLOR[0]);
    const green = Math.round((1 - ratio) * LEFT_COLOR[1] + ratio * RIGHT_COLOR[1]);
    const blue = Math.round((1 - ratio) * LEFT_COLOR[2] + ratio * RIGHT_COLOR[2]);
    return `rgba(${red}, ${green}, ${blue}, 0.85)`;
}

function getHistogramBars(ratings: number[], binCount: number): HistogramBar[] {
    if (!ratings.length)
        return [];

    const min = ratings[0];
    const max = ratings[ratings.length - 1];

    if (min === max) {
        return [{
            x: min,
            y: ratings.length,
            rangeStart: min,
            rangeEnd: max,
            tier: 1
        }];
    }

    const safeBinCount = Math.min(binCount, ratings.length);
    const range = max - min;
    const step = range / safeBinCount;
    const bins = Array.from({ length: safeBinCount }, (_, index) => ({
        x: min + step * index + step / 2,
        y: 0,
        rangeStart: min + step * index,
        rangeEnd: index === safeBinCount - 1 ? max : min + step * (index + 1),
        tier: index + 1
    }));

    for (const rating of ratings) {
        let index = Math.floor((rating - min) / step);
        if (index >= bins.length)
            index = bins.length - 1;
        bins[index].y += 1;
    }

    return bins;
}

function getPlayerBinIndex(playerRating: number, bars: HistogramBar[]): number {
    if (!bars.length)
        return -1;

    const lastIndex = bars.length - 1;
    return bars.findIndex((bar, index) =>
        playerRating >= bar.rangeStart && (index === lastIndex || playerRating < bar.rangeEnd));
}

type DistributionPoint = HistogramBar | { x: number, y: number };

const DistributionChart = (props: DistributionChartProps): JSX.Element => {
    const { token } = useAuth();
    const [data, setData] = useState<ChartData<"bar" | "line", DistributionPoint[]>>();

    useEffect(() => {
        if (!props.user) {
            setData(undefined);
            return;
        }

        axios.get<LocalRatingUser[], AxiosResponse<LocalRatingUser[]>>(`${import.meta.env.VITE_API_URL}/local-ratings/users`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            const ratings = response.data
                .map(entry => Number.parseFloat(entry.rating))
                .filter((value): value is number => Number.isFinite(value))
                .sort((a, b) => a - b);

            const playerRating = Number.parseFloat(props.user?.rating ?? "");
            if (!ratings.length || !Number.isFinite(playerRating)) {
                setData(undefined);
                return;
            }

            const bars = getHistogramBars(ratings, BIN_COUNT);
            const playerBinIndex = getPlayerBinIndex(playerRating, bars);
            const mean = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
            const maxCount = Math.max(...bars.map(bar => bar.y), 1);

            setData({
                datasets: [
                    {
                        type: "bar",
                        label: translate("DistributionChart.PlayersInTier"),
                        data: bars,
                        parsing: false,
                        backgroundColor: bars.map((_, index) => index === playerBinIndex ? CURRENT_COLOR : interpolateColor(index, bars.length)),
                        borderColor: bars.map((_, index) => index === playerBinIndex ? "rgba(161, 98, 7, 1)" : interpolateColor(index, bars.length).replace("0.85", "1")),
                        borderWidth: 1,
                        barPercentage: 1,
                        categoryPercentage: 1
                    },
                    {
                        type: "line",
                        label: translate("DistributionChart.AverageRating"),
                        data: [
                            { x: mean, y: 0 },
                            { x: mean, y: maxCount }
                        ],
                        parsing: false,
                        pointRadius: 0,
                        borderColor: "rgba(209, 174, 132, 1)",
                        borderDash: [6, 6],
                        borderWidth: 2
                    }
                ]
            });
        });
    }, [props.user, token]);

    if (!props.user)
        return <>{translate("App.SelectAPlayer")}</>;
    if (!data)
        return <>{translate("App.LoadingInProgress")}</>;

    const options: ChartOptions<"bar" | "line"> = {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                callbacks: {
                    title: (items) => {
                        const raw = items[0]?.raw as HistogramBar | undefined;
                        return raw ? `${translate("DistributionChart.Tier")} ${raw.tier}` : "";
                    },
                    label: (item: TooltipItem<"bar" | "line">) => {
                        if (item.dataset.type !== "bar")
                            return `${translate("DistributionChart.AverageRating")}: ${item.parsed.x.toFixed(2)}`;

                        const raw = item.raw as HistogramBar;
                        const lowerBound = raw.rangeStart.toFixed(2);
                        const upperBound = raw.rangeEnd.toFixed(2);
                        const totalPlayers = (data.datasets[0].data as HistogramBar[]).reduce((sum, bar) => sum + bar.y, 0) || 1;
                        const percentage = ((raw.y / totalPlayers) * 100).toFixed(2);
                        return [
                            `${translate("DistributionChart.RatingRange")}: ${lowerBound} - ${upperBound}`,
                            `${translate("DistributionChart.PlayersInTier")}: ${raw.y} (${percentage}%)`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                type: "linear",
                title: {
                    display: true,
                    text: translate("PlayerList.Rating")
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                title: {
                    display: true,
                    text: translate("DistributionChart.PlayerCount")
                }
            }
        }
    };

    return (
        <div className="h-[260px] w-full">
            <Chart type="bar" data={data} options={options} />
        </div>
    );
};

export {
    DistributionChart
};
