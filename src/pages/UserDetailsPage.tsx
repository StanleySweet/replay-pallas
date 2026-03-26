/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { useParams } from "react-router-dom";
import { UserDetailsView } from "../components/UserDetailsView";

const UserDetailsPage = function (): JSX.Element {
    const { userId } = useParams();

    return <UserDetailsView requestUrl={`${import.meta.env.VITE_API_URL}/users/GetDetails/${userId}`} />;
};

export {
    UserDetailsPage
};
