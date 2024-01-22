/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useEffect, useState } from "react";
import axios from 'axios';
import { ReplayBlock } from "./ReplayBlock";
import { Replay } from "../types/Replay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { useAuth } from "../contexts/Models/IAuthContext";
import { BlockTitle } from "./BlockTitle";

interface IReplayContainerProps {
    replays?:Replay[]
}

const ReplayContainer = (props : IReplayContainerProps) : JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const [replays, setReplays] = useState<Replay[]>(props.replays ?? []);
    const { token } = useAuth();

    useEffect(() => {
        axios.get(`http://localhost:8080/replays/all`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setReplays(response.data);
            setLoading(false);
        });
    }, []);


    if (isLoading) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    if (!replays || replays.length === 0) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    return (
        <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="ReplayContainer.Title" />
            <div className="w-full">
                {
                    replays.map(r => <ReplayBlock key={r.match_id} replay={r} ></ReplayBlock>)
                }
            </div>
        </div>
    );
};

export {
    ReplayContainer
}
