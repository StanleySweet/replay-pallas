/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useEffect, useState } from "react";
import axios from 'axios';
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { UserBlock } from "./UserBlock";
import { User } from "../types/User";
import { useAuth } from "../contexts/Models/IAuthContext";
import { BlockTitle } from "./BlockTitle";
import TrashIcon from "../icons/TrashIcon";

const LatestUserContainer = (): JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();
    const [replays, setReplays] = useState<User[]>([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/users/latest`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setReplays(response.data);
            setLoading(false);
        });
    }, [token]);


    if (isLoading) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    if (!replays || replays.length === 0) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    function delete_user(id: number): void {
        if (!replays || !replays.length)
            return;

        axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200) {
                const replay = replays.find(a => a.id === id);
                if (replay) {
                    setReplays(replays.filter(a => a.id !== id));
                }
            }
        });
    }

    return (<>
        <div id="replay-container" className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="LatestUser.Title" />
            <div className="w-full">
                {
                    replays.map(r => <div key={r.id} className="flex" >
                        <div className="flex-shrink">
                            <div className="items-center m-auto p-5" style={{ borderTop: "1px solid #C7CCD9" }}>
                                <button onClick={() => delete_user(r.id)} className="h-5 my-auto w-5">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                        <div className="flex-grow" >
                            <UserBlock user={r} ></UserBlock>
                        </div>
                    </div>)
                }
            </div>
        </div></>
    );
};

export {
    LatestUserContainer
};
