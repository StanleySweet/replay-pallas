/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";
import { useAuth } from "../../contexts/Models/IAuthContext";
import { SearchPlayerBar } from "./SearchPlayer";
import { BlockTitle } from "../BlockTitle";
import { LocalRatingUser } from "../../types/LocalRatingUser";
import { LocalRatingUserProfile } from "../../types/LocalRatingUserProfile";
import { LobbyUserBlock } from "../LobbyUserBlock";
import { uid } from "chart.js/helpers";

interface IPlayerListProps {
    onPlayerSelected?: (user: LocalRatingUser) => void
}

const PlayerList = (props: IPlayerListProps): JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState<LocalRatingUser[]>();
    const [filteredUsers, setFilteredUsers] = useState<LocalRatingUser[]>();
    const [user, setUser] = useState<LocalRatingUser>();
    const [userProfile, setUserProfile] = useState<LocalRatingUserProfile>();
    const { token } = useAuth();

    let body: JSX.Element;

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/local-ratings/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data);
            setFilteredUsers(response.data);
            setLoading(false);
        });
    }, [token]);

    const onPlayerSelected = async (evt: React.MouseEvent<HTMLTableRowElement>, user: LocalRatingUser) => {
        evt.preventDefault();
        setUser(user);
        axios.post(`${import.meta.env.VITE_API_URL}/local-ratings/player-profile`, {
            player: user.user.nick,
            rank: user.rank,
            players: user.matches
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.data) {
                setUserProfile(response.data);
                props.onPlayerSelected?.(user);
            }
        });
    };


    if (isLoading) {
        const id_array = [];
        for(let i = 0 ; i < 10; ++i){
            id_array.push("placeholder_" + i);
        }

        const data = id_array.map((a ) => (
            <tr key={a} className="odd:bg-white even:bg-gray-50 border-b animate-pulse">
            <td>
                <div className="h-2 bg-gray-400 rounded-full w-100 m-2">
                </div>
            </td>
            <td>
                <div className="h-2 bg-gray-400 rounded-full w-100 m-2">
                </div>
            </td>
            <td>
                <div className="h-2 bg-gray-400 rounded-full w-100 m-2">
                </div>
            </td>
            <td>
                <div className="h-2 bg-gray-400 rounded-full w-100 m-2">
                </div>
            </td>
        </tr>
        ));


        body = <tbody className="w-full">
         {data}
        </tbody>;
    }
    else if (users && users.length > 0 && filteredUsers && filteredUsers.length > 0) {
        body = <tbody className="w-full">{
            filteredUsers.map((u) => <tr key={uid()} className={u === user ?
                "bg-red-700 text-white font-semibold border-b" : "hover:bg-red-700 hover:text-white hover:font-semibold odd:bg-white even:bg-gray-50 border-b"
            } onClick={(evt) => onPlayerSelected(evt, u)}><td className="text-center">{u.rank}</td><td className="text-left max-w-[3em] text-ellipsis overflow-hidden" title={u.user.nick}>{u.user.nick}</td><td className="text-center">{u.rating}</td><td className="text-center">{u.matches}</td></tr>)
        }</tbody>;
    }
    else {
        body = <tbody className="w-full"><tr className={
            "hover:bg-red-700 hover:text-white hover:font-semibold odd:bg-white even:bg-gray-50 border-b"
        }><td className="text-center" colSpan={4}>No users found</td></tr></tbody>;
    }

    const onSearchBarChange = (evt: ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const filter = evt.target.value;
        if (users?.length) {
            const rows = users.filter(a => Object.values(a).some(b => {
                if (!filter || !filter.length)
                    return true;

                
                const value = JSON.stringify(b);
                return value.toLowerCase().includes(filter.toLowerCase());
            }));


            setFilteredUsers(rows);
        }
    };

    return (<>
        <div id="player-list-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="PlayerList.Title" />
        </div>
        <div className="mt-2">        <SearchPlayerBar onChange={onSearchBarChange} /></div>
        <div className=" mt-2 relative overflow-x-auto sm:rounded-md text-sm shadow-md" style={{ border: "1px solid", borderRadius: "4px" }} >
            <div className="relative max-h-[216px] min-h-[216px] overflow-auto sm:rounded-md table-fixed bg-gray-50">
                <table className="text-xs w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-gray-700 uppercase bg-gray-50 ">
                        <tr className="border-b">
                            <th className="px-2 text-center py-3" title={translate("PlayerList.Rank")}>{translate("PlayerList.RankColumn")}</th>
                            <th className="px-2 text-center py-3" title={translate("PlayerList.Player")}>{translate("PlayerList.Player")}</th>
                            <th className="px-2 text-center py-3 max-w-[3em] text-ellipsis overflow-hidden" title={translate("PlayerList.Rating")}>{translate("PlayerList.Rating")}</th>
                            <th className="px-2 text-center py-3" title={translate("PlayerList.Matches")}>{translate("PlayerList.Matches")}</th>
                        </tr>
                    </thead>{body}
                </table>
            </div>
        </div>

        <div className="p-2"></div>
        {
            userProfile ?
                <>
                    <div className="relative overflow-x-auto sm:rounded-md text-sm shadow-md" style={{ border: "1px solid", borderRadius: "4px" }} >
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                                <tr style={{ borderBottom: '1px solid' }}>
                                    <th className="text-center px-6 py-3" colSpan={2}>Score</th>
                                    <th className="text-center px-6 py-3" colSpan={2}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Current</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.currentRatingText}</td>
                                    <td className="text-right" >Last</td><td className="font-bold text-center">{userProfile.lastPerformanceText}</td>
                                </tr>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Highest</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.highestRatingText}</td>
                                    <td className="text-right">Best</td><td className="font-bold text-center">{userProfile.bestPerformanceText}</td></tr>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Lowest</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.lowestRatingText}</td>
                                    <td className="text-right">Worst</td><td className="font-bold text-center">{userProfile.worstPerformanceText}</td></tr>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Average</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.averageRatingText}</td>
                                    <td className="text-right">Lowest</td><td className="font-bold text-center">{userProfile.lowestRatingText}</td></tr>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Avg deviation</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.ratingAverageDeviationText}</td>
                                    <td className="text-right">Avg deviation</td><td className="font-bold text-center">{userProfile.averagePerformanceText}</td></tr>
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <td className="text-right">Std deviation</td>
                                    <td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.ratingStandardDeviationText}</td>
                                    <td className="text-right">Std deviation</td><td className="font-bold text-center">{userProfile.performanceStandardDeviationText}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="player-detail-container" className="text-sm mt-4  p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                        <BlockTitle titleKey="PlayerPerformance.Title" />
                        <div>
                            {
                                user ?
                                    <LobbyUserBlock key={user.user.id} user={user.user} rank={userProfile.rankText} rankUserCount={users?.length}></LobbyUserBlock> :
                                    <></>
                            }
                        </div>
                    </div>
                </>
                : <></>
        }
    </>
    );
};
export {
    PlayerList
};
