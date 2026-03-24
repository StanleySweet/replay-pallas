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
    color: string
}

interface DistributionChartBin {
    tier: number
    rangeStart: number
    rangeEnd: number
    playerCount: number
    isCurrentPlayerTier: boolean
    color: string
}

interface DistributionChartResponse {
    bins: DistributionChartBin[]
    mean: number | null
    showMean: boolean
    currentRating: number
    playerCount: number
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

        axios.post<LocalRatingUser, AxiosResponse<DistributionChartResponse>>(`${import.meta.env.VITE_API_URL}/local-ratings/distribution-data`, {
            player: props.user.user.nick,
            rank: props.user.rank,
            players: props.user.matches
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            if (!response.data.bins.length) {
                setData(undefined);
                return;
            }

            const bars = response.data.bins.map((bin): HistogramBar => ({
                x: (bin.rangeStart + bin.rangeEnd) / 2,
                y: bin.playerCount,
                rangeStart: bin.rangeStart,
                rangeEnd: bin.rangeEnd,
                tier: bin.tier,
                color: `rgba(${bin.color.replace(/\s+255$/, "")}, 0.85)`
            }));
            const maxCount = Math.max(...bars.map(bar => bar.y), 1);

            setData({
                datasets: [
                    {
                        type: "bar",
                        label: translate("DistributionChart.PlayersInTier"),
                        data: bars,
                        parsing: false as const,
                        backgroundColor: bars.map(bar => bar.color),
                        borderColor: bars.map(bar => bar.color.replace("0.85", "1")),
                        borderWidth: 1,
                        barPercentage: 1,
                        categoryPercentage: 1
                    },
                    ...(response.data.showMean && response.data.mean !== null ? [{
                        type: "line" as const,
                        label: translate("DistributionChart.AverageRating"),
                        data: [
                            { x: response.data.mean, y: 0 },
                            { x: response.data.mean, y: maxCount }
                        ],
                        parsing: false as const,
                        pointRadius: 0,
                        borderColor: "rgba(209, 174, 132, 1)",
                        borderDash: [6, 6],
                        borderWidth: 2
                    }] : [])
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
