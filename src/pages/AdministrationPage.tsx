/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { Link, useNavigate } from "react-router-dom";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { LatestUserContainer } from "../components/LatestUsersContainer";
import { WelcomeBlockAdministration } from "../components/WelcomeBlockAdministration";
import { NavigationBar } from "../components/NavigationBar";
import { useAuth } from "../contexts/Models/IAuthContext";
import EUserRole from "../enumerations/EUserRole";
import { useEffect } from "react";
import { HouseIcon } from "../icons/HouseIcon";

const AdministrationPage = function () {
    const { role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (role < EUserRole.ADMINISTRATOR) {
            navigate("/")
            return;
        }
    }, [role, navigate]);

    return (<>
        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">
            <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("AdministrationPage.Title")} </div>


            <WelcomeBlockAdministration />
            <div className="mt-4"></div>
            <LatestUserContainer />
        </div>
    </>)
}

export {
    AdministrationPage
}
