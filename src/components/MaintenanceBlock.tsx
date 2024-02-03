import { ReactNode } from "react";
import { BlockTitle } from "./BlockTitle";
import { useAuth } from "../contexts/Models/IAuthContext";
import axios from "axios";

const MaintenanceBlock = (): ReactNode => {
    const { token } = useAuth();

    async function rebuild_rating_history(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/replays/rebuild-lobby-rank-history`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async function rebuild_glicko2_history(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/replays/rebuild-glicko-rank-history`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async function rebuild_replay_metadata(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/replays/rebuild-replay-metadata`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async function vacuum_database(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.get(`${import.meta.env.VITE_API_URL}/health/vacuum`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async function rebuild_local_ratings(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        await axios.post(`${import.meta.env.VITE_API_URL}/local-ratings/rebuild-database`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }

    return (<>
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="LatestUser.Title" />
            <div className="flex gap-2">
                <button onClick={vacuum_database} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>Vacuum</span>
                </button>
                <button onClick={rebuild_glicko2_history} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>Rebuild Glicko</span>
                </button>
                <button onClick={rebuild_rating_history} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>Rebuild Rating History</span>
                </button>
                <button onClick={rebuild_replay_metadata} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>Rebuild Replay Data</span>
                </button>
                <button onClick={rebuild_local_ratings} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M19 9h-4V3H9v6H5l7 7zM5 18v2h14v-2z" /></svg>
                    <span>Rebuild Local Rating</span>
                </button>
            </div>
        </div>
    </>);
};



export {
    MaintenanceBlock
};
