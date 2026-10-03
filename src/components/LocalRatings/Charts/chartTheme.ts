/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

/**
 * Chart.js draws its own text, so Tailwind and nightwind never touch it: the
 * default tick colour is dark grey, which is unreadable on the dark panel the
 * chart tabs become. Every chart here therefore has to declare its own colours,
 * and has to re-read the theme so a toggle repaints it.
 */
import { ChartType } from "chart.js";

/** Per-plugin options for the distribution chart's XML-style decorations. */
interface IDecorationOptions {
    theme: IChartTheme
    mean: number | null
    meanLabel: string
    viewerRating: number | null
    viewerLabel: string | null
}

/** Lets `options.plugins.xmlDecorations` typecheck against our own plugin. */
declare module "chart.js" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- ChartType generic is required to match Chart.js.
    interface PluginOptionsByType<TType extends ChartType> {
        xmlDecorations?: IDecorationOptions;
    }
}

interface IChartTheme {
    dark: boolean
    text: string
    mutedText: string
    grid: string
    /** Baseline tick colour under each histogram bin. */
    cap: string
    tooltipBackground: string
    tooltipText: string
}

/**
 * The API hands out fixed bin colours interpolated between the game's
 * `colorbinleft` and `colorbinright` (both dark, e.g. "100 100 140 255"), which
 * were chosen for the light chart box in the original GUI. On the nightwind dark
 * panel they are effectively black, so bars have to be mixed toward white there.
 * Mixing rather than re-ramping keeps the tier gradient readable and leaves the
 * gold "current player" bins gold.
 */
const binColor = (color: string, theme: IChartTheme, alpha: number): string => {
    const [r, g, b] = color.trim().split(/\s+/).map(Number);
    if ([r, g, b].some(Number.isNaN))
        return color;

    const mix = theme.dark ? 0.45 : 0;
    const channel = (value: number): number => Math.round(value + (255 - value) * mix);
    return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha})`;
};

const isDark = (): boolean =>
    typeof document !== "undefined" &&
    (document.documentElement.classList.contains("dark") || document.documentElement.classList.contains("nightwind"));

/** Subscribes to the nightwind theme class so charts follow the toggle. */
const watchChartTheme = (onChange: () => void): (() => void) => {
    if (typeof document === "undefined" || typeof MutationObserver === "undefined")
        return () => undefined;

    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
};

const chartTheme = (): IChartTheme => {
    const dark = isDark();

    return {
        dark,
        text: dark ? "#e5e7eb" : "#111827",
        mutedText: dark ? "#9ca3af" : "#6b7280",
        grid: dark ? "rgba(229, 231, 235, 0.12)" : "rgba(17, 24, 39, 0.08)",
        cap: dark ? "rgba(229, 231, 235, 0.45)" : "rgba(17, 24, 39, 0.45)",
        tooltipBackground: dark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
        tooltipText: dark ? "#f3f4f6" : "#111827"
    };
};

export {
    binColor,
    chartTheme,
    isDark,
    watchChartTheme
};

export type {
    IChartTheme,
    IDecorationOptions
};