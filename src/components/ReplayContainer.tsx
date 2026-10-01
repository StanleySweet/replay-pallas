/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2025 Stanislas Daniel Claude Dolcini
 */

import { useEffect, useState } from "react";
import axios from 'axios';
import { ReplayBlock } from "./ReplayBlock";
import { ReplayListItem } from "../types/Replay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { useAuth } from "../contexts/Models/IAuthContext";
import { BlockTitle } from "./BlockTitle";
import { authHeaders } from "../utils";

interface IReplayContainerProps {
    replays?:ReplayListItem[]
    maxItems?: number
    filter?: string
}

const PAGE_SIZE = 100;

const ReplayContainer = (props : IReplayContainerProps) : JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const [replays, setReplays] = useState<ReplayListItem[]>(props.replays ?? []);
    const [limit, setLimit] = useState<number>(props.maxItems ?? PAGE_SIZE);
    const { token } = useAuth();

    useEffect(() => {
        if(!props.replays || !props.replays.length){
            axios.get(`${import.meta.env.VITE_API_URL}/replays/all`, {
                headers: authHeaders(token)
            }).then(response => {
                setReplays(response.data);
                setLoading(false);
            });
        }
        else{
            setLoading(false);
        }
    }, [token, props.replays]);

    // A new search should start from the top again, otherwise you search for
    // something with 3 hits, clear the box and are still stuck showing 3.
    useEffect(() => {
        setLimit(props.maxItems ?? PAGE_SIZE);
    }, [props.filter, props.maxItems]);


    if (isLoading) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    if (!replays || replays.length === 0) {
        return <div className="App">{translate("App.NoReplaysToDisplay")}</div>;
    }

    const matchedReplays = replays.filter(r => {
        if(!props.filter || props.filter.length < 3)
            return true;

        return r.matchId.toString().toLowerCase().includes(props.filter.toLowerCase()) ||
        r.playerNames.some(a => a.toLowerCase().includes(props.filter?.toLowerCase() ?? ""))  ||
        r.mapName?.toLowerCase().includes(props.filter.toLowerCase());
    });
    const filteredReplays = matchedReplays.slice(0, limit);
    const hiddenCount = matchedReplays.length - filteredReplays.length;

    if (!filteredReplays.length) {
        return (
            <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                <BlockTitle titleKey="ReplayContainer.Title" />
                <div className="text-sm text-gray-600">{translate("App.NoReplaysMatchFilter")}</div>
            </div>
        );
    }

    return (
        <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="ReplayContainer.Title" />

            <span className="text-left text-xs"><i>Showing <b>{filteredReplays.length}</b> out of <b>{replays.length}</b> replays. Use the search bar to see specific replays.</i></span>

            <div className="w-full h-[711px] overflow-y-scroll" >
                {
                    filteredReplays.map(r => <ReplayBlock key={r.matchId} replay={r} ></ReplayBlock>)
                }
            </div>

            {
                hiddenCount > 0 ?
                    <div className="mt-3 text-center">
                        <button
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            onClick={() => setLimit(l => l + PAGE_SIZE)}
                        >
                            {translate("ReplayContainer.ShowMore")}
                        </button>
                    </div> : <></>
            }
        </div>
    );
};

export {
    ReplayContainer
};
