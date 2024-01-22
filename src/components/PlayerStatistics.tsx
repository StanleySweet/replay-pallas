/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useState } from "react";
import { PlayerData } from "../types/Replay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link } from "react-router-dom";
import { BlockTitle } from "./BlockTitle";

interface IPlayerStatisticsProps {
    playerData: PlayerData[];
}

const emblems = {
    "ptol": "ptolemies",
    "cart": "carthaginians",
    "han": "han",
    "spart": "spartans",
    "mace": "macedonians",
    "rome": "romans",
    "athen": "athenians",
    "maur": "mauryas",
    "sele": "seleucids",
    "gaul": "celts",
    "brit": "celts",
    "iber": "iberians",
    "kush": "kushites",
    "pers": "persians",
}

type EmblemDictionary = typeof emblems;
type EmblemDictionaryKey = keyof EmblemDictionary;

const PlayerStatistics = (props: IPlayerStatisticsProps): JSX.Element => {
    const [playerData] = useState<PlayerData[]>(props.playerData);

    if (!playerData || !playerData.length) {
        return <></>;
    }

    return (<div>
        <div id="replay-detail-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="PlayerStatistics.Title" />

                {playerData.map((playerInfo, index) =>   <div className="mb-[1em] pt-3 grid grid-cols-2"  style={{ borderTop: "1px solid #C7CCD9" }}>

                    <article key={index} className="" >
                        <figcaption className="flex items-center space-x-4">
                            <img src={`https://cdn.jsdelivr.net/gh/0ad/0ad/binaries/data/mods/public/art/textures/ui/session/portraits/emblems/emblem_${emblems[playerInfo.Civ as EmblemDictionaryKey]}.png`} alt="" className="flex-none w-14 h-14 rounded-full object-cover" loading="lazy" decoding="async" />
                            <div className="flex-auto">
                                <div className="text-base font-semibold">
                                    <span className=""></span>
                                    <Link className="flex items-center space-x-4" to={`/LobbyUserDetails/${playerInfo.LobbyUserId}`}>
                                        <span style={{
                                            color: `rgb(${playerInfo.Color.r} ${playerInfo.Color.g} ${playerInfo.Color.b})`
                                        }}><b>{'\u25A0'}</b></span>&nbsp;{playerInfo.NameWithoutRating}&nbsp;{playerInfo.State === "won" ? "🏆" : ""}</Link>
                                </div>
                                {
                                    playerInfo.Team > -1 ?
                                        <div className="mt-0.5 text-sm">{translate("PlayerStatistics.Team")} {playerInfo.Team.toString()}</div> :
                                        <div className="mt-0.5 text-sm">{translate("PlayerStatistics.NoTeam")}</div>
                                }
                            </div>
                        </figcaption>
                    </article>
                    <article className="">
                        <span className="text-sm">
                            {translate("PlayerStatistics.Civilization")} <b>{playerInfo.Civ}</b>
                        </span><br />
                        <span className="text-sm">
                            {translate("PlayerStatistics.NumberOfOrdersGiven")} <b>{playerInfo.Commands?.length}</b>
                        </span><br />
                        <span className="text-sm">
                            {translate("PlayerStatistics.MostUsedOrder")} <b>{playerInfo.MostUsedCmd}</b>
                        </span><br />
                        <span className="text-sm">
                            {translate("PlayerStatistics.SecondMostUsedOrder")} <b>{playerInfo.SecondMostUsedCmd}</b>
                        </span><br />
                        <span className="text-sm">
                            {translate("PlayerStatistics.AverageCommandsPerMinute")} <b>{playerInfo.AverageCPM?.toFixed(2)}</b>
                        </span><br />
                    </article>
                    </div>
                )}

        </div>
    </div>
    )
}

export {
    PlayerStatistics
}
