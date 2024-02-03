/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 * SPDX-FileCopyrightText: © 2024 Sébastien Maire
 * SPDX-FileCopyrightText: © 2024 Rafael Marques
 */

import { ReactNode, useState } from "react";
import { BlockTitle } from "../components/BlockTitle";
import { LoginBlock } from "../components/LoginBlock";
import { RegisterBlock } from "../components/RegisterBlock";
import { PrivacyPolicyBlock } from "./PrivacyPolicyPage";
interface ILoginPageProps {
    onLogin: (login: string, password: string) => void;
    loginFailed: boolean
}

enum ETabType {
    Login,
    Register,
    Policy,
}

const LoginPage = function (props: ILoginPageProps) {

    const [tabType, setTabType] = useState<ETabType>(ETabType.Login);
    let body: ReactNode;
    switch (tabType) {
        case ETabType.Register:
            body = <RegisterBlock onLogin={props.onLogin} />;
            break;
        case ETabType.Login:
            body = <LoginBlock loginFailed={props.loginFailed} onLogin={props.onLogin} />;
            break;
        default:
            body = <PrivacyPolicyBlock />;
            break;
    }

    return (
        <>
            <hr className="w-full col-span-5" />
            <div className="flex relative justify-center items-center select-none"
                style={{
                    width: "200px",
                    height: "79px",
                    minHeight: "79px",
                    minWidth: "200px",
                    backgroundImage: "url(https://play0ad.com/wp-content/uploads/2014/10/Empires-Ascendant-2048.png)",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                }} />

            <div className="md:w-2/5 sm:w-4/5 lg:md:w-2/5 sm:w-4/5 lg:w-2/5 xl:w-2/6 2xl:w-1/5">
                <div className="grid grid-cols-3 gap-x-1 mt-4 ">
                    <div onClick={() => setTabType(ETabType.Login)} className={(tabType === ETabType.Login ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Login</div>
                    <div onClick={() => setTabType(ETabType.Register)} className={(tabType === ETabType.Register ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Register</div>
                    <div onClick={() => setTabType(ETabType.Policy)} className={(tabType === ETabType.Policy ? "bg-white" : "bg-gray-300 hover:bg-white border border-b-1 border-solid border-gray-500") + " flex justify-center cursor-pointer py-2 px-4 focus:outline-none transition-all duration-500 ease-in-out wfg-tab"} >Privacy Policy</div>
                </div>
                <div className="flex flex-col bg-white p-8 wfg-chart-tab" >
                    <BlockTitle titleKey="LoginPage.WelcomeMessage" />
                    {body}
                </div>
            </div>

        </>);
};

export {
    LoginPage
};

export type {
    ILoginPageProps
};
