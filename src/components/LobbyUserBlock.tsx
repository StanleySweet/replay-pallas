/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link } from "react-router-dom";
import { User } from "../types/User";
import Avatar from "boring-avatars";
import EUserRole from "../enumerations/EUserRole";
import { LocalRatingRank } from "../types/LocalRatingRank";

interface IUserBlockProps {
    user: User;
    rankUserCount?: number;
    rank?: LocalRatingRank
}

const LobbyUserBlock = (props: IUserBlockProps) => {
    let color = "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300"
    if (props.user.role === EUserRole.CONTRIBUTOR) {
        color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    }
    else if (props.user.role === EUserRole.ADMINISTRATOR) {
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    }

    return (
        <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9" }} >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <Avatar
                        size={40}
                        name={props.user.nick}
                        variant="beam"
                        colors={['#e8be48', '#9a3334', '#480000', '#957531', '#1b1b1b']}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h4>{props.user.id !== 0 ?
                        <Link className="flex items-center space-x-4" to={`/LobbyUserDetails/${props.user.id}`}> <b className="flex-1 min-w-0">{props.user.nick}</b><span className={`ml-3 ${color} text-xs font-medium me-2 px-2.5 py-0.5 rounded`}>{EUserRole[props.user.role]}</span></Link> :
                        <div className="flex items-center space-x-4"><b className="flex-1 min-w-0">{props.user.nick}</b><span className={`ml-3 ${color} text-xs font-medium me-2 px-2.5 py-0.5 rounded`}>{EUserRole[props.user.role]}</span></div>
                    }
                    </h4>
                    <span className="text-gray-500 text-sm">
                        <span>⚙️ Date: <i>{new Date(props.user.creation_date).toDateString()}</i></span>
                    </span><br />
                    {
                        props.rank ? <>
                            <span className="text-gray-500 text-sm">
                                <span>🎯 Rank: <i>{props.rank.rank} / {props.rankUserCount}</i></span>
                            </span><br /></> :
                            ""
                    }
                </div>
            </div>
        </article>
    )
}

export {
    LobbyUserBlock
}
