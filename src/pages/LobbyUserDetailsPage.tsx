/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link, useParams } from "react-router-dom";
import { User } from "../types/User";
import { UserBlock } from "../components/UserBlock";
import { UserStatisticsBlock } from "../components/UserStatisticsBlock";
import { BlockTitle } from "../components/BlockTitle";
import { NavigationBar } from "../components/NavigationBar";
import { HouseIcon } from "../icons/HouseIcon";
import EUserRole from "../enumerations/EUserRole";
import { SearchReplayBar } from "../components/LocalRatings/SearchReplay";
import { ReplayContainer } from "../components/ReplayContainer";
import SaveIcon from "../icons/SaveIcon";


const LobbyUserDetailsPage = function (): JSX.Element {
    const { token, role } = useAuth();
    const [userDetails, setUserDetails] = useState<User>();
    const [isLoading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>();
    const [adminSelectValue, setSelectValue] = useState<EUserRole>();
    const { userId } = useParams();

    useEffect(() => {
        axios.get<undefined, AxiosResponse<User>>(`${import.meta.env.VITE_API_URL}/users/GetDetailsByLobbyUserId/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<User>) => {
            setUserDetails(response.data);
            setLoading(false);
        });
    }, [userId, token]);

    const onClick = () => {

        if(!adminSelectValue)
            return;

        axios.post(`${import.meta.env.VITE_API_URL}/users/set-permissions`, {
            id: userId,
            role: adminSelectValue
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<undefined>) => {
            if(response.status === 200 && userDetails && adminSelectValue)
            {
                userDetails.role = adminSelectValue as EUserRole;
                setUserDetails(JSON.parse(JSON.stringify(userDetails)));
            }
        });
    }


    if (isLoading || !userDetails) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }



    const user: User = userDetails as User;
    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon/>&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("UserDetails.Title")}</div>

            <div id="user-details-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                <BlockTitle titleKey="UserDetails.Title" />
                <UserBlock key={userId} user={user} ></UserBlock>
                <UserStatisticsBlock key={userId + "-statistics"} user={user} ></UserStatisticsBlock>
            </div>
                {
                    role !== EUserRole.ADMINISTRATOR || user.id === 0 ? <></> : <>
            <div id="user-details-container" className="text-sm p-6 mt-4 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>

                        <BlockTitle titleKey="UserDetails.ChangePermissions" />

                        <div className="d-flex flex">
                            <div className="flex">
                                <label htmlFor="countries" className="flex  text-sm font-medium text-gray-900">Select an option</label>
                                <select value={adminSelectValue} onChange={(evt) => setSelectValue(+evt.target.value as EUserRole)} id="countries" className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                    <option>Choose a permission</option>
                                    <option value={EUserRole.READER}>{EUserRole[EUserRole.READER]}</option>
                                    <option value={EUserRole.CONTRIBUTOR}>{EUserRole[EUserRole.CONTRIBUTOR]}</option>
                                    <option value={EUserRole.ADMINISTRATOR}>{EUserRole[EUserRole.ADMINISTRATOR]}</option>
                                </select>
                            </div>
                            <div className="flex-grow"></div>
                            <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                <SaveIcon/>
                                <span>{translate("UserDetails.SavePermissions")}</span>
                            </button>
                        </div>
            </div>
                    </>
                }

            <div className="mt-4"></div>
            {userDetails.replays.length ? <>
                <SearchReplayBar onChange={(evt) => { setFilter(evt.target.value) }} />
                <ReplayContainer filter={filter} maxItems={20} replays={userDetails.replays}></ReplayContainer>
            </>

                : <></>}

        </div>
    </>)
};

export {
    LobbyUserDetailsPage
}
