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


    // Filter rows according to search entry
    // if (request.params) {
    //   const search = request.params.searchValue;
    //   rows = rows.filter(x => x[4].toLowerCase().includes(search));

    //   // Sort rows according to table preferences
    //   const column = this.getColumn();
    //   const sortColumn = (a, b) => {
    //     return (column == "rank") ? b[0] - a[0] :
    //       (column == "rating") ? a[0] - b[0] :
    //         (column == "matches") && (b[3] === a[3]) ? b[0] - a[0] :
    //           (column == "matches") && (b[3] !== a[3]) ? b[3] - a[3] :
    //             sortString_LocalRatings(b[4], a[4]);
    //   };
    //   rows.sort(sortColumn);

    //   // Set order according to table preferences
    //   const order = this.getColumnOrder();
    //   if (order > 0)
    //     rows.reverse();

    //   // Populate table with columns
    //   this.columns.forEach((x, i) => this.playerList["list_" + x] = rows.map(y => y[i]));
    //   this.playerList.selected = -1;
    //   // Change these last, otherwise crash
    //   this.playerList.list = this.playerList.list_playername;
    //   this.playerList.list_data = this.playerList.list_playername;
    // }

    useEffect(() => {
        axios.get(`http://localhost:8080/local-ratings/users`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data);
            setFilteredUsers(response.data);
            setLoading(false);
        });
    }, []);

    const onPlayerSelected = async (evt: React.MouseEvent<HTMLTableRowElement>, user: LocalRatingUser) => {
        evt.preventDefault();
        setUser(user);
        axios.post(`http://localhost:8080/local-ratings/player-profile`, {
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
                setUserProfile(response.data)
                props.onPlayerSelected?.(user);
            }
        });
    }


    let body: JSX.Element;
    if (isLoading || !users || !users.length) {
        body = <tbody className="w-full">
            <tr className="animate-pulse"><td colSpan={4}><div className="h-2 bg-gray-200 rounded-full w-60 mb-4"></div></td></tr>
            <tr className="animate-pulse"><td colSpan={4}><div className="h-2 bg-gray-200 rounded-full w-60 mb-4"></div></td></tr>
            <tr className="animate-pulse"><td colSpan={4}><div className="h-2 bg-gray-200 rounded-full w-60 mb-4"></div></td></tr>
            <tr className="animate-pulse"><td colSpan={4}><div className="h-2 bg-gray-200 rounded-full w-60 mb-4"></div></td></tr>
            <tr className="animate-pulse"><td colSpan={4}><div className="h-2 bg-gray-200 rounded-full w-60 mb-4"></div></td></tr>
        </tbody>
    }
    else if (filteredUsers && filteredUsers.length) {
        body = <tbody className="w-full">{
            filteredUsers.map((u) => <tr className="hover:bg-wfg hover:text-white hover:font-semibold odd:bg-white even:bg-gray-50 border-b " key={uid()} onClick={(evt) => onPlayerSelected(evt, u)}><td className="text-center">{u.rank}</td><td className="text-center max-w-[8em] text-ellipsis overflow-hidden">{u.user.nick}</td><td className="text-center">{u.rating}</td><td className="text-center">{u.matches}</td></tr>)
        }</tbody>;
    }
    else {
        body = <tbody className="w-full"><tr><td className="text-center" colSpan={4}>No users found</td></tr></tbody>;
    }

    const onSearchBarChange = (evt: ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const filter = evt.target.value;
        if (users?.length) {
            const rows = users.filter(a => Object.values(a).some(a => {
                if (!filter || !filter.length)
                    return true;

                const value = a + "";
                return value.includes(filter);
            }));


            setFilteredUsers(rows);
        }
    }

    return (<>
        <div id="player-list-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="PlayerList.Title" />
            <SearchPlayerBar onChange={onSearchBarChange} />
            <div className="max-h-[230px] overflow-y-scroll relative overflow-x-auto sm:rounded-md table-fixed">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr className="border-b">
                            <th className="px-2 text-center py-3">{translate("PlayerList.Rank")}</th>
                            <th className="px-2 text-center py-3">{translate("PlayerList.Player")}</th>
                            <th className="px-2 text-center py-3">{translate("PlayerList.Rating")}</th>
                            <th className="px-2 text-center py-3">{translate("PlayerList.Matches")}</th>
                        </tr>
                    </thead>{body}
                </table>
            </div>

        </div>
        <div className="p-2"></div>
        <div id="player-detail-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="PlayerPerformance.Title" />
            {
                userProfile ?
                    <div>
                        {
                            user ?
                                <LobbyUserBlock key={user.user.id} user={user.user} rank={userProfile.rankText} rankUserCount={users?.length}></LobbyUserBlock> :
                                <></>
                        }
                        <div className="relative overflow-x-auto sm:rounded-md" style={{ border: '1px solid' }}>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                                    <tr style={{ borderBottom: '1px solid' }}>
                                        <th className="text-center px-6 py-3" colSpan={2}>Score</th>
                                        <th className="text-center px-6 py-3" colSpan={2}>Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="odd:bg-white even:bg-gray-50 border-b">
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Current</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.currentRatingText}</td><td className="text-right" >Last</td><td className="font-bold text-center">{userProfile.lastPerformanceText}</td></tr>
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Highest</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.highestRatingText}</td><td className="text-right">Best</td><td className="font-bold text-center">{userProfile.bestPerformanceText}</td></tr>
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Lowest</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.lowestRatingText}</td><td className="text-right">Worst</td><td className="font-bold text-center">{userProfile.worstPerformanceText}</td></tr>
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Average</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.averageRatingText}</td><td className="text-right">Lowest</td><td className="font-bold text-center">{userProfile.lowestRatingText}</td></tr>
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Avg deviation</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.ratingAverageDeviationText}</td> <td className="text-right">Avg deviation</td><td className="font-bold text-center">{userProfile.averagePerformanceText}</td></tr>
                                    <tr className="odd:bg-white even:bg-gray-50 border-b "><td className="text-right">Std deviation</td><td className="font-bold text-center" style={{ borderRight: '1px solid' }}>{userProfile.ratingStandardDeviationText}</td><td className="text-right">Std deviation</td><td className="font-bold text-center">{userProfile.performanceStandardDeviationText}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    : <></>
            }

        </div>
    </>
    )
}
export {
    PlayerList
}
