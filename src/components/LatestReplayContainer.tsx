/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useEffect, useState } from "react";
import axios from 'axios';
import { ReplayBlock } from "./ReplayBlock";
import { ReplayListItem } from "../types/Replay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { useAuth } from "../contexts/Models/IAuthContext";
import { BlockTitle } from "./BlockTitle";

const LatestReplayContainer = (): JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();
    const [replays, setReplays] = useState<ReplayListItem[]>([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/replays/latest-list-items`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {

            setReplays(response.data);
            setLoading(false);
        });
    }, []);


    let body: JSX.Element;

    if (isLoading || !replays || replays.length === 0) {
        body = <div className="App">{translate("App.LoadingInProgress")}</div>;
    }
    else {
        body = <>
            {
                replays.map(r => <ReplayBlock key={r.matchId} replay={r} ></ReplayBlock>)
            }
        </>;

    }


    return (
        <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="LatestReplayContainer.Title" />
            <div className="w-full">
                {body}
            </div>
        </div>
    );
};

export {
    LatestReplayContainer
};
