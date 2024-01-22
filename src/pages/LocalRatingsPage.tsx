/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */

import { useState } from "react"
import { ChartFrame } from "../components/LocalRatings/ChartFrame"
import { InfoButton } from "../components/LocalRatings/InfoButton"
import { PlayerList } from "../components/LocalRatings/PlayerList"
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link } from "react-router-dom"
import { NavigationBar } from "../components/NavigationBar"
import { HouseIcon } from "../icons/HouseIcon";

const LocalRatingsPage = (): JSX.Element => {
    const [_, setSelectedUserId] = useState<any>();


    return (<>
        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">
            <div className="flex">
                <div className="mb-5 inline-flex items-center flex-grow " ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("LocalRatings.Title")}</div>

                <InfoButton text="About local ratings" />
            </div>
            <div id="panels" className="grid grid-cols-6 gap-x-5" >
                <div className="col-span-2">
                    <PlayerList onPlayerSelected={setSelectedUserId} />
                </div>
                <div className="col-span-4">
                    <ChartFrame />
                </div>
            </div>
        </div >
    </>)
}
export {
    LocalRatingsPage
}
