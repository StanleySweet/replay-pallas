/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2025 Stanislas Daniel Claude Dolcini
 */

import { ReactNode } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

interface IReplayFiltersProps {
    civs: string[]
    maps: string[]
    civ?: string
    map?: string
    onCivChange: (value: string) => void
    onMapChange: (value: string) => void
}

// The lists come from the replays already loaded by the page, so the options
// are the values actually present instead of a hardcoded roster that goes stale.
const ReplayFilters = (props: IReplayFiltersProps): ReactNode => {
    return (<>
        <div className="mb-2 flex gap-2 items-center text-xs text-gray-600">
            <label className="flex items-center gap-1" htmlFor="replay-filter-civ">
                {translate("ReplayFilters.Civilization")}
                <select
                    id="replay-filter-civ"
                    value={props.civ ?? ""}
                    onChange={e => props.onCivChange(e.target.value)}
                    className="bg-white border border-gray-700 rounded-sm p-1"
                >
                    <option value="">{translate("ReplayFilters.All")}</option>
                    {props.civs.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </label>
            <label className="flex items-center gap-1" htmlFor="replay-filter-map">
                {translate("ReplayFilters.Map")}
                <select
                    id="replay-filter-map"
                    value={props.map ?? ""}
                    onChange={e => props.onMapChange(e.target.value)}
                    className="bg-white border border-gray-700 rounded-sm p-1"
                >
                    <option value="">{translate("ReplayFilters.All")}</option>
                    {props.maps.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </label>
        </div>
    </>);
};

export {
    ReplayFilters
};