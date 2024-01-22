/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { User } from "../types/User";
import { toHHMMSS } from "../utils";

interface IUserBlockProps {
    user: User;
}

const UserStatisticsBlock = (props: IUserBlockProps) => {
    return (
        <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9" }} >
            <div className="grid grid-cols-2">
                <span className="text-sm">Average commands per minute:&nbsp;<b>{props.user.AverageCPM.toFixed(2)}</b></span>
                <span className="text-sm">Win rate ratio:&nbsp;<b>{props.user.WinRateRatio.toFixed(2)}</b></span>
                <span className="text-sm">Total played time:&nbsp;<b>{toHHMMSS(props.user.TotalPlayedTime + "")}</b></span>
                <span className="text-sm">Number of matches played:&nbsp;<b>{props.user.MatchCount}</b></span>
                <span className="text-sm">
                    Most used order: <b>{props.user.MostUsedCmd}</b>
                </span>
                <span className="text-sm">
                    Second most used order: <b>{props.user.SecondMostUsedCmd}</b>
                </span>
            </div>
        </article>
    )
}

export {
    UserStatisticsBlock
}
