import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import EUserRole from "../enumerations/EUserRole";
import Avatar from "boring-avatars";
import { enable } from "../nightwind";
import { useEffect, useState } from "react";

const storageKey = 'nightwind-mode';
const getColorPreference = (): string => {
    const cache = localStorage.getItem(storageKey);
    if (cache)
        return cache;
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
};

const NavigationBar = () => {
    const { role, id, nick, onLogoutSession } = useAuth();
    const [lightMode, setLightMode] = useState<string>(getColorPreference());


    useEffect(() => {
        onClick();
    }, []);


    const loginBlock = nick && id && role ?
        <article className="mb-[1em] m-auto flex pt-3"  >
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <Link className="flex items-center text-sm space-x-4" to={`/UserDetails/${id}`}>
                        <Avatar
                            size={35}
                            name={nick}
                            variant="beam"
                            colors={['#e8be48', '#9a3334', '#480000', '#957531', '#1b1b1b']}
                        />
                    </Link>
                </div>
                <div className="flex-1 min-w-0">
                    <h4>
                        <Link className="flex items-center text-sm space-x-4" to={`/UserDetails/${id}`}>
                            <b className="flex-1 min-w-0">{nick}</b>
                        </Link>
                        <button className="text-gray-500 text-xs h-5 inline-flex items-center" onClick={() => { localStorage.clear(); onLogoutSession(); }}>
                            <svg height={16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.2929 14.2929C16.9024 14.6834 16.9024 15.3166 17.2929 15.7071C17.6834 16.0976 18.3166 16.0976 18.7071 15.7071L21.6201 12.7941C21.6351 12.7791 21.6497 12.7637 21.6637 12.748C21.87 12.5648 22 12.2976 22 12C22 11.7024 21.87 11.4352 21.6637 11.252C21.6497 11.2363 21.6351 11.2209 21.6201 11.2059L18.7071 8.29289C18.3166 7.90237 17.6834 7.90237 17.2929 8.29289C16.9024 8.68342 16.9024 9.31658 17.2929 9.70711L18.5858 11H13C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13H18.5858L17.2929 14.2929Z" fill="black" />
                                <path d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H14.5C15.8807 22 17 20.8807 17 19.5V16.7326C16.8519 16.647 16.7125 16.5409 16.5858 16.4142C15.9314 15.7598 15.8253 14.7649 16.2674 14H13C11.8954 14 11 13.1046 11 12C11 10.8954 11.8954 10 13 10H16.2674C15.8253 9.23514 15.9314 8.24015 16.5858 7.58579C16.7125 7.4591 16.8519 7.35296 17 7.26738V4.5C17 3.11929 15.8807 2 14.5 2H5Z" fill="black" />
                            </svg>  <i>Logout</i>
                        </button>
                    </h4>
                </div>
            </div>
        </article> : <></>;
    const onClick = () => {
        if (lightMode === "light") {
            enable(false);
            setLightMode("dark");
        }
        else if (lightMode === "dark") {
            enable(true);
            setLightMode("light");
        }
    };

    return (
        <div className="grid grid-cols-5 bg-white text-gray-900 shadow-md w-full">
            <div className=" "></div>
            <div className="flex-none col-span-3 flex gap-x-1 ">
                <Link to="/Home" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <span style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }} >{translate("NavigationBar.Home")}</span>
                </Link><Link to="/Replays" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }} >{translate("NavigationBar.Replays")}</div>
                </Link><Link to="/LocalRatings" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.LocalRatings")}</div>
                </Link>
                <Link to="/PrivacyPolicy" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.PrivacyPolicy")}</div>
                </Link>
                {
                    role >= EUserRole.CONTRIBUTOR ?
                        <Link to="/MyReplays" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                            <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.MyReplays")}</div>
                        </Link> :
                        <></>
                }
                <Link to="/About" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4" >
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.About")}</div>
                </Link>
                {
                    role === EUserRole.ADMINISTRATOR ?
                        <Link to="/Administration" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                            <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.Administration")}</div>
                        </Link> :
                        <></>
                }
            </div>
            <div className="col-span-1">
                <div className="flex">
                    <button className="theme-toggle" onClick={onClick} id="theme-toggle" title="Toggles light & dark" data-theme={lightMode} aria-label={lightMode} aria-live="polite">
                        {
                            lightMode === "light" ? <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                                <mask className="moon" id="moon-mask">
                                    <rect x="0" y="0" width="100%" height="100%" className="stroke-slate-50 fill-slate-50" />
                                    <circle cx="24" cy="10" r="6" className="stroke-slate-50 fill-slate-50" />
                                </mask>
                                <circle className="stroke-slate-50 fill-slate-50" cx="12" cy="12" r="6" mask="url(#moon-mask)" />
                                <g className="stroke-slate-50 fill-slate-50">
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />²
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </g>
                            </svg> :
                                <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                                    <mask className="moon" id="moon-mask">
                                        <rect x="0" y="0" width="100%" height="100%" className="stroke-white fill-white" />
                                        <circle cx="24" cy="10" r="6" className="stroke-black fill-black" />
                                    </mask>
                                    <circle className="stroke-black fill-black" cx="12" cy="12" r="6" mask="url(#moon-mask)" />
                                </svg>
                        }
                    </button>
                    {loginBlock}
                </div>

            </div>
            <hr className="w-full col-span-5" />
        </div>
    );
};

export {
    NavigationBar
};
