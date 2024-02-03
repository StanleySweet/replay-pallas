import { ReactNode, useEffect, useState } from "react";
import { NavigationBar } from "../components/NavigationBar";
import TrashIcon from "../icons/TrashIcon";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../contexts/Models/IAuthContext";
import { Replay } from "../types/Replay";
import { BlockTitle } from "../components/BlockTitle";
import { Link } from "react-router-dom";
import { SearchReplayBar } from "../components/LocalRatings/SearchReplay";
import { useTranslation as translate } from "../contexts/Models/useTranslation";



const MyReplaysPage = (): ReactNode => {
    const { token } = useAuth();
    const [replays, setReplays] = useState<Replay[]>();
    const [isLoading, setLoading] = useState<boolean>();
    const [filter, setFilter] = useState<string>("");
    // const [filteredReplays, setFilteredReplays] = useState<Replay[]>();

    async function delete_replay(match_id: string) {
        if (!replays || !replays.length)
            return;

        axios.delete(`${import.meta.env.VITE_API_URL}/replays/${match_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            if (response.status === 200)
            {
                const replay = replays.find(a => a.match_id === match_id);
                if (replay) {
                    setReplays(replays.filter(a => a.match_id !== match_id));
                }
            }
        });
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/replays/my-replays`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response: AxiosResponse<Replay[]>) => {
            setLoading(false);
            if (response.data && response.data) {
                setReplays(response.data);
            }
        });
        setLoading(true);
    }, []);

    const filteredReplays : Replay[] = (replays ?? []).filter(r => {
        return r.match_id.toString().toLowerCase().includes(filter.toLowerCase()) ||
            r.metadata.settings.PlayerData.some(a => a.Name?.toLowerCase().includes(filter?.toLowerCase() ?? "")) ||
            r.metadata.settings.mapName?.toLowerCase().includes(filter.toLowerCase()) ||
            r.metadata.settings.Name?.toLowerCase().includes(filter.toLowerCase());
    });

    return (<>
        <NavigationBar />
        <div className="md:w-2/5 sm:w-4/5 lg:w-3/5 xl:w-3/5 mx-auto py-5">
            <SearchReplayBar onChange={(evt) => { setFilter(evt.target.value); }} />
            <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
                <BlockTitle titleKey="ReplayContainer.Title" />
                <div className="w-full h-[711px] overflow-y-scroll" >
                    {
                        !filteredReplays || !filteredReplays.length ? (isLoading ? <div className="App">{translate("App.LoadingInProgress")}</div> : <>No replays to display</>) :
                            filteredReplays.map(r => <article key={r.match_id} className="mb-[1em] pt-3 flex" style={{ borderTop: "1px solid #C7CCD9" }} >
                                <div className="flex-grow">
                                    <h4><Link to={`/Replays/ReplayDetails/${r.match_id}`}> <b>{r.metadata.settings.Name || r.metadata.settings.mapName}</b> ({r.metadata.settings.PlayerData.map(a => a.NameWithoutRating).join(", ")})</Link></h4>
                                    <span className="text-gray-500 text-sm d-flex">
                                        <span className="flex-grow">⚙️ Date: <i>{(new Date(r.metadata.timestamp * 1000).toDateString())}</i></span>
                                    </span>
                                </div>
                                <button onClick={() => delete_replay(r.match_id)} className="h-5 w-5 my-auto">
                                    <TrashIcon />
                                </button>
                            </article>)
                    }
                </div>
            </div>

        </div>
    </>);
};

export {
    MyReplaysPage
};
