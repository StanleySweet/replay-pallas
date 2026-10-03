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
    chartTheme,
    isDark,
    watchChartTheme
};

export type {
    IChartTheme,
    IDecorationOptions
};