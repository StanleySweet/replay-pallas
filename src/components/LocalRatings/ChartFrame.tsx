/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { ReactNode, useState } from "react";
import { CivilizationChart } from "./Charts/CivilizationChart";
import { DistributionChart } from "./Charts/DistributionChart";
import { EvolutionChart } from "./Charts/EvolutionChart";
import { LocalRatingUser } from "../../types/LocalRatingUser";

enum ETabType {
    Evolution,
    Civilization,
    Distribution
}


interface IChartFrameProps {
    user?: LocalRatingUser
}


const ChartFrame = (props: IChartFrameProps): JSX.Element => {
    const [tabType, setTabType] = useState<ETabType>(ETabType.Evolution);

    let chart: ReactNode;
    switch (tabType) {
        case ETabType.Civilization:
            chart = <CivilizationChart user={props.user} />;
            break;
        case ETabType.Distribution:
            chart = <DistributionChart />;
            break;
        default:
            chart = <EvolutionChart user={props.user} />;
            break;
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-x-1  ">
                <div onClick={() => setTabType(ETabType.Evolution)} className={(tabType === ETabType.Evolution ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Evolution</div>
                <div onClick={() => setTabType(ETabType.Civilization)} className={(tabType === ETabType.Civilization ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Civilization</div>
                <div onClick={() => setTabType(ETabType.Distribution)} className={(tabType === ETabType.Distribution ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Distribution</div>
            </div>
            <div className="text-sm p-6 min-h-[330px] max-h-[330px]  bg-white shadow-md  wfg-chart-tab ">
                <center className="max-h-[281px] "> {chart}</center>
            </div>

        </>
    );
};

export {
    ChartFrame
};
