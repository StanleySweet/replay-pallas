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
import PlusIcon from "../icons/PlusIcon";
const HomePage = function () {
    const { role } = useAuth();
    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="flex">
            <div className="mb-5 flex-grow inline-flex items-center" ><HouseIcon />&nbsp;{translate("HomePage.Title")} </div>                      {
                role > EUserRole.READER ?
                    <Link to="/Replays/Upload" className="inline-flex items-center mb-5">
                        <PlusIcon/>
                        <span>{translate("Replays.Upload")}</span>
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
