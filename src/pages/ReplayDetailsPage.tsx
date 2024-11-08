/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useEffect, useState } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import axios from "axios";
import { AxiosResponse } from "axios";
import { ReplayDetails } from "../types/Replay";
import { PlayerStatistics } from "../components/PlayerStatistics";
import { useParams } from "react-router";
import { ReplayDetailsBlock } from "../components/ReplayDetailsBlock";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Models/IAuthContext";
import { NavigationBar } from "../components/NavigationBar";
import { HouseIcon } from "../icons/HouseIcon";

const ReplayDetailsPage = function () {
  const [isLoading, setLoading] = useState(true);
  const [replay, setReplay] = useState<ReplayDetails>();
  const { matchId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    axios.get<ReplayDetails>(`${import.meta.env.VITE_API_URL}/replays/${matchId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then((response: AxiosResponse<ReplayDetails>) => {
      if (response.data && response.data.metadata) {
        setReplay(response.data);
      }
      setLoading(false);
    });
  }, [matchId, token]);

  if (isLoading || !replay) {
    return <div className="App">{translate("App.LoadingInProgress")}</div>;
  }

  return (<>
    <NavigationBar />
    <div className="w-5/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
      <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon/>&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}<Link to={"/Replays"}>&nbsp;{translate("Replays.Title")}&nbsp;</Link>{">"}&nbsp;{translate("ReplayDetails.Title")}</div>
      <ReplayDetailsBlock replay={replay} />
      <div className="mt-4"></div>
      <PlayerStatistics playerData={replay.metadata.settings.PlayerData} />
    </div>
  </>);
};

export {
  ReplayDetailsPage
};
