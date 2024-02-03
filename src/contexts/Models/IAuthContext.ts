/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import React from "react";
import EUserRole from "../../enumerations/EUserRole";
import { useContext } from "react";

interface IAuthContextType {
    isLogged: boolean,
    token: string | null,
    role: EUserRole,
    nick: string | null,
    id: number | null,
    onLogoutSession: () => void
    onLoginSession: (email: string, password: string) => void,
}

/**
 * Allow accessing the authorization context.
 * @returns the context.
 */
const useAuth = () => {
    const context = useContext<IAuthContextType | undefined>(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }
    return context!;
};

const AuthContext = React.createContext<IAuthContextType | undefined>(undefined);

export {
    AuthContext,
    useAuth
};

export type {
    IAuthContextType
};
