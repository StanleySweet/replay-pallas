/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";
import { useAuth } from "../../contexts/Models/IAuthContext";
import axios from "axios";
import { SearchPlayerBar } from "./SearchPlayer";
import { User } from "../../types/User";
import { UserBlock } from "../UserBlock";
import { BlockTitle } from "../BlockTitle";
import { LocalRatingUser } from "../../types/LocalRatingUser";
import { LocalRatingUserProfile } from "../../types/LocalRatingUserProfile";
import { LobbyUserBlock } from "../LobbyUserBlock";

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
    //     const search = request.params.searchValue;
    //     rows = rows.filter(x => x[4].toLowerCase().includes(search));

    //     // Sort rows according to table preferences
    //     const column = this.getColumn();
    //     const sortColumn = (a, b) => {
    //         return (column == "rank") ? b[0] - a[0] :
    //             (column == "rating") ? a[0] - b[0] :
    //                 (column == "matches") && (b[3] === a[3]) ? b[0] - a[0] :
    //                     (column == "matches") && (b[3] !== a[3]) ? b[3] - a[3] :
    //                         sortString_LocalRatings(b[4], a[4]);
    //     };
    //     rows.sort(sortColumn);

    //     // Set order according to table preferences
    //     const order = this.getColumnOrder();
    //     if (order > 0)
    //         rows.reverse();

    //     // Populate table with columns
    //     this.columns.forEach((x, i) => this.playerList["list_" + x] = rows.map(y => y[i]));
    //     this.playerList.selected = -1;
    //     // Change these last, otherwise crash
    //     this.playerList.list = this.playerList.list_playername;
    //     this.playerList.list_data = this.playerList.list_playername;
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
        console.log(user);
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
    else if(filteredUsers && filteredUsers.length) {
        body = <tbody className="w-full"> {
            filteredUsers.map((u, i) => <tr className="hover:bg-wfg hover:text-white hover:font-semibold" key={"user-" + i} onClick={(evt) => onPlayerSelected(evt, u)}><td className="text-center">{u.rank}</td><td className="text-center max-w-[8em] text-ellipsis overflow-hidden">{u.user.nick}</td><td className="text-center">{u.rating}</td><td className="text-center">{u.matches}</td></tr>)
        }</tbody>;
    }
    else
    {
        body = <tbody className="w-full"> {
            <tr><td className="text-center" colSpan={4}>No users found</td></tr>
        }</tbody>;
    }

    const onSearchBarChange = (evt: ChangeEvent<HTMLInputElement>) => {
        evt.preventDefault();
        const filter = evt.target.value;
        if (users?.length) {
            var rows = users.filter(a => Object.values(a).some(a => {
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
            <SearchPlayerBar onChange={onSearchBarChange} />
            <div className="max-h-[300px] overflow-y-scroll">
                <table>
                    <thead>
                        <tr>
                            <th className="p-2">{translate("PlayerList.Rank")}</th>
                            <th className="p-2">{translate("PlayerList.Player")}</th>
                            <th className="p-2">{translate("PlayerList.Rating")}</th>
                            <th className="p-2">{translate("PlayerList.Matches")}</th>
                        </tr>
                    </thead>
                    {body}
                </table>
            </div>

        </div>
        <div className="p-2"></div>
        <div id="player-detail-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="LatestUser.Title" />
            {
                userProfile ?
                    <div>
                        {
                            user ?
                                <LobbyUserBlock key={user.user.id} user={user.user} rank={userProfile.rankText} rankUserCount={users?.length}></LobbyUserBlock> :
                                ""
                        }
                        <div className="grid grid-cols-2">
                            <div>
                                <table>
                                    <thead><tr><th colSpan={2}>Score</th></tr></thead>
                                    <tbody>
                                        <tr><td>Current</td><td>{userProfile.currentRatingText}</td></tr>
                                        <tr><td>Highest</td><td>{userProfile.highestRatingText}</td></tr>
                                        <tr><td>Lowest</td><td>{userProfile.lowestRatingText}</td></tr>
                                        <tr><td>Average</td><td>{userProfile.averageRatingText}</td></tr>
                                        <tr><td>Avg deviation</td><td>{userProfile.ratingAverageDeviationText}</td></tr>
                                        <tr><td>Std deviation</td><td>{userProfile.ratingStandardDeviationText}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <table>
                                    <thead><tr><th colSpan={2}>Performance</th></tr></thead>
                                    <tbody>
                                        <tr><td>Last</td><td>{userProfile.lastPerformanceText}</td></tr>
                                        <tr><td>Best</td><td>{userProfile.bestPerformanceText}</td></tr>
                                        <tr><td>Worst</td><td>{userProfile.worstPerformanceText}</td></tr>
                                        <tr><td>Lowest</td><td>{userProfile.lowestRatingText}</td></tr>
                                        <tr><td>Avg deviation</td><td>{userProfile.averagePerformanceText}</td></tr>
                                        <tr><td>Std deviation</td><td>{userProfile.performanceStandardDeviationText}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    : ""
            }

        </div>
    </>
    )
}
export {
    PlayerList
}
