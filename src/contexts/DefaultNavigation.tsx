/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useNavigate } from "react-router-dom";
import { useAuth } from "./Models/IAuthContext";
import { ReactNode, useEffect } from "react";
import EUserRole from "../enumerations/EUserRole";

interface IDefaultNavigationProps {
    children: ReactNode;
}

// Handles default navigation for the app
// Done in a tricky way to avoid rerender contexts when navigating causing issues with the MediaContext
const DefaultNavigation = (props: IDefaultNavigationProps) => {
    const navigate = useNavigate();
    const { role } = useAuth();
    useEffect(() => {
        if (role === EUserRole.UNKNOWN)
            return;
        else if (role === EUserRole.READER || role === EUserRole.CONTRIBUTOR)
            navigate("/Home");
        else
            navigate('/Administration');
    }, []);
    return (
        <>
            {props.children}
        </>
    );
};

export {
    DefaultNavigation
};

export type {
    IDefaultNavigationProps
};
