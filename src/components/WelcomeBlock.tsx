/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { BlockTitle } from "./BlockTitle";

const WelcomeBlock = () : JSX.Element => {
    return (
        <div id="welcome-block-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="HomePage.Title" />
            <div>
                <div>{translate("WelcomeBlock.WelcomeTextBeforeLink")} <a href="https://wildfiregames.com/" target="_blank" rel="noreferrer">Wildfire Games</a> {translate("WelcomeBlock.WelcomeTextAfterLink")} <a href="https://play0ad.com/" target="_blank" rel="noreferrer">0 A.D.</a>, {translate("WelcomeBlock.WelcomeTextTail")}</div>
                <br />
                <div>{translate("WelcomeBlock.HelpTextBeforeLink")} <a href="http://gitea.wildfiregames.com/wiki/GettingStartedProgrammers" target="_blank" rel="noreferrer">Getting Started Programmers</a> {translate("WelcomeBlock.HelpTextAfterLink")}</div>
            </div>
        </div>
    );
};

export {
    WelcomeBlock
};
