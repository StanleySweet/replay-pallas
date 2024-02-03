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
import { ReactNode, useEffect, useState } from "react";
import { HouseIcon } from "../icons/HouseIcon";
import { ManageAliasesBlock } from "../components/LocalRatings/ManageAliasesBlock";
import { ManageConfigurationBlock } from "../components/LocalRatings/ManageConfigurationBlock";
import { MaintenanceBlock } from "../components/MaintenanceBlock";

enum ETabType {
    LatestUsers,
    LocalRatingAliases,
    LocalRatingWeights,
    Maintenance,
}

const AdministrationPage = function () {
    const { role } = useAuth();
    const [tabType, setTabType] = useState<ETabType>(ETabType.LatestUsers);
    const navigate = useNavigate();

    useEffect(() => {
        if (role < EUserRole.ADMINISTRATOR) {
            navigate("/");
            return;
        }
    }, [role, navigate]);


    let panel: ReactNode;
    switch (tabType) {
        case ETabType.LatestUsers:
            panel = <LatestUserContainer />;
            break;
        case ETabType.LocalRatingAliases:
            panel = <ManageAliasesBlock />;
            break;
        case ETabType.LocalRatingWeights:
            panel = <ManageConfigurationBlock />;
            break;
        default:
            panel = <><MaintenanceBlock/></>;
            break;
    }

    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("AdministrationPage.Title")} </div>

            <WelcomeBlockAdministration />
            <div className="mt-4"></div>
            <div className="grid grid-cols-4 gap-x-1 mt-4 ">
                <div onClick={() => setTabType(ETabType.LatestUsers)} className={(tabType === ETabType.LatestUsers ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >{translate("LatestUser.Title")}</div>
                <div onClick={() => setTabType(ETabType.LocalRatingAliases)} className={(tabType === ETabType.LocalRatingAliases ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Local Rating Aliases</div>
                <div onClick={() => setTabType(ETabType.LocalRatingWeights)} className={(tabType === ETabType.LocalRatingWeights ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Local Rating Config</div>
                <div onClick={() => setTabType(ETabType.Maintenance)} className={(tabType === ETabType.Maintenance ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Maintenance</div>
            </div>
            {panel}
        </div>
    </>);
};

export {
    AdministrationPage
};
