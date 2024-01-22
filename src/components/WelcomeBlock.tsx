/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { BlockTitle } from "./BlockTitle";

const WelcomeBlock = () : JSX.Element => {

    return (
        <div id="welcome-block-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="HomePage.Title" />
            <div>
                <div>Welcome to the <a href="https://wildfiregames.com/" target="_blank" rel="noreferrer">Wildfire Games</a> Phabricator instance, where we build <a href="https://play0ad.com/" target="_blank" rel="noreferrer">0 A.D.</a>, a free and open-source game of ancient warfare.</div>
                <br />
                <div>If you want to help with the development, please take a look at <a href="http://trac.wildfiregames.com/wiki/GettingStartedProgrammers" target="_blank" rel="noreferrer">Getting Started Programmers</a> on our Trac wiki. You do not need an account here on Phabricator if you just want to play the development version of the game.</div>
            </div>
        </div>
    )
}

export {
    WelcomeBlock
}
