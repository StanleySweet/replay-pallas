// SPDX-License-Identifier: GPL-3.0-or-later
import { RELEASES, releaseLabel, setRelease, useRelease } from "../release";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

const ReleaseSelect = () => {
    const release = useRelease();

    return (
        <select
            aria-label={translate("Release.Label")}
            title={translate("Release.Label")}
            value={release ?? ""}
            onChange={e => setRelease(e.target.value === "" ? null : Number(e.target.value))}
            className="self-center bg-white border border-gray-700 rounded-sm p-1 mr-4 text-sm"
        >
            <option value="">{translate("Release.All")}</option>
            {RELEASES.map(value => <option key={value} value={value}>{releaseLabel(value)}</option>)}
        </select>
    );
};

export default ReleaseSelect;
