/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Replay } from "../types/Replay";
import { ReplayBlock } from "../components/ReplayBlock";
import { Link, useParams } from "react-router-dom";
import { User } from "../types/User";
import { UserBlock } from "../components/UserBlock";
import { UserStatisticsBlock } from "../components/UserStatisticsBlock";
import { BlockTitle } from "../components/BlockTitle";
import { NavigationBar } from "../components/NavigationBar";
import { HouseIcon } from "../icons/HouseIcon";


const UserDetailsPage = function (): JSX.Element {
    const { token } = useAuth();
    const [userDetails, setUserDetails] = useState<any>({});
    const [isLoading, setLoading] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        axios.get<any, AxiosResponse<any, any>>(`http://localhost:8080/users/GetDetails/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<any, any>) => {
            setUserDetails(response.data);
            setLoading(false);
        });
    }, []);

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
            <div className="p-5"></div>
            {userDetails.replays.length ? <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                <BlockTitle titleKey="ReplayContainer.Title" />
                <div className="w-full">
                    {
                        userDetails.replays.map((r: Replay) => <ReplayBlock key={r.match_id} replay={r} ></ReplayBlock>)
                    }
                </div>
            </div> : ""}
        </div>
    </>
    )
};

export {
    UserDetailsPage
}
