/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link } from "react-router-dom";
import { ReplayListItem } from "../types/Replay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

interface IReplayBlockProps {
    replay: ReplayListItem;
}

const ReplayBlock = (props: IReplayBlockProps) => {
    return (
        <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9"}} >
            <h4><Link to={`/Replays/ReplayDetails/${props.replay.matchId}`}> <b>{props.replay.mapName}</b> ({props.replay.playerNames.join(", ")})</Link></h4>
            <span className="text-gray-500 text-sm">
              <span>⚙️ Date: <i>{props.replay.date}</i></span>
            </span><br />
            {
                props.replay.mods.length ?
                    <span className="text-gray-500 text-sm block">
                        🧩 {translate("ReplayBlock.Mods")}: <i>{props.replay.mods.join(", ")}</i>
                    </span> : <></>
            }
        </article>
    );
};

export {
    ReplayBlock
};
