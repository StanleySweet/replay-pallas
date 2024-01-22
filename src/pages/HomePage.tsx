/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { LatestReplayContainer } from "../components/LatestReplayContainer";
import { NavigationBar } from "../components/NavigationBar";
import { WelcomeBlock } from "../components/WelcomeBlock";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { HouseIcon } from "../icons/HouseIcon";
const HomePage = function () {
    return (<>
        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">
            <div className="mb-5 inline-flex items-center" ><HouseIcon/>&nbsp;{translate("HomePage.Title")}</div>
            <WelcomeBlock />
            <div className="p-5"></div>
            <LatestReplayContainer />
        </div>
    </>)
}

export {
    HomePage
}
