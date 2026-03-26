import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HouseIcon } from "../icons/HouseIcon";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { User } from "../types/User";
import { NavigationBar } from "./NavigationBar";
import { BlockTitle } from "./BlockTitle";
import { UserBlock } from "./UserBlock";
import { UserStatisticsBlock } from "./UserStatisticsBlock";
import { UserRatingBlock } from "./UserRatingBlock";
import { SearchReplayBar } from "./LocalRatings/SearchReplay";
import { ReplayContainer } from "./ReplayContainer";
import SaveIcon from "../icons/SaveIcon";
import EUserRole from "../enumerations/EUserRole";

interface UserDetailsViewProps {
    requestUrl: string
    hidePermissionForZero?: boolean
}

const UserDetailsView = ({ requestUrl, hidePermissionForZero }: UserDetailsViewProps): JSX.Element => {
    const { token, role } = useAuth();
    const [userDetails, setUserDetails] = useState<User>();
    const [isLoading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>();
    const [adminSelectValue, setSelectValue] = useState<EUserRole>();
    const [message, setMessage] = useState<string>();

    useEffect(() => {
        axios.get<undefined, AxiosResponse<User>>(requestUrl, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then((response: AxiosResponse<User>) => {
            setUserDetails(response.data);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [requestUrl, token]);

    const onClick = () => {
        if (!adminSelectValue || !userDetails)
            return;

        setMessage(undefined);
        axios.post(`${import.meta.env.VITE_API_URL}/users/set-permissions`, {
            id: userDetails.id,
            role: adminSelectValue
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then((response: AxiosResponse<undefined>) => {
            if (response.status === 200) {
                setUserDetails({
                    ...userDetails,
                    role: adminSelectValue
                });
                setMessage(translate("UserDetails.SavePermissionsSuccess"));
            }
        }).catch(() => {
            setMessage(translate("UserDetails.SavePermissionsError"));
        });
    };

    if (isLoading || !userDetails)
        return <div className="App">{translate("App.LoadingInProgress")}</div>;

    const showPermissions = role === EUserRole.ADMINISTRATOR && (!hidePermissionForZero || userDetails.id !== 0);

    return (
        <>
            <NavigationBar />
            <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
                <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("UserDetails.Title")}</div>

                <div id="user-details-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                    <BlockTitle titleKey="UserDetails.Title" />
                    <UserBlock user={userDetails} />
                    <UserStatisticsBlock user={userDetails} />
                </div>
                {
                    userDetails.graph ? <UserRatingBlock user={userDetails} /> : null
                }

                {
                    showPermissions ?
                        <div id="user-permission-container" className="text-sm p-6 mt-4 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                            <BlockTitle titleKey="UserDetails.ChangePermissions" />

                            <div className="d-flex flex">
                                <div className="flex">
                                    <label htmlFor="countries" className="flex  text-sm font-medium text-gray-900">{translate("UserDetails.SelectAnOption")}</label>
                                    <select value={adminSelectValue} onChange={(evt) => setSelectValue(+evt.target.value as EUserRole)} id="countries" className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
                                        <option>{translate("UserDetails.ChoosePermissions")}</option>
                                        <option value={EUserRole.READER}>{EUserRole[EUserRole.READER]}</option>
                                        <option value={EUserRole.CONTRIBUTOR}>{EUserRole[EUserRole.CONTRIBUTOR]}</option>
                                        <option value={EUserRole.ADMINISTRATOR}>{EUserRole[EUserRole.ADMINISTRATOR]}</option>
                                    </select>
                                </div>
                                <div className="flex-grow"></div>
                                <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                    <SaveIcon />
                                    <span>{translate("UserDetails.SavePermissions")}</span>
                                </button>
                            </div>
                            {
                                message ?
                                    <div className="mt-3 text-sm text-gray-700">{message}</div> :
                                    null
                            }
                        </div> :
                        null
                }

                <div className="mt-4"></div>
                {
                    userDetails.replays.length ?
                        <>
                            <SearchReplayBar onChange={(evt) => { setFilter(evt.target.value); }} />
                            <ReplayContainer filter={filter} maxItems={20} replays={userDetails.replays} />
                        </> :
                        null
                }
            </div>
        </>
    );
};

export {
    UserDetailsView
};
