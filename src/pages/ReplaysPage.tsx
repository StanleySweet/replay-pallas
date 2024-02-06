import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { ReactNode, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { ReplayListItem } from "../types/Replay";
import { useAuth } from "../contexts/Models/IAuthContext";
import axios, { AxiosResponse } from "axios";
import colors from "tailwindcss/colors";
import { BlockTitle } from "../components/BlockTitle";
import { ReplayContainer } from "../components/ReplayContainer";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import EUserRole from "../enumerations/EUserRole";
import { HouseIcon } from "../icons/HouseIcon";
import { SearchReplayBar } from "../components/LocalRatings/SearchReplay";
import PlusIcon from "../icons/PlusIcon";
import { tailWindColors, tailWindColorsTransparent } from "../utils";

ChartJS.register(ArcElement, Tooltip, Legend);


const ReplaysPage = (): ReactNode => {
    const [isLoading, setLoading] = useState(true);
    const [replays, setReplays] = useState<ReplayListItem[]>();
    const [filter, setFilter] = useState<string>();
    const [civDoughnutData, setCivDoughnutData] = useState<ChartData<"doughnut", number[], unknown>>();
    const [mapDoughnutData, setMapDoughnutData] = useState<ChartData<"doughnut", number[], unknown>>();
    const { token, role } = useAuth();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/replays/all-list-items`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<ReplayListItem[]>) => {
            if (response.data && response.data) {
                console.log(response.data);
                const civs = response.data.flatMap(a => a.civs);
                const maps = response.data.map(a => a.mapName);
                const toto = civs.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
                const tata = maps.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));
                setReplays(response.data);
                setCivDoughnutData({
                    labels: Object.keys(tata),
                    datasets: [
                        {
                            data: Object.values(tata),
                            backgroundColor: tailWindColorsTransparent,
                            borderColor: tailWindColors,
                            hoverBackgroundColor: Object.values(colors.red).reverse(),
                        },
                    ],
                });
                setMapDoughnutData({
                    labels: Object.keys(toto),
                    datasets: [
                        {
                            data: Object.values(toto),
                            backgroundColor: tailWindColorsTransparent,
                            borderColor: tailWindColors,
                            hoverBackgroundColor: Object.values(colors.red).reverse(),
                        },
                    ],
                });
            }

            setLoading(false);
        });
    }, [token]);



    return (<>
        <NavigationBar />

        <div className="w-5/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <div className="flex">
                <div className="mb-5 flex-grow inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("Replays.Title")}</div>
                {
                    role > EUserRole.READER ?
                        <Link to="/Replays/Upload" className="inline-flex items-center mb-5">
                            <PlusIcon/>
                            <span>{translate("Replays.Upload")}</span>
                        </Link> : ""
                }
            </div>
            {
                isLoading ? <>{translate("App.LoadingInProgress")}</> :
                    <div className="grid lg:grid-cols-6 gap-x-4">
                        <div className="lg:col-span-2">
                            {
                                civDoughnutData ?
                                    <div id="doughnut-container" className=" text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                                        <BlockTitle titleKey={"Replays.MapRepartition"}></BlockTitle>
                                        <Doughnut data={civDoughnutData} options={{ responsive: true }} />
                                    </div> : <></>
                            }
                            {
                                mapDoughnutData ? <div id="doughnut-container" className="mt-4 text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                                    <BlockTitle titleKey={"Replays.CivRepartition"}></BlockTitle>
                                    <Doughnut data={mapDoughnutData} options={{ responsive: true }} />
                                </div> : <></>
                            }

                        </div>
                        <div className="mt-2 lg:mt-0 lg:col-span-4">
                            <SearchReplayBar onChange={(evt) => { setFilter(evt.target.value); }} />
                            <ReplayContainer filter={filter} maxItems={20} replays={replays}></ReplayContainer>
                        </div>
                    </div>
            }
        </div>
    </>
    );
};

export {
    ReplaysPage
};
