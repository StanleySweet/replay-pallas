import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from "chart.js";
import { ReactNode, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Replay } from "../types/Replay";
import { useAuth } from "../contexts/Models/IAuthContext";
import axios, { AxiosResponse } from "axios";
import colors from "tailwindcss/colors"
import { BlockTitle } from "../components/BlockTitle";
import { ReplayContainer } from "../components/ReplayContainer";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link } from "react-router-dom";
import { NavigationBar } from "../components/NavigationBar";
import EUserRole from "../enumerations/EUserRole";
import { HouseIcon } from "../icons/HouseIcon";

ChartJS.register(ArcElement, Tooltip, Legend);


const ReplaysPage = (): ReactNode => {
    const [isLoading, setLoading] = useState(true);
    const [replays, setReplays] = useState<Replay[]>()
    const [civDoughnutData, setCivDoughnutData] = useState<ChartData<"doughnut", number[], unknown>>();
    const [mapDoughnutData, setMapDoughnutData] = useState<ChartData<"doughnut", number[], unknown>>();
    const { token, role } = useAuth();

    useEffect(() => {
        axios.get<any, AxiosResponse<Replay[], any>>('http://localhost:8080/replays/all', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<Replay[], any>) => {
            if (response.data && response.data) {

                var civs = response.data.map(a => {
                    var playerData = a.metadata.settings.PlayerData;
                    return playerData.map(b => b.Civ)
                }).reduce((a, c) => a.concat(c), []);
                var maps = response.data.map(a => a.metadata.settings.Name || a.metadata.settings.mapName);
                var toto = civs.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))
                var tata = maps.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null))
                setReplays(response.data)
                setCivDoughnutData({
                    labels: Object.keys(tata),
                    datasets: [
                        {
                            data: Object.values(tata),
                            backgroundColor: Object.values(colors.red),
                            hoverBackgroundColor: Object.values(colors.red).reverse(),
                        },
                    ],
                });
                setMapDoughnutData({
                    labels: Object.keys(toto),
                    datasets: [
                        {
                            data: Object.values(toto),
                            backgroundColor: Object.values(colors.red),
                            hoverBackgroundColor: Object.values(colors.red).reverse(),
                        },
                    ],
                });
            }



            setLoading(false);
        });
    }, []);

    if (!civDoughnutData || !mapDoughnutData || isLoading)
        return <></>



    return (<>
        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">
            <div className="flex">
                <div className="mb-5 flex-grow inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon/>&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("Replays.Title")}</div>
                {
                    role > EUserRole.READER ?
                        <Link to="/Replays/Upload" className="inline-flex items-center mb-5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="800px" width="800px" version="1.1" id="Capa_1" viewBox="0 0 60.364 60.364" className="w-3 h-3 mr-2">
                                <g>
                                    <path d="M54.454,23.18l-18.609-0.002L35.844,5.91C35.845,2.646,33.198,0,29.934,0c-3.263,0-5.909,2.646-5.909,5.91v17.269   L5.91,23.178C2.646,23.179,0,25.825,0,29.088c0.002,3.264,2.646,5.909,5.91,5.909h18.115v19.457c0,3.267,2.646,5.91,5.91,5.91   c3.264,0,5.909-2.646,5.91-5.908V34.997h18.611c3.262,0,5.908-2.645,5.908-5.907C60.367,25.824,57.718,23.178,54.454,23.18z" />
                                </g>
                            </svg><span>{translate("Replays.Upload")}</span>
                        </Link> : ""
                }
            </div>
            <div className="grid grid-cols-6 gap-x-4">
                <div className="col-span-2">
                    <div id="doughnut-container" className=" text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                        <BlockTitle titleKey={"Replays.CivRepartition"}></BlockTitle>
                        <Doughnut data={civDoughnutData} options={{ responsive: true }} />
                        <Doughnut data={mapDoughnutData} options={{ responsive: true }} />

                    </div>
                </div>
                <div className="col-span-4">
                    <ReplayContainer replays={replays}></ReplayContainer>
                </div>
            </div>
        </div>
    </>
    )
}

export {
    ReplaysPage
}
