/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import './HeaderBar.css'

const HeaderBar = function () : JSX.Element {
    return (
        <div id="header" className='select-none'>
            <a href="/"><img src="https://wildfiregames.com/img/logo.png" alt="Wildfire Games" /></a>
            <nav>
                <ul>
                    <li><a className='select-none' href="https://www.play0ad.com/">0 A.D.</a></li>
                    <li><a className='select-none' href="http://trac.wildfiregames.com/">Development</a></li>
                    <li><a className='select-none' href="https://www.wildfiregames.com/forum/">Forums</a></li>
                    <li><a className='select-none' href="https://www.wildfiregames.com/irc.html">Chat</a></li>
                </ul>
            </nav>
        </div>
    )
}

export {
    HeaderBar
}
