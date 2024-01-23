import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import EUserRole from "../enumerations/EUserRole";
import Avatar from "boring-avatars";

const NavigationBar = () => {
    const { role, id, nick, onLogoutSession } = useAuth()
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

    return (
        <div className="grid grid-col-5 bg-white shadow-md w-full flex">
            <div className="flex-1 flex-grow"></div>
            <div className="flex-none col-span-3  w-3/5 mx-auto flex gap-x-1  d-flex ">
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
                <Link to="/About" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4" >
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.About")}</div>
                </Link>
                {
                    role === EUserRole.ADMINISTRATOR ?
                        <Link to="/Administration" className="m-auto flex flex-grow justify-center cursor-pointer py-2 px-4">
                            <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.Administration")}</div>
                        </Link> :
                        ""
                }
            </div>
            <div className="">
                {loginBlock}
            </div>
            <hr className="w-full col-span-5" />
        </div>
    );
}

export {
    NavigationBar
}
