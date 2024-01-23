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


const LobbyUserDetailsPage = function (): JSX.Element {
    const { token, role } = useAuth();
    const [userDetails, setUserDetails] = useState<User>();
    const [isLoading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>();
    const [adminSelectValue, setSelectValue] = useState<EUserRole>();
    const { userId } = useParams();

    useEffect(() => {
        axios.get<undefined, AxiosResponse<User>>(`http://localhost:8080/users/GetDetailsByLobbyUserId/${userId}`, {
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

        axios.post(`http://localhost:8080/users/set-permissions`, {
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
        <div className="w-3/5 mx-auto py-5">
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
                                <svg fill="#000000" height={15} className="mr-2" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 407.096 407.096" >
                                    <g>
                                        <g>
                                            <path d="M402.115,84.008L323.088,4.981C319.899,1.792,315.574,0,311.063,0H17.005C7.613,0,0,7.614,0,17.005v373.086    c0,9.392,7.613,17.005,17.005,17.005h373.086c9.392,0,17.005-7.613,17.005-17.005V96.032    C407.096,91.523,405.305,87.197,402.115,84.008z M300.664,163.567H67.129V38.862h233.535V163.567z" />
                                            <path d="M214.051,148.16h43.08c3.131,0,5.668-2.538,5.668-5.669V59.584c0-3.13-2.537-5.668-5.668-5.668h-43.08    c-3.131,0-5.668,2.538-5.668,5.668v82.907C208.383,145.622,210.92,148.16,214.051,148.16z" />
                                        </g>
                                    </g>
                                </svg>
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
