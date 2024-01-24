/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link } from "react-router-dom";
import { LatestReplayContainer } from "../components/LatestReplayContainer";
import { NavigationBar } from "../components/NavigationBar";
import { WelcomeBlock } from "../components/WelcomeBlock";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import EUserRole from "../enumerations/EUserRole";
import { HouseIcon } from "../icons/HouseIcon";
const HomePage = function () {
    const { role } = useAuth();
    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="flex">
            <div className="mb-5 flex-grow inline-flex items-center" ><HouseIcon />&nbsp;{translate("HomePage.Title")} </div>                      {
                role > EUserRole.READER ?
                    <Link to="/Replays/Upload" className="inline-flex items-center mb-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 60.364 60.364" className="w-3 h-3 mr-2">
                            <g>
                                <path d="M54.454,23.18l-18.609-0.002L35.844,5.91C35.845,2.646,33.198,0,29.934,0c-3.263,0-5.909,2.646-5.909,5.91v17.269   L5.91,23.178C2.646,23.179,0,25.825,0,29.088c0.002,3.264,2.646,5.909,5.91,5.909h18.115v19.457c0,3.267,2.646,5.91,5.91,5.91   c3.264,0,5.909-2.646,5.91-5.908V34.997h18.611c3.262,0,5.908-2.645,5.908-5.907C60.367,25.824,57.718,23.178,54.454,23.18z" />
                            </g>
                        </svg><span>{translate("Replays.Upload")}</span>
                    </Link> : ""
            }</div>
            <WelcomeBlock />
            <div className="mt-4"></div>
            <LatestReplayContainer />
        </div>
    </>)
}

export {
    HomePage
}
