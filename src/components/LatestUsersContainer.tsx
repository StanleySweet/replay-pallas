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

const LatestUserContainer = (): JSX.Element => {
    const [isLoading, setLoading] = useState(true);
    const { token } = useAuth();
    const [replays, setReplays] = useState<User[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/users/latest`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            setReplays(response.data);
            setLoading(false);
        });
    }, []);


    if (isLoading) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    if (!replays || replays.length === 0) {
        return <div className="App">{translate("App.LoadingInProgress")}</div>;
    }

    return (
        <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="LatestUser.Title" />
            <div className="w-full">
                {
                    replays.map(r => <UserBlock key={r.id} user={r} ></UserBlock>)
                }
            </div>
        </div>
    );
};

export {
    LatestUserContainer
}
