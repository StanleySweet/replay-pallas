/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useState } from 'react';
import './HeaderBar.css';
import { ExternalLinksIcon } from '../icons/ExternalLinksIcon';

const HeaderBar = function (): JSX.Element {
    const [isNavOpen, setIsNavOpen] = useState(false); // initiate isNavOpen state with false
    return (
        <div id="header" className='select-none flex'>
            <div className="justify-between">
                <nav>
                    <section className="MOBILE-MENU flex lg:hidden ">
                        <a className='flex-grow' href="/">
                            <img src="https://wildfiregames.com/img/logo.png" alt="Wildfire Games" />
                        </a>
                        <div className="HAMBURGER-ICON my-auto mt-[10px]" onClick={() => setIsNavOpen((prev) => !prev)}>
                            <ExternalLinksIcon />
                        </div>
                        <div className={isNavOpen ? "showMenuNav block w-full bg-white uppercase" : "hidden"}>
                            <div
                                className="CROSS-ICON  absolute top-0 right-0 px-4 py-5"
                                onClick={() => setIsNavOpen(false)}
                            >
                                <svg
                                    className="h-10 w-10 text-gray-600 stroke-gray-600"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <ul className="MENU-LINK-MOBILE-OPEN flex flex-col items-center text-gray-600 justify-between min-h-[250px]">
                                <ul>
                                    <li className='border-b-2 border-solid border-gray-300'><a className='select-none' href="https://www.play0ad.com/">0 A.D.</a></li>
                                    <li className='border-b-2 border-solid border-gray-300'><a className='select-none' href="http://trac.wildfiregames.com/">Development</a></li>
                                    <li className='border-b-2 border-solid border-gray-300'><a className='select-none' href="https://www.wildfiregames.com/forum/">Forums</a></li>
                                    <li className='border-b-2 border-solid border-gray-300'><a className='select-none' href="https://www.wildfiregames.com/irc.html">Chat</a></li>
                                </ul>
                            </ul>
                        </div>
                    </section>

                    <ul className="DESKTOP-MENU hidden space-x-8 lg:flex">
                        <div className='flex flex-grow'>
                            <a  href="/">
                                <img src="https://wildfiregames.com/img/logo.png" alt="Wildfire Games" />
                            </a>
                        </div>
                        <ul> 
                            <li><a className='select-none' href="https://www.play0ad.com/">0 A.D.</a></li>
                            <li><a className='select-none' href="http://trac.wildfiregames.com/">Development</a></li>
                            <li><a className='select-none' href="https://www.wildfiregames.com/forum/">Forums</a></li>
                            <li><a className='select-none' href="https://www.wildfiregames.com/irc.html">Chat</a></li>
                        </ul>
                    </ul>
                </nav>
                <style>{`
                    .showMenuNav {
                        position: absolute;
                        height: 100vh;
                        top: 0;
                        left: 0;
                        z-index: 10;
                        justify-content: space-evenly;
                        align-items: center;
                        font-size: 30pt;
                        font-weight: 900;
                    }
                    `}</style>
            </div>
        </div>
    );
};

export {
    HeaderBar
};
