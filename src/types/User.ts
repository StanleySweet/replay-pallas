/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import EUserRole from "../enumerations/EUserRole";
import { ReplayListItem } from "./Replay";
import { Glicko2Rating } from "./Glicko2Rating";

export interface SeriesData {
    "x": string
    "y": number
}

export interface UserGraph {
    "current_game_elo"?: number
    "current_glicko_elo"?: Glicko2Rating
    "glicko_series": SeriesData[]
    "glicko_series_avg": SeriesData[]
    "game_series": SeriesData[]
    "game_series_avg": SeriesData[]
}

export interface User {
    "id": number
    "nick": string
    "role": EUserRole
    "AverageCPM": number
    "WinRateRatio": number
    "TotalPlayedTime": number
    "MatchCount": number
    "creation_date": Date
    "SecondMostUsedCmd": string
    "MostUsedCmd": string;
    "replays": ReplayListItem[]
    "graph": UserGraph
}
