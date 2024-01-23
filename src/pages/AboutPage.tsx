/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { ReactNode } from "react";
import { BlockTitle } from "../components/BlockTitle";
import { Link } from "react-router-dom";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { NavigationBar } from "../components/NavigationBar";
import { HouseIcon } from "../icons/HouseIcon";

const AboutPage = (): ReactNode => {
    return (<>
        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">

            <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon/>&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("AboutPage.Title")}</div>

            <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>

                <div />
                <BlockTitle titleKey="AboutPage.Title"></BlockTitle>

                <h3 className="font-semibold mt-1 mb-1">Goal</h3>
                <p className="text-justify">
                    This website aims to help players share their 0 A.D. Empires Ascendant replays in an attempt to make them more easily accessible. In the future, it might be possible to export replays directly from the game.
                </p>
                <h3 className="font-semibold mt-1 mb-1">Sources</h3>
                <p className="text-justify">
                    Replay Scrapper (Github): <a href="https://github.com/StanleySweet/replay-pallas-scrapper">here</a> <br/>
                    Replay Pallas API (Github): <a href="https://github.com/StanleySweet/replay-pallas">here</a> <br/>
                    Replay Pallas Front (Github): <a href="https://github.com/StanleySweet/replay-pallas-api">here</a> <br/>
                    Local Ratings source (Gitlab): <a href="https://gitlab.com/mentula0ad/LocalRatings">here</a><br/>
                    Local Ratings Thread (Forums): <a href="https://wildfiregames.com/forum/topic/80151-localratings-mod-evaluate-players-skills-based-on-previous-games/#comment-497805">here</a><br/>
                </p>
                <h3 className="font-semibold mt-1 mb-1">Credits</h3>
                <p className="text-justify">
                    © 2023-2024 Stanislas Daniel Claude Dolcini<br/>
                    © 2024 Mentula for the awesome local rating mod. <br/>
                    © 2024 z0rg for React tips. <br/>
                </p>
            </div>
            <div />
        </div>
    </>
    );
}

export {
    AboutPage
}
