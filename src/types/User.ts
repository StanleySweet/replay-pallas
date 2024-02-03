/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import EUserRole from "../enumerations/EUserRole";
import { Replay } from "./Replay";

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
    "replays": Replay[]
    "graph": any
}
