/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Mentula
 */


import { ChartFrame } from "../components/LocalRatings/ChartFrame"
import { PlayerList } from "../components/LocalRatings/PlayerList"
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link } from "react-router-dom"
import { NavigationBar } from "../components/NavigationBar"
import { HouseIcon } from "../icons/HouseIcon";
import { useEffect, useState } from "react";
import { LocalRatingUser } from "../types/LocalRatingUser";
import { AboutFrame } from "../components/LocalRatings/AboutFrame";
import { InfoButton } from "../components/LocalRatings/InfoButton";

const LocalRatingsPage = (): JSX.Element => {
    const [user, setSelectedUser] = useState<LocalRatingUser>();

    useEffect(() => { }, [user])

    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="flex">
                <div className="mb-5 inline-flex items-center flex-grow " ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("LocalRatings.Title")}</div>
                <InfoButton text="About local ratings" />
            </div>
            <div id="panels" className="grid grid-cols-6 gap-x-5" >
                <div className="col-span-2">
                    <PlayerList onPlayerSelected={setSelectedUser} />
                </div>
                <div className="col-span-4">
                    <ChartFrame user={user} />
                    <AboutFrame />
                </div>
            </div>
        </div >
    </>)
}
export {
    LocalRatingsPage
}
