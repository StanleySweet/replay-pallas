import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import EUserRole from "../enumerations/EUserRole";

const NavigationBar = () => {
    const { role } = useAuth()

    return (
        <div className="bg-white shadow-md w-full">
            <div className="flex mx-auto gap-x-1 pt-2 pb-2 w-3/5 d-flex ">
                <Link to="/Home" className="flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }} >{translate("NavigationBar.Home")}</div>
                </Link><Link to="/Replays" className="flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }} >{translate("NavigationBar.Replays")}</div>
                </Link><Link to="/LocalRatings" className="flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.LocalRatings")}</div>
                </Link>
                <Link to="/PrivacyPolicy" className="flex flex-grow justify-center cursor-pointer py-2 px-4">
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.PrivacyPolicy")}</div>
                </Link>
                <Link to="/About" className="flex flex-grow justify-center cursor-pointer py-2 px-4" >
                    <div style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.About")}</div>
                </Link>
                {
                    role === EUserRole.ADMINISTRATOR ?
                        <Link to="/Administration" className="flex flex-grow justify-center cursor-pointer py-2 px-4">
                            <div  style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase" }}>{translate("NavigationBar.Administration")}</div>
                        </Link> :
                        ""
                }
            </div>
            <hr className="w-full" />
        </div>
    );
}

export {
    NavigationBar
}
