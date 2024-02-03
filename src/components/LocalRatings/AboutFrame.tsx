/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { ReactNode, useState } from "react";
import { RatingSystem } from "./About/RatingSystem";
import { FAQBlock } from "./About/FAQ";
import { Features } from "./About/Features";

enum ETabType {
    RatingSystem,
    Features,
    Faq
}

const AboutFrame = (): JSX.Element => {
    const [tabType, setTabType] = useState<ETabType>(ETabType.RatingSystem);

    let chart: ReactNode;
    switch (tabType) {
        case ETabType.RatingSystem:
            chart = <RatingSystem/>;
            break;
        case ETabType.Features:
            chart = <Features/>;
            break;
        default:
            chart = <FAQBlock/>;
            break;
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-x-1 mt-4 ">
                <div onClick={() => setTabType(ETabType.RatingSystem)} className={(tabType === ETabType.RatingSystem ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >The Rating System</div>
                <div onClick={() => setTabType(ETabType.Features)} className={(tabType === ETabType.Features ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Features</div>
                <div onClick={() => setTabType(ETabType.Faq)} className={(tabType === ETabType.Faq ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >F.A.Q</div>
            </div>
            <div className="text-sm p-6 h-[322px] bg-white shadow-md wfg-chart-tab ">
                <center> {chart}</center>
            </div>

        </>
    );
};

export {
    AboutFrame
};
