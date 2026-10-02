/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2025 Stanislas Daniel Claude Dolcini
 */

import { ReactNode } from "react";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";

interface IReplayDateRangeProps {
    from?: string;
    to?: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
}

const ReplayDateRange = (props: IReplayDateRangeProps): ReactNode => {
    return (<>
        <div className="mb-2 flex gap-2 items-center text-xs text-gray-600">
            <label className="flex items-center gap-1" htmlFor="replay-filter-from">
                {translate("ReplayDateRange.From")}
                <input
                    type="date"
                    id="replay-filter-from"
                    value={props.from ?? ""}
                    onChange={e => props.onFromChange(e.target.value)}
                    className="bg-white border border-gray-700 rounded-sm p-1"
                />
            </label>
            <label className="flex items-center gap-1" htmlFor="replay-filter-to">
                {translate("ReplayDateRange.To")}
                <input
                    type="date"
                    id="replay-filter-to"
                    value={props.to ?? ""}
                    onChange={e => props.onToChange(e.target.value)}
                    className="bg-white border border-gray-700 rounded-sm p-1"
                />
            </label>
        </div>
    </>);
};

export {
    ReplayDateRange
};
