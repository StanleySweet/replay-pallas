import axios, { AxiosResponse } from "axios";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";
import { BlockTitle } from "../BlockTitle";

interface AliasGroup {
    primary: string
    aliases: string[]
}

const emptyGroup = (): AliasGroup => ({
    primary: "",
    aliases: []
});

const ManageAliasesBlock = (): ReactNode => {
    const { token } = useAuth();
    const [groups, setGroups] = useState<AliasGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string>();

    useEffect(() => {
        axios.get<AliasGroup[], AxiosResponse<AliasGroup[]>>(`${import.meta.env.VITE_API_URL}/local-ratings/aliases`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            setGroups(response.data);
            setIsLoading(false);
        }).catch(() => {
            setMessage(translate("ManageAliases.LoadError"));
            setIsLoading(false);
        });
    }, [token]);

    const updateGroup = (index: number, group: AliasGroup) => {
        setGroups(previous => previous.map((entry, entryIndex) => entryIndex === index ? group : entry));
    };

    const onPrimaryChange = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
        updateGroup(index, {
            ...groups[index],
            primary: evt.target.value
        });
    };

    const onAliasesChange = (index: number, evt: ChangeEvent<HTMLInputElement>) => {
        updateGroup(index, {
            ...groups[index],
            aliases: evt.target.value.split(",").map(alias => alias.trim()).filter(Boolean)
        });
    };

    const addGroup = () => {
        setGroups(previous => [...previous, emptyGroup()]);
    };

    const removeGroup = (index: number) => {
        setGroups(previous => previous.filter((_, entryIndex) => entryIndex !== index));
    };

    const saveGroups = () => {
        setIsSaving(true);
        setMessage(undefined);

        axios.put<{ groups: AliasGroup[] }, AxiosResponse<AliasGroup[]>>(`${import.meta.env.VITE_API_URL}/local-ratings/aliases`, {
            groups
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            setGroups(response.data);
            setMessage(translate("ManageAliases.SaveSuccess"));
        }).catch(() => {
            setMessage(translate("ManageAliases.SaveError"));
        }).finally(() => {
            setIsSaving(false);
        });
    };

    return (
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="ManageAliases.Title" />
            <p className="mb-4 text-gray-600">{translate("ManageAliases.Description")}</p>

            {
                isLoading ?
                    <div>{translate("App.LoadingInProgress")}</div> :
                    <>
                        <div className="space-y-4">
                            {
                                groups.map((group, index) => (
                                    <div key={`${group.primary}-${index}`} className="rounded border border-gray-300 p-4">
                                        <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                                    {translate("ManageAliases.Primary")}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={group.primary}
                                                    onChange={evt => onPrimaryChange(index, evt)}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                    placeholder={translate("ManageAliases.PrimaryPlaceholder")}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-semibold uppercase text-gray-600">
                                                    {translate("ManageAliases.Aliases")}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={group.aliases.join(", ")}
                                                    onChange={evt => onAliasesChange(index, evt)}
                                                    className="w-full rounded border border-gray-300 px-3 py-2"
                                                    placeholder={translate("ManageAliases.AliasesPlaceholder")}
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <button
                                                    onClick={() => removeGroup(index)}
                                                    className="rounded bg-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-300"
                                                >
                                                    {translate("ManageAliases.Remove")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={addGroup}
                                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
                            >
                                {translate("ManageAliases.AddGroup")}
                            </button>
                            <button
                                onClick={saveGroups}
                                disabled={isSaving}
                                className="rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {isSaving ? translate("App.LoadingInProgress") : translate("ManageAliases.Save")}
                            </button>
                        </div>

                        {
                            message ?
                                <div className="mt-4 text-sm text-gray-700">{message}</div> :
                                null
                        }
                    </>
            }
        </div>
    );
};

export {
    ManageAliasesBlock
};
