/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { BlockTitle } from "./BlockTitle";

const WelcomeBlockAdministration = () : JSX.Element => {

    return (
        <div id="welcome-block-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="AdministrationPage.Title" />
            <div>
                <div>Welcome to the <a href="https://wildfiregames.com/" target="_blank" rel="noreferrer">Wildfire Games</a> Replay Pallàs' instance, where we store replays for <a href="https://play0ad.com/" target="_blank" rel="noreferrer">0 A.D.</a>, a free and open-source game of ancient warfare.</div>
                <br />
                <div>{translate("WelcomeBlockAdministration.IfYouWantToHelp")}<a href="http://gitea.wildfiregames.com/wiki/GettingStartedProgrammers" target="_blank" rel="noreferrer">Getting Started Programmers</a> on our Trac wiki.</div>
            </div>
        </div>
    );
};

export {
    WelcomeBlockAdministration
};
