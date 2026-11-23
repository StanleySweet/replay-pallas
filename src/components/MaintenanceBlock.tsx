import { ReactNode, useCallback, useEffect, useState } from "react";
import { BlockTitle } from "./BlockTitle";
import { useAuth } from "../contexts/Models/IAuthContext";
import axios from "axios";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { authHeaders } from "../utils";

// How far the replay metadata rebuild is. It runs in the background on the server.
interface RebuildStatus {
    state: "idle" | "reading" | "writing" | "finishing" | "done" | "failed"
    done: number
    total: number
    skipped: number
    error: string | null
}

const MaintenanceBlock = (): ReactNode => {
    const { token } = useAuth();
    const t = translate;
    const [status, setStatus] = useState<RebuildStatus>();
    const running = status?.state === "reading" || status?.state === "writing" || status?.state === "finishing";

    const fetchStatus = useCallback(() => axios.get<RebuildStatus>(`${import.meta.env.VITE_API_URL}/replays/rebuild-status`, {
        headers: authHeaders(token)
    }).then(response => setStatus(response.data)).catch(() => undefined), [token]);

    // A rebuild started earlier, from another tab or by someone else, is shown too.
    useEffect(() => { fetchStatus(); }, [fetchStatus]);
    useEffect(() => {
        if (!running)
            return;

        const timer = window.setInterval(fetchStatus, 1500);
        return () => window.clearInterval(timer);
    }, [running, fetchStatus]);

    const text = (key: Parameters<typeof translate>[0]): string => t(key) ?? "";
    const progressLabel = (current: RebuildStatus): string => {
        switch (current.state) {
            case "reading": return `${text("Maintenance.RebuildReading")} ${current.done} / ${current.total}`;
            case "writing": return text("Maintenance.RebuildWriting");
            case "finishing": return text("Maintenance.RebuildFinishing");
            case "failed": return `${text("Maintenance.RebuildFailed")} ${current.error ?? ""}`;
            default: return `${text("Maintenance.RebuildDone")} (${current.skipped} ${text("Maintenance.RebuildSkipped")})`;
        }
    };

    async function rebuild_rating_history(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/replays/rebuild-lobby-rank-history`, {
            headers: authHeaders(token)
        });
    }

    async function rebuild_glicko2_history(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/replays/rebuild-glicko-rank-history`, {
            headers: authHeaders(token)
        });
    }

    async function rebuild_replay_metadata(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        // 202: started. 409: one is already running, which is then the one to follow.
        const response = await axios.get<RebuildStatus>(`${import.meta.env.VITE_API_URL}/replays/rebuild-replay-metadata`, {
            headers: authHeaders(token),
            validateStatus: code => code === 202 || code === 409
        });
        setStatus(response.data);
    }

    async function vacuum_database(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/health/vacuum`, {
            headers: authHeaders(token)
        });
    }

    async function rebuild_local_ratings(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.post(`${import.meta.env.VITE_API_URL}/local-ratings/rebuild-database`, undefined , {
            headers: authHeaders(token)
        });
    }

    return (<>
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="Maintenance.Title" />
            <div className="flex gap-2 flex-wrap">
                <button onClick={vacuum_database} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>{t("Maintenance.Vacuum")}</span>
                </button>
                <button onClick={rebuild_glicko2_history} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>{t("Maintenance.RebuildGlicko")}</span>
                </button>
                <button onClick={rebuild_rating_history} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>{t("Maintenance.RebuildRatingHistory")}</span>
                </button>
                <button onClick={rebuild_replay_metadata} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>{t("Maintenance.RebuildReplayData")}</span>
                </button>
                <button onClick={rebuild_local_ratings} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>{t("Maintenance.RebuildLocalRating")}</span>
                </button>
            </div>
            {status && status.state !== "idle" &&
                <div className="mt-4 text-xs" role="status">
                    <div>{progressLabel(status)}</div>
                    {running &&
                        <div className="mt-1 h-2 w-full bg-gray-200 rounded-sm overflow-hidden">
                            <div className="h-2 bg-red-700" style={{ width: `${status.total ? Math.min(100, Math.round(100 * status.done / status.total)) : 0}%` }} />
                        </div>}
                </div>}
        </div>
    </>);
};



export {
    MaintenanceBlock
};
