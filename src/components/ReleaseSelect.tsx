// SPDX-License-Identifier: GPL-3.0-or-later
import { useLocation } from "react-router-dom";
import { releaseLabel, setRelease, useRelease, useReleases } from "../release";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

// Pages about one replay, the upload, the administration and the static pages show nothing the release
// could narrow down, so the selector is left out there.
const WITHOUT_SELECTOR = ["/Replays/ReplayDetails", "/Replays/Upload", "/Administration", "/About", "/PrivacyPolicy"];

const ReleaseSelect = () => {
    const { pathname } = useLocation();
    const { token } = useAuth();
    const release = useRelease();
    const releases = useReleases(token);

    if (WITHOUT_SELECTOR.some(prefix => pathname.startsWith(prefix)))
        return null;

    return (
        <select
            aria-label={translate("Release.Label")}
            title={translate("Release.Label")}
            value={release ?? ""}
            onChange={e => setRelease(e.target.value === "" ? null : Number(e.target.value))}
            className="self-center bg-white border border-gray-700 rounded-sm p-1 mr-4 text-sm"
        >
            <option value="">{translate("Release.All")}</option>
            {releases.map(({ release: value, replays }) => <option key={value} value={value}>{releaseLabel(value)} ({replays})</option>)}
        </select>
    );
};

export default ReleaseSelect;
