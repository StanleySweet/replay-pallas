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

const ReplayUploadPage = (): ReactNode => {
    const { role, token } = useAuth();
    const [fileData, setFileData] = useState<File>();
    const [uploadReplays, setUploadReplays] = useState<Replay[]>([]);
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

        var result = await axios.post('http://localhost:8080/replays/upload-zip', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });


        var replays : Replay[] = [];
        for (var matchId of result.data.AddedReplays) {
            var replay = await axios.get<Replay>(`http://localhost:8080/replays/${matchId}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            replays.push(replay.data);
        }


        setUploadReplays(replays);
    }

    useEffect(() => {
        if (role < EUserRole.CONTRIBUTOR) {
            navigate("/")
            return;
        }
    }, []);


    return (
        <>
            <NavigationBar />
            <div className="w-3/5 mx-auto py-5">
                <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon />&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("ReplayUploadPage.Title")}</div>

                <div id="upload-replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                    <BlockTitle titleKey="ReplayUploadPage.Title" />
                    <p className="text-justify">
                        Upload your replay file here as a .zip file. You can upload multiple replays at the same time they just need to have their own subfolders.
                    </p>
                    <br />

                    <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Selection du fichier</label>
                    <input onChange={evt => setFileData(evt.target.files?.[0])} accept=".zip" className="lock w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:bg-gray-100 file:me-4 file:py-3 file:px-4 " aria-describedby="file_input_help" id="file_input" type="file" />
                    <p className="mt-1 text-sm text-gray-500" id="file_input_help">Zip file only. Max size 5MB</p>
                    <center className="col-span-3">
                        <div className="pt-2">
                            <button onClick={onClick} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 20h14v-2H5zm0-10h4v6h6v-6h4l-7-7z" /></svg>
                                <span>{translate("ReplayDetails.Download")}</span>
                            </button>
                        </div>
                    </center>

                </div>
            </div>
            {
                uploadReplays?.length ?
                    <div id="uploaded-replays-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                        {
                            uploadReplays.map(r => <ReplayBlock key={r.match_id} replay={r} ></ReplayBlock>)
                        }</div> : ""
            }


        </>
    )
}

export {
    ReplayUploadPage
}
