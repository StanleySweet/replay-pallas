// SPDX-License-Identifier: GPL-3.0-or-later
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import { BlockTitle } from "../components/BlockTitle";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { useRelease, withRelease } from "../release";
import { authHeaders } from "../utils";

interface LeaderboardRow {
    lobby_player_id: number
    nick: string
    elo: number
    deviation: number
    match_count: number
}

// The Glicko rating of every player in the release picked in the navigation bar (every replay when
// none is picked), best first.
const LeaderboardPage = (): ReactNode => {
    const { token } = useAuth();
    const release = useRelease();
    const [rows, setRows] = useState<LeaderboardRow[]>();
    const [minGames, setMinGames] = useState<number>(5);
    const [conservative, setConservative] = useState<boolean>(true);

    useEffect(() => {
        setRows(undefined);
        const sort = conservative ? "conservative" : "rating";
        axios.get<LeaderboardRow[]>(withRelease(`${import.meta.env.VITE_API_URL}/replays/glicko-leaderboard?minGames=${minGames}&sort=${sort}`), {
            headers: authHeaders(token)
        }).then(response => setRows(response.data)).catch(() => setRows([]));
    }, [token, release, minGames, conservative]);

    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                <BlockTitle titleKey="Leaderboard.Title" />
                <div className="flex gap-4 mb-3 items-center">
                    <label>{translate("Leaderboard.MinGames")} <input type="number" min={1} value={minGames} onChange={e => setMinGames(Math.max(1, Number(e.target.value) || 1))} className="w-16 border border-gray-700 rounded-sm p-1" /></label>
                    <label><input type="checkbox" checked={conservative} onChange={e => setConservative(e.target.checked)} /> {translate("Leaderboard.Conservative")}</label>
                </div>
                {rows === undefined ? <div className="App">{translate("App.LoadingInProgress")}</div> :
                    rows.length === 0 ? <div>{translate("PlayerList.NoUsersOnRelease")}</div> :
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th>#</th>
                                    <th>{translate("Leaderboard.Player")}</th>
                                    <th className="text-right">{translate("Leaderboard.Rating")}</th>
                                    <th className="text-right">{translate("Leaderboard.Games")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => <tr key={row.lobby_player_id} style={{ borderTop: "1px solid #C7CCD9" }}>
                                    <td>{index + 1}</td>
                                    <td><Link to={`/LobbyUserDetails/${row.lobby_player_id}`}>{row.nick}</Link></td>
                                    <td className="text-right">{Math.round(row.elo)} ± {Math.round(row.deviation)}</td>
                                    <td className="text-right">{row.match_count}</td>
                                </tr>)}
                            </tbody>
                        </table>}
            </div>
        </div>
    </>);
};

export {
    LeaderboardPage
};
