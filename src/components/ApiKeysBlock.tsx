import { ReactNode, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BlockTitle } from "./BlockTitle";
import TrashIcon from "../icons/TrashIcon";
import EUserRole from "../enumerations/EUserRole";
import { useAuth } from "../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { ITranslationDictionaryKey } from "../types/ITranslationDictionaryEntry";
import { authHeaders } from "../utils";

interface ApiKey { id: number, label: string, role: EUserRole, creation_date: string, expires_at: string | null, last_used_at: string | null }

const MAX_KEYS = 5;
const url = `${import.meta.env.VITE_API_URL}/users/api-keys`;
const day = (date: string): string => new Date(date.includes("T") ? date : date.replace(" ", "T") + "Z").toLocaleDateString();

// The keys of the logged in user: made here, shown once, deleted here (see /users/api-keys in the API).
const ApiKeysBlock = (): ReactNode => {
    const { token, role } = useAuth();
    const text = (key: ITranslationDictionaryKey): string => translate(key) ?? "";
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [label, setLabel] = useState("");
    const [keyRole, setKeyRole] = useState<number>(EUserRole.CONTRIBUTOR);
    const [days, setDays] = useState("");
    const [secret, setSecret] = useState<string>();
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState<number>();
    const [failure, setFailure] = useState<number>();

    const load = useCallback(() => axios.get<ApiKey[]>(url, { headers: authHeaders(token) }).then(response => setKeys(response.data)).catch(() => setKeys([])), [token]);
    useEffect(() => { load(); }, [load]);

    const fail = (error: unknown) => setFailure(axios.isAxiosError(error) ? error.response?.status ?? 0 : 0);

    async function create(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setFailure(undefined);
        try {
            const response = await axios.post<{ key: string }>(url, { label: label.trim(), role: keyRole, ...(days ? { expires_in_days: +days } : {}) }, { headers: authHeaders(token) });
            setSecret(response.data.key);
            setCopied(false);
            setLabel("");
            await load();
        }
        catch (error) { fail(error); }
    }

    async function remove(id: number): Promise<void> {
        setFailure(undefined);
        try {
            await axios.delete(`${url}/${id}`, { headers: authHeaders(token) });
            setConfirming(undefined);
            await load();
        }
        catch (error) { fail(error); }
    }

    async function copy(): Promise<void> {
        if (!secret)
            return;
        try {
            await navigator.clipboard.writeText(secret);
            setCopied(true);
        }
        catch { /* the key stays selectable in the page */ }
    }

    const button = "bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";
    const textButton = "font-medium py-1 text-wfg hover:underline";
    const field = "bg-white border-solid border-[1px] rounded px-2.5 py-2";
    const full = keys.length >= MAX_KEYS;
    return (
        <div id="api-keys-container" className="text-sm p-6 mt-4 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>
            <BlockTitle titleKey="ApiKeys.Title" />
            <p className="mb-3 text-justify">{text("ApiKeys.Hint")}</p>

            <ul className="border-t border-gray-200">
                {keys.length === 0 && <li className="py-4 border-b border-gray-200 text-gray-500">{text("ApiKeys.None")}</li>}
                {keys.map(key => (
                    <li key={key.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-3.5 border-b border-gray-200 items-center">
                        <span className="font-medium break-words min-w-0">{key.label}</span>
                        <span className="row-span-2 col-start-2 row-start-1 justify-self-end">
                            {confirming === key.id
                                ? <>
                                    <button className={textButton} onClick={() => remove(key.id)}>{text("ApiKeys.Delete")}</button>
                                    <button className={`${textButton} ml-4 text-gray-500`} onClick={() => setConfirming(undefined)}>{text("ApiKeys.Keep")}</button>
                                </>
                                : <button className="p-2 rounded hover:bg-gray-100" onClick={() => setConfirming(key.id)} title={text("ApiKeys.Delete")} aria-label={`${text("ApiKeys.Delete")} ${key.label}`}>
                                    <span className="block w-4 h-4"><TrashIcon /></span>
                                </button>}
                        </span>
                        <span className="text-[13px] text-gray-500">
                            <b className="font-medium text-wfg">{key.role === EUserRole.READER ? text("ApiKeys.Read") : text("ApiKeys.Upload")}</b>
                            {` · ${text("ApiKeys.Created")} ${day(key.creation_date)} · `}
                            {key.expires_at ? <span className="text-wfg">{text("ApiKeys.ExpiresOn")} {day(key.expires_at)}</span> : text("ApiKeys.NoExpiry")}
                            {` · ${text("ApiKeys.LastUsed")} ${key.last_used_at ? day(key.last_used_at) : text("ApiKeys.NeverUsed")}`}
                        </span>
                    </li>
                ))}
            </ul>

            {secret &&
                <div className="mt-5 pt-4 border-t-[3px] border-wfg" role="status">
                    <b>{text("ApiKeys.NewKey")}</b>
                    <p className="mt-1 mb-3 text-gray-500">{text("ApiKeys.CopyNow")}</p>
                    <div className="flex flex-wrap items-center gap-3 p-3 rounded bg-gray-100">
                        <code className="flex-1 min-w-0 basis-64 text-xs break-all font-mono">{secret}</code>
                        <button className={button} onClick={copy}>{text("ApiKeys.Copy")}</button>
                    </div>
                    {copied && <div className="mt-2 font-medium">{text("ApiKeys.Copied")}</div>}
                </div>}

            <form className="flex flex-wrap items-end gap-x-4 gap-y-3 mt-6" onSubmit={create}>
                <label className="flex flex-col gap-1 min-w-0 grow basis-56">{text("ApiKeys.Name")}
                    <input className={field} required maxLength={60} value={label} onChange={event => setLabel(event.target.value)} />
                </label>
                <label className="flex flex-col gap-1">{text("ApiKeys.Can")}
                    <select className={field} value={keyRole} onChange={event => setKeyRole(+event.target.value)}>
                        <option value={EUserRole.READER}>{text("ApiKeys.Read")}</option>
                        {role >= EUserRole.CONTRIBUTOR && <option value={EUserRole.CONTRIBUTOR}>{text("ApiKeys.Upload")}</option>}
                    </select>
                </label>
                <label className="flex flex-col gap-1">{text("ApiKeys.Expires")}
                    <select className={field} value={days} onChange={event => setDays(event.target.value)}>
                        <option value="">{text("ApiKeys.Never")}</option>
                        <option value="30">{text("ApiKeys.Days30")}</option>
                        <option value="90">{text("ApiKeys.Days90")}</option>
                        <option value="365">{text("ApiKeys.Year")}</option>
                    </select>
                </label>
                <button type="submit" className={button} disabled={full || !label.trim()}>{text("ApiKeys.Create")}</button>
            </form>
            {full && <div className="mt-2 text-xs text-gray-500">{text("ApiKeys.Limit")}</div>}
            {failure !== undefined && <div className="mt-2 text-xs text-red-700" role="alert">{text("ApiKeys.Failed")} {failure})</div>}
        </div>
    );
};

export { ApiKeysBlock };
