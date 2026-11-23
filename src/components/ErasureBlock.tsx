import { ReactNode, useState } from "react";
import axios from "axios";
import { BlockTitle } from "./BlockTitle";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { authHeaders } from "../utils";

interface Suppressed { person: number, pseudonym: string }
interface Erased { players: number, replays: number, aliasGroups: number }

// Players who asked to be erased. A nickname goes on the list first (POST /replays/suppress): from then on a
// replay uploaded with it is stored under the pseudonym. Applying (POST /replays/erase) rewrites what is
// already stored, so it asks first.
const ErasureBlock = (): ReactNode => {
    const { token } = useAuth();
    const text = (key: Parameters<typeof translate>[0]): string => translate(key) ?? "";
    const [nick, setNick] = useState("");
    const [person, setPerson] = useState("");
    const [added, setAdded] = useState<string[]>([]);
    const [applied, setApplied] = useState<Erased>();
    const [failure, setFailure] = useState<number>();

    const fail = (error: unknown) => setFailure(axios.isAxiosError(error) ? error.response?.status ?? 0 : 0);

    async function add(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        setFailure(undefined);
        try {
            const response = await axios.post<Suppressed>(`${import.meta.env.VITE_API_URL}/replays/suppress`, { nick: nick.trim(), ...(person ? { person: +person } : {}) }, { headers: authHeaders(token) });
            setAdded(previous => [...previous, `${nick.trim()} → ${response.data.pseudonym} (${response.data.person})`]);
            setNick("");
        }
        catch (error) { fail(error); }
    }

    async function apply(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault();
        if (!window.confirm(text("Erasure.Confirm")))
            return;
        setFailure(undefined);
        try {
            setApplied((await axios.post<Erased>(`${import.meta.env.VITE_API_URL}/replays/erase`, undefined, { headers: authHeaders(token) })).data);
        }
        catch (error) { fail(error); }
    }

    const button = "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";
    return (
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="Erasure.Title" />
            <p className="text-justify mb-3">{text("Erasure.Hint")}</p>
            <form className="flex gap-2 flex-wrap items-end">
                <label className="flex flex-col">{text("Erasure.Nick")}
                    <input className="bg-white border-solid border-[1px] rounded" style={{ padding: "8px 10px" }} value={nick} onChange={event => setNick(event.target.value)} />
                </label>
                <label className="flex flex-col">{text("Erasure.Person")}
                    <input className="bg-white border-solid border-[1px] rounded" style={{ padding: "8px 10px" }} type="number" min={1} value={person} onChange={event => setPerson(event.target.value)} />
                </label>
                <button onClick={add} disabled={!nick.trim()} className={button}>{text("Erasure.Add")}</button>
                <button onClick={apply} className={button}>{text("Erasure.Apply")}</button>
            </form>
            {added.length > 0 &&
                <div className="mt-4 text-xs" role="status">
                    <b>{text("Erasure.Added")}</b>
                    <ul>{added.map(line => <li key={line}>{line}</li>)}</ul>
                </div>}
            {applied &&
                <div className="mt-2 text-xs" role="status">{text("Erasure.Applied")} {applied.players} / {applied.replays} / {applied.aliasGroups}</div>}
            {failure !== undefined &&
                <div className="mt-2 text-xs text-red-700" role="alert">{text("Erasure.Failed")} {failure})</div>}
        </div>
    );
};

export { ErasureBlock };
