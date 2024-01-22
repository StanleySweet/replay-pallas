/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link } from "react-router-dom";
import { Replay } from "../types/Replay";

interface IReplayBlockProps {
    replay: Replay;
}

const ReplayBlock = (props: IReplayBlockProps) => {
    return (
        <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9"}} >
            <h4><Link to={`/Replays/ReplayDetails/${props.replay.match_id}`}> <b>{props.replay.metadata.settings.Name || props.replay.metadata.settings.mapName}</b> ({props.replay.metadata.settings.PlayerData.map(a => a.NameWithoutRating).join(", ")})</Link></h4>
            <span className="text-gray-500 text-sm">
              <span>⚙️ Date: <i>{(new Date(props.replay.metadata.timestamp * 1000).toDateString())}</i></span>
            </span><br />
        </article>
    )
}

export {
    ReplayBlock
}
