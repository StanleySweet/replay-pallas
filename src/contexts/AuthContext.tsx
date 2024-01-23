/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import EUserRole from "../enumerations/EUserRole";
import { useState, ReactNode } from "react";
import { LoginPage } from "../pages/LoginPage";
import { AuthContext, IAuthContextType } from "./Models/IAuthContext";
import { hash } from "bcryptjs";
import { HeaderBar } from "../components/HeaderBar";
import axios from "axios";
import { PallasToken } from "../types/PallasToken";

interface IAuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider = (props: IAuthContextProviderProps) => {
    function getPreviousSession(): PallasToken | null {
        const data = localStorage.getItem("user-info");
        if (!data)
            return null;

        const previousSession = JSON.parse(data);
        // Handle expiration
        const tokenObj = JSON.parse(atob(previousSession?.token.split(".")[1] || ""));
        tokenObj.exp * 1000.0;
        if (tokenObj.exp * 1000 < Date.now()) {
            return null;
        }

        return previousSession;
    }

    const previousSession = getPreviousSession();

    const [isLogged, setIsLogged] = useState<boolean>(!!previousSession);
    const [token, setToken] = useState<string | null>(previousSession?.token ?? null);
    const [role, setRole] = useState<EUserRole>(previousSession?.role ?? EUserRole.UNKNOWN);
    const [nick, setNick] = useState<string | null>(previousSession?.nick ?? null);
    const [id, setId] = useState<number | null>(previousSession?.id ?? null);

    const value: IAuthContextType = {
        isLogged: isLogged,
        token: token, // If animator or coanimator
        role: role,
        nick: nick,
        id: id,
        onLogoutSession: handleLogout,
        onLoginSession: handleLogin,
    };

    function handleLogout()
    {
        localStorage.removeItem("user-info");
        setIsLogged(false);
    }

    function handleLogin(email: string, password: string): void {
        hash(password, '$2a$10$CwTycUXWue0Thq9StjUM0u', function (err, hashedPassword) {
            if (err) {
                console.error(err);
                return;
            }
            hash(email, '$2a$10$CwTycUXWue0Thq9SgjUM0u', async function (err2, hashedEmail) {
                if (err2) {
                    console.error(err2);
                    return;
                }

                const response = await axios.post(`http://localhost:8080/users/token`, {
                    email: hashedEmail,
                    password: hashedPassword,
                })

                if (response.status !== 200) {
                    console.log(response)
                }
                else {
                    const user: PallasToken = response.data;
                    setRole(user.role)
                    setToken(user.token);
                    setNick(user.nick);
                    setId(user.id);
                    localStorage.setItem("user-info", JSON.stringify(user));
                    setIsLogged(true);
                }
            });
        });

    }

    return (<>


        <AuthContext.Provider value={value}>
            <HeaderBar />
            <div className="flex w-full justify-start items-center flex-col " >

                {
                    isLogged ?
                        <>

                            {props.children}
                        </> :
                        <LoginPage onLogin={(email: string, password: string) => handleLogin(email, password)} />
                }
            </div>
        </AuthContext.Provider>
    </>

    );
}

export {
    AuthContextProvider
};

export type {
    IAuthContextProviderProps
}
