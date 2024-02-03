/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { ReactNode, useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import { BlockTitle } from "../components/BlockTitle";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/Models/IAuthContext";
import EUserRole from "../enumerations/EUserRole";
import { HouseIcon } from "../icons/HouseIcon";
import axios from "axios";
import { ReplayBlock } from "../components/ReplayBlock";
import { Replay } from "../types/Replay";
import UploadIcon from "../icons/UploadIcon";
import LoadingBar from 'react-top-loading-bar';

const ReplayUploadPage = (): ReactNode => {
    const { role, token } = useAuth();
    const [fileData, setFileData] = useState<File>();
    const [uploadReplays, setUploadReplays] = useState<Replay[]>([]);
    const [percentCompleted, setPercentageCompleted] = useState<number | undefined>(undefined);
    const navigate = useNavigate();

    const onClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!fileData)
            return;

        const formData = {
            file: {
                value: await fileData.arrayBuffer(),
                options: {
                    filename: 'commands.zip',
                    contentType: 'application/zip'
                }
            }
        };

        const result = await axios.post(`${import.meta.env.VITE_API_URL}/replays/upload-zip`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: function(progressEvent) {
                setPercentageCompleted(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0)));
            },
        });


        const replays: Replay[] = [];
        for (const matchId of result.data.AddedReplays) {
            const replay = await axios.get<Replay>(`${import.meta.env.VITE_API_URL}/replays/${matchId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            replays.push(replay.data);
        }


        setUploadReplays(replays);
    };

    useEffect(() => {
        if (role < EUserRole.CONTRIBUTOR) {
            navigate("/");
            return;
        }
    }, [navigate, role]);


    return (
        <>
            <NavigationBar />
            <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
                <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("ReplayUploadPage.Title")}</div>

                <div id="upload-replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                    <BlockTitle titleKey="ReplayUploadPage.Title" />
                    <p className="text-justify">
                        Upload your replay file here as a .zip file. You can upload multiple replays at the same time they just need to have their own subfolders.
                    </p>
                    <br />

                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Selection du fichier</label>
                    <input onChange={evt => setFileData(evt.target.files?.[0])} accept=".zip" className="lock w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4 " aria-describedby="file_input_help" id="file_input" type="file" />
                    {
                       percentCompleted ? <LoadingBar progress={percentCompleted} color="#FFFFFFFF" /> : <></>
                    }
                    <p className="mt-1 text-sm text-gray-500" id="file_input_help">Zip file only. Max size 5MB</p>
                        <div className="pt-2 d-flex flex">
                            <div className="flex-grow"></div>
                            <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                <UploadIcon/>
                                <span>{translate("Replays.Upload")}</span>
                            </button>
                        </div>

                </div>
            </div>
            {
                uploadReplays?.length ?
                    <div id="uploaded-replays-container" className="text-sm md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                        <BlockTitle titleKey="UploadPage.UploadedReplaysTitle"/>
                        {
                            uploadReplays.map(r => <ReplayBlock key={r.match_id} replay={r} ></ReplayBlock>)
                        }</div> : ""
            }


        </>
    );
};

export {
    ReplayUploadPage
};
