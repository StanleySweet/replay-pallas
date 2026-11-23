/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import EUserRole from "../enumerations/EUserRole";
import { useState, ReactNode, useEffect } from "react";
import { LoginPage } from "../pages/LoginPage";
import { AuthContext, IAuthContextType } from "./Models/IAuthContext";
import { hash } from "bcryptjs";
import { HeaderBar } from "../components/HeaderBar";
import axios from "axios";
import { PallasToken } from "../types/PallasToken";

// Send the session cookie with every call to the API.
axios.defaults.withCredentials = true;

const SESSION_MARKER = "session";

interface IAuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider = (props: IAuthContextProviderProps) => {
    // The token itself is in an httpOnly cookie the page cannot read. What is kept here is only who is logged
    // in, to draw the page. The cookie decides: when it is gone or expired the API answers 401 and the
    // interceptor below logs out. A session saved by the earlier version holds a token and no cookie, so it
    // is dropped and the person logs in again.
    function getPreviousSession(): Omit<PallasToken, "token"> | null {
        const data = localStorage.getItem("user-info");
        if (!data)
            return null;

        const previousSession = JSON.parse(data);
        if (previousSession?.token) {
            localStorage.removeItem("user-info");
            return null;
        }

        return previousSession;
    }

    const previousSession = getPreviousSession();

    // "session" stands for the cookie: it is only here so that what depends on being logged in loads again
    // when that changes. It is not sent anywhere.
    const [isLogged, setIsLogged] = useState<boolean>(!!previousSession);
    const [token, setToken] = useState<string | null>(previousSession ? SESSION_MARKER : null);
    const [role, setRole] = useState<EUserRole>(previousSession?.role ?? EUserRole.UNKNOWN);
    const [nick, setNick] = useState<string | null>(previousSession?.nick ?? null);
    const [id, setId] = useState<number | null>(previousSession?.id ?? null);
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

    const value: IAuthContextType = {
        isLogged: isLogged,
        token: token, // If animator or coanimator
        role: role,
        nick: nick,
        id: id,
        onLogoutSession: handleLogout,
        onLoginSession: handleLogin,
    };

    function clearSession()
    {
        localStorage.removeItem("user-info");
        setToken(null);
        setRole(EUserRole.UNKNOWN);
        setNick(null);
        setId(null);
        setIsLogged(false);
    }

    function handleLogout()
    {
        // Only the server can clear an httpOnly cookie.
        axios.post(`${import.meta.env.VITE_API_URL}/users/logout`).catch(console.error);
        clearSession();
    }

    // A 401 on a call made with a session means the cookie is gone or expired.
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(response => response, error => {
            if (error?.response?.status === 401 && localStorage.getItem("user-info"))
                clearSession();
            return Promise.reject(error);
        });
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    function handleLogin(email: string, password: string): void {
        hash(password, import.meta.env.VITE_PASSWORD_SALT, function (err, hashedPassword) {
            if (err) {
                console.error(err);
                return;
            }
            hash(email, import.meta.env.VITE_EMAIL_SALT, async function (err2, hashedEmail) {
                if (err2) {
                    console.error(err2);
                    return;
                }

                // The plain password goes over HTTPS and the server hashes it with a salt per user. The old
                // hash is sent beside it only so an account made before that can move over on this login.
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/token`, {
                    email: hashedEmail,
                    password: password,
                    legacy: hashedPassword,
                });

                if (response.status !== 200) {
                    setLoginFailed(true);
                }
                else {
                    // The response body still carries the token for scripts; the browser lives on the cookie.
                    const { role: userRole, nick: userNick, id: userId }: PallasToken = response.data;
                    setRole(userRole);
                    setToken(SESSION_MARKER);
                    setNick(userNick);
                    setId(userId);
                    localStorage.setItem("user-info", JSON.stringify({ role: userRole, nick: userNick, id: userId }));
                    setIsLogged(true);
                    setLoginFailed(false);
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
                        <LoginPage loginFailed={loginFailed} onLogin={(email: string, password: string) => handleLogin(email, password)} />
                }
            </div>
        </AuthContext.Provider>
    </>

    );
};

export {
    AuthContextProvider
};

export type {
    IAuthContextProviderProps
};
