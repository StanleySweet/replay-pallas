/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import axios, { AxiosResponse } from "axios";
import { ChartData, ChartOptions, Plugin, TooltipItem } from "chart.js";
import { useEffect, useState } from "react";
import "chart.js/auto";
import { Chart as ChartJS } from "react-chartjs-2";
import { useAuth } from "../../../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../../../contexts/Models/useTranslation";
import { LocalRatingUser } from "../../../types/LocalRatingUser";
import { authHeaders } from "../../../utils";
import { chartTheme, IDecorationOptions, IChartTheme, watchChartTheme } from "./chartTheme";

interface DistributionChartProps {
    user?: LocalRatingUser
    matchId?: string
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

/**
 * The original draws the baseline caps and the mean caption as overlay objects on
 * top of the chart canvas rather than as chart data, so they live in a plugin here
 * too. Chart.js has no per-side border width, which is the other reason a real
 * bar cannot carry the cap.
 */
const xmlDecorations: Plugin<"bar" | "line"> = {
    id: "xmlDecorations",
    afterDatasetsDraw(chart, _args, options: IDecorationOptions) {
        const { theme, mean, meanLabel } = options;
        const { ctx, chartArea } = chart;
        if (!chartArea)
            return;

        ctx.save();

        // distributionCap: a 2px tick under every bin, so empty bins stay visible.
        const bars = chart.getDatasetMeta(0).data;
        ctx.strokeStyle = theme.cap;
        ctx.lineWidth = 2;
        bars.forEach(bar => {
            ctx.beginPath();
            ctx.moveTo(bar.x, chartArea.bottom);
            ctx.lineTo(bar.x, chartArea.bottom + 2);
            ctx.stroke();
        });

        // distributionMeanText: the average, labelled on the axis at the mean.
        if (mean !== null) {
            const x = chart.scales.x.getPixelForValue(mean);
            ctx.fillStyle = theme.mutedText;
            ctx.font = "11px sans-serif";
            ctx.textAlign = x > chartArea.right - 60 ? "right" : "left";
            ctx.fillText(meanLabel, x + (x > chartArea.right - 60 ? -6 : 6), chartArea.top + 12);
        }

        ctx.restore();
    }
};

const toChartData = (response: DistributionChartResponse): ChartData<"bar" | "line", DistributionPoint[]> => {
    const bars = response.bins.map((bin): HistogramBar => ({
        x: (bin.rangeStart + bin.rangeEnd) / 2,
        y: bin.playerCount,
        rangeStart: bin.rangeStart,
        rangeEnd: bin.rangeEnd,
        tier: bin.tier,
        color: `rgba(${bin.color.replace(/\s+255$/, "")}, 0.85)`
    }));
    const maxCount = Math.max(...bars.map(bar => bar.y), 1);

    return {
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
            ...(response.showMean && response.mean !== null ? [{
                type: "line" as const,
                label: translate("DistributionChart.AverageRating"),
                data: [
                    { x: response.mean, y: 0 },
                    { x: response.mean, y: maxCount }
                ],
                parsing: false as const,
                pointRadius: 0,
                borderColor: "rgba(209, 174, 132, 1)",
                borderDash: [6, 6],
                borderWidth: 2
            }] : [])
        ]
    };
};

const buildOptions = (data: ChartData<"bar" | "line", DistributionPoint[]>, theme: IChartTheme, mean: number | null): ChartOptions<"bar" | "line"> => ({
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    parsing: false,
    plugins: {
        legend: {
            display: true,
            labels: { color: theme.text }
        },
        tooltip: {
            backgroundColor: theme.tooltipBackground,
            titleColor: theme.tooltipText,
            bodyColor: theme.tooltipText,
            borderColor: theme.grid,
            borderWidth: 1,
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
        },
        xmlDecorations: {
            theme,
            mean,
            meanLabel: `${translate("DistributionChart.AverageRating")}: ${mean === null ? "-" : mean.toFixed(2)}`
        }
    },
    scales: {
        x: {
            type: "linear",
            grid: { color: theme.grid },
            ticks: { color: theme.mutedText },
            title: {
                display: true,
                color: theme.text,
                text: translate("PlayerList.Rating")
            }
        },
        y: {
            beginAtZero: true,
            grid: { color: theme.grid },
            ticks: {
                precision: 0,
                color: theme.mutedText
            },
            title: {
                display: true,
                color: theme.text,
                text: translate("DistributionChart.PlayerCount")
            }
        }
    }
});

const DistributionChart = (props: DistributionChartProps): JSX.Element => {
    const { token } = useAuth();
    const [data, setData] = useState<ChartData<"bar" | "line", DistributionPoint[]>>();
    const [mean, setMean] = useState<number | null>(null);
    const [themeVersion, setThemeVersion] = useState(0);
    const byMatch = !props.user && !!props.matchId;

    useEffect(() => watchChartTheme(() => setThemeVersion(version => version + 1)), []);

    useEffect(() => {
        if (!props.user && !props.matchId) {
            setData(undefined);
            return;
        }

        const endpoint = byMatch
            ? `${import.meta.env.VITE_API_URL}/local-ratings/replay-distribution-data`
            : `${import.meta.env.VITE_API_URL}/local-ratings/distribution-data`;
        const body = byMatch
            ? { matchId: props.matchId }
            : { player: props.user?.user.nick, rank: props.user?.rank, players: props.user?.matches };

        axios.post<unknown, AxiosResponse<DistributionChartResponse>>(endpoint, body, {
            headers: authHeaders(token)
        }).then(response => {
            if (!response.data.bins.length) {
                setData(undefined);
                return;
            }

            setMean(response.data.mean);
            setData(toChartData(response.data));
        });
    }, [props.user, props.matchId, byMatch, token]);

    if (!props.user && !props.matchId)
        return <>{translate("App.SelectAPlayer")}</>;
    if (!data)
        return <>{translate("App.LoadingInProgress")}</>;

    const theme = chartTheme();

    return (
        <div className="h-[260px] w-full">
            <ChartJS type="bar" data={data} options={buildOptions(data, theme, mean)} plugins={[xmlDecorations]} key={themeVersion} />
        </div>
    );
};

export {
    DistributionChart
};