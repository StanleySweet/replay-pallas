/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { ReactNode } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

interface ConfirmDialogProps {
    open: boolean
    message?: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

const ConfirmDialog = (props: ConfirmDialogProps): ReactNode => {
    if (!props.open)
        return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div role="dialog" aria-modal="true" className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                <p className="mb-6">{props.message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={props.onCancel}
                        className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
                    >
                        {translate("Common.Cancel")}
                    </button>
                    <button
                        onClick={props.onConfirm}
                        className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                    >
                        {props.confirmLabel ?? translate("Common.Confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export {
    ConfirmDialog
};