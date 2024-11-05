/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import 'chartjs-adapter-moment';
import "chart.js/auto";
import { BlockTitle } from "./BlockTitle";
import { ChartData, ChartOptions } from "chart.js";
import { CPMChartBlock } from "./CpmChartBlock";
import { Line } from "react-chartjs-2";
import { ReplayDetails } from "../types/Replay";
import { tailWindColors } from "../utils";
import { toHHMMSS } from "../utils";
import { uid } from "chart.js/helpers";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import axios from "axios";
import { useState } from 'react';

interface IReplayBlockProps {
    replay: ReplayDetails;
}

enum ETabType {
    CPM,
    CPT,
}

const ReplayDetailsBlock = (props: IReplayBlockProps): JSX.Element => {
    const replay: ReplayDetails = props.replay;
    const { token } = useAuth();
    const [tabType, setTabType] = useState<ETabType>(ETabType.CPT);

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        axios.get(`${import.meta.env.VITE_API_URL}/replays/${props.replay.match_id}/zip`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'blob'
        }
        )
            .then(({ data: blob }) => {
                const link = document.createElement('a');
                const url = URL.createObjectURL(blob);
                link.href = url;
                link.download = `${props.replay.match_id}.zip`;
                link.click();
            });
    };

    const options = {
        animation: false,
        type: 'line',
        spanGaps: true,
        responsive: true,
        scales: {
            x: {
                type: 'time', // Set the x-axis to be a time scale
                time: {
                    unit: 'second', // Time unit for spacing
                    stepSize: 1,  // Show each second on the axis
                    displayFormats: {
                        second: 'HH:mm:ss' // Format time as hours:minutes:seconds
                    },
                    tooltipFormat: 'HH:mm:ss', // Tooltip format to match
                },
            },
            y: {

            }

        },
        plugins: {
            title: {
                display: true, // Show the title
                text: "Commands Per Turn (CPT) (200ms)",
                font: {
                    size: 18 // Font size for the title
                },
                padding: {
                    top: 10,
                    bottom: 10
                }
            }
        }

    } as ChartOptions<'line'>;
    let data: ChartData<'line', number[]> | undefined = undefined;
    if (replay.command_statistics) {
        data = {
            datasets: [
            ],
            labels: replay.command_statistics.turns.map(a => {
                const date = new Date(a * 200);
                date.setHours(date.getHours() - 1);
                return date;
            }),
        } as ChartData<'line', number[]>;

        for (const playerData of replay.command_statistics.playerCommandDatas) {
            data.datasets.push({
                label: playerData.playerName,
                data: playerData.playerCommands,
                fill: false,
                pointRadius: 1,
                borderWidth: 1,
                backgroundColor: tailWindColors[data.datasets.length * 2],
                borderColor: tailWindColors[data.datasets.length * 2],
            });
        }

    }

    let chart: JSX.Element;
    switch (tabType) {
        case ETabType.CPT:
            chart = (<article className="font-sans">
                <div className="flex">
                    {
                        data ?
                            <Line className="mt-4" data={data} options={options} />

                            :
                            <></>
                    }
                </div>
            </article>);

            break;
        case ETabType.CPM:
            chart = <CPMChartBlock replay={replay} />;
            break;
        default:
            chart = <></>;
            break;
    }

    return (<>
        <div id="replay-detail-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="ReplayDetails.Title" />
            <article className="font-sans">
                <div className="flex">
                    <div className="flex-none hidden xl:block crop-container rounded-full w-[256px] h-[150px} max-h-[256px] overflow-hidden" style={{ background: "black" }}>
                        <img
                            className="ml-[9%] mt-[20%] mb-[20%] w-[256px] h-[150px}"
                            src={`https://cdn.jsdelivr.net/gh/0ad/0ad/binaries/data/mods/public/art/textures/ui/${replay.metadata.previewImage}`}
                            style={{
                                position: "relative",
                                maxWidth: "none"
                            }}
                            alt={`map preview of ${replay.metadata.settings.Name}`}
                            aria-hidden="true"
                        />
                    </div>
                    <div className="grid grid-cols-2 p-5 flex-grow">
                        <span className="text-sm">
                            {translate("ReplayDetails.MapName")} <b
                            >{replay.metadata.settings.Name ||
                                replay.metadata.settings.mapName}</b>
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.PlayerCount")}  <b
                            >{replay.metadata.settings.PlayerData.length}</b>
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.MatchDuration")}  <b>{toHHMMSS(replay.metadata.settings.MatchDuration + "")}</b            >
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.Date")} <b >{new Date(replay.metadata.timestamp * 1000).toLocaleDateString(
                                "en-GB",
                                {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                }
                            )}</b>
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.PyrogenesisVersion")} <b>{replay.metadata.engine_version}</b>
                        </span>
                        {
                            replay.metadata.settings.Biome ?
                                <>
                                    <span className="text-sm">
                                        {translate("ReplayDetails.Biome")} <b>{replay.metadata.settings.Biome}</b>
                                    </span>

                                </> :
                                null
                        }
                        {
                            replay.metadata.settings.RatingEnabled ? <>
                                <span className="text-sm">
                                    {translate("ReplayDetails.Ranked")} <b>{replay.metadata.settings.RatingEnabled.toString()}</b>
                                </span></> :
                                null
                        }
                        {
                            replay.metadata.settings.LockTeams !== undefined ? <>
                                <span className="text-sm">
                                    {translate("ReplayDetails.Ranked")} <b>{replay.metadata.settings.LockTeams.toString()}</b>
                                </span></> :
                                null
                        }
                        <span className="text-sm">
                            {translate("ReplayDetails.RandomMapSeed")} : <b>{replay.metadata.settings.Seed}</b>
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.StartingResources")}<b>{replay.metadata.settings.StartingResources}</b>
                        </span>
                        <span className="text-sm">
                            {translate("ReplayDetails.PopulationCap")} <b>{replay.metadata.settings.PopulationCap}</b>
                        </span>
                        {
                            replay.metadata.settings.Size ?
                                <span className="text-sm">
                                    {translate("ReplayDetails.Size")} <b>{replay.metadata.settings.Size}</b>
                                </span> : null
                        }<br />
                        <div>
                            {
                                replay.metadata.mods ?
                                    <span className="text-sm">
                                        {translate("ReplayDetails.Mods")}&nbsp;{
                                            replay.metadata.mods?.map(a => <span key={uid()}><b>{a.name}</b> ({a.version}),&nbsp;</span>)
                                        }
                                    </span> : ""
                            }
                        </div>
                    </div>
                </div>
                <center className="flex-3">
                    <div className="pt-2">
                        <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                            <span>{translate("ReplayDetails.Download")}</span>
                        </button>
                    </div>
                </center>
            </article>
        </div>


        <div className="grid grid-cols-2 gap-x-1 mt-4 ">
                <div onClick={() => setTabType(ETabType.CPT)} className={(tabType === ETabType.CPT ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Commands per turn (CPT)</div>
                <div onClick={() => setTabType(ETabType.CPM)} className={(tabType === ETabType.CPM ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Commands per minutes (CPM)</div>
            </div>
            <div className="text-sm p-6  bg-white shadow-md  wfg-chart-tab ">
                <center> {chart}</center>
            </div>
    </>);
};

export {
    ReplayDetailsBlock
};
