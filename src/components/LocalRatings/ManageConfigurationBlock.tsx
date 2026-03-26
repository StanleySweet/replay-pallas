import axios, { AxiosResponse } from "axios";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useAuth } from "../../contexts/Models/IAuthContext";
import { useTranslation as translate } from "../../contexts/Models/useTranslation";
import { BlockTitle } from "../BlockTitle";

interface LocalRatingsOptionListItem {
    value: string | number | boolean
    label: string
}

interface LocalRatingsOption {
    type: string
    label: string
    tooltip: string
    config: string
    val: string | number | boolean
    min?: number
    max?: number
    dependencies?: string[]
    list?: LocalRatingsOptionListItem[]
}

interface LocalRatingsOptionCategory {
    label: string
    tooltip: string
    options: LocalRatingsOption[]
}

interface LocalRatingsOptionsPayload {
    categories: LocalRatingsOptionCategory[]
    values: Record<string, string | null>
}

const ManageConfigurationBlock = (): ReactNode => {
    const { token } = useAuth();
    const [categories, setCategories] = useState<LocalRatingsOptionCategory[]>([]);
    const [values, setValues] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string>();

    useEffect(() => {
        axios.get<LocalRatingsOptionsPayload, AxiosResponse<LocalRatingsOptionsPayload>>(`${import.meta.env.VITE_API_URL}/local-ratings/options`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            setCategories(response.data.categories);
            setValues(response.data.values);
            setIsLoading(false);
        }).catch(() => {
            setMessage(translate("ManageConfiguration.LoadError"));
            setIsLoading(false);
        });
    }, [token]);

    const setValue = (config: string, value: string) => {
        setValues(previous => ({
            ...previous,
            [config]: value
        }));
    };

    const isOptionEnabled = (option: LocalRatingsOption) =>
        !(option.dependencies ?? []).some(dependency => values[dependency] !== "true");

    const saveValues = () => {
        setIsSaving(true);
        setMessage(undefined);

        const payload = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, value ?? ""]));
        axios.put<Record<string, string>, AxiosResponse<Record<string, string | null>>>(`${import.meta.env.VITE_API_URL}/local-ratings/options`, {
            values: payload
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            setValues(response.data);
            setMessage(translate("ManageConfiguration.SaveSuccess"));
        }).catch(() => {
            setMessage(translate("ManageConfiguration.SaveError"));
        }).finally(() => {
            setIsSaving(false);
        });
    };

    const restoreDefaults = () => {
        setIsSaving(true);
        setMessage(undefined);

        axios.post<Record<string, never>, AxiosResponse<Record<string, string | null>>>(`${import.meta.env.VITE_API_URL}/local-ratings/options/restore-defaults`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => {
            setValues(response.data);
            setMessage(translate("ManageConfiguration.ResetSuccess"));
        }).catch(() => {
            setMessage(translate("ManageConfiguration.SaveError"));
        }).finally(() => {
            setIsSaving(false);
        });
    };

    const renderInput = (option: LocalRatingsOption): ReactNode => {
        const value = values[option.config] ?? String(option.val);
        const disabled = !isOptionEnabled(option) || isSaving;

        if (option.type === "boolean") {
            return (
                <input
                    type="checkbox"
                    checked={value === "true"}
                    disabled={disabled}
                    onChange={(evt: ChangeEvent<HTMLInputElement>) => setValue(option.config, evt.target.checked ? "true" : "false")}
                />
            );
        }

        if (option.type === "dropdown") {
            return (
                <select
                    value={value}
                    disabled={disabled}
                    onChange={(evt: ChangeEvent<HTMLSelectElement>) => setValue(option.config, evt.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-2"
                >
                    {
                        option.list?.map(item => (
                            <option key={`${option.config}-${item.value}`} value={String(item.value)}>{item.label}</option>
                        ))
                    }
                </select>
            );
        }

        return (
            <input
                type={option.type === "number" ? "number" : "text"}
                value={value}
                disabled={disabled}
                min={option.min}
                max={option.max}
                onChange={(evt: ChangeEvent<HTMLInputElement>) => setValue(option.config, evt.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
            />
        );
    };

    return (
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="ManageConfiguration.Title" />
            <p className="mb-4 text-gray-600">{translate("ManageConfiguration.Description")}</p>

            {
                isLoading ?
                    <div>{translate("App.LoadingInProgress")}</div> :
                    <>
                        <div className="space-y-6">
                            {
                                categories.map(category => (
                                    <div key={category.label} className="rounded border border-gray-300 p-4">
                                        <h3 className="mb-1 text-base font-semibold">{category.label}</h3>
                                        <p className="mb-4 text-sm text-gray-600">{category.tooltip}</p>
                                        <div className="space-y-3">
                                            {
                                                category.options.map(option => (
                                                    <div key={option.config} className="grid gap-2 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
                                                        <div>
                                                            <div className="font-medium">{option.label}</div>
                                                            <div className="text-xs text-gray-600">{option.tooltip}</div>
                                                        </div>
                                                        <div>{renderInput(option)}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={saveValues}
                                disabled={isSaving}
                                className="rounded bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                            >
                                {isSaving ? translate("App.LoadingInProgress") : translate("ManageConfiguration.Save")}
                            </button>
                            <button
                                onClick={restoreDefaults}
                                disabled={isSaving}
                                className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300 disabled:opacity-60"
                            >
                                {translate("ManageConfiguration.RestoreDefaults")}
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
    ManageConfigurationBlock
};
