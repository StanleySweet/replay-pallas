/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link } from "react-router-dom";
import { ReplayListItem } from "../types/Replay";

interface IReplayBlockProps {
    replay: ReplayListItem;
}

const ReplayBlock = (props: IReplayBlockProps) => {
    console.log(props.replay.date);
    return (
        <article className="mb-[1em] pt-3" style={{ borderTop: "1px solid #C7CCD9"}} >
            <h4><Link to={`/Replays/ReplayDetails/${props.replay.matchId}`}> <b>{props.replay.mapName}</b> ({props.replay.playerNames.join(", ")})</Link></h4>
            <span className="text-gray-500 text-sm">
              <span>⚙️ Date: <i>{(new Date(props.replay.date).toDateString())}</i></span>
            </span><br />
        </article>
    );
};

export {
    ReplayBlock
};
