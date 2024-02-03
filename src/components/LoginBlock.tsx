import { ReactNode, useEffect } from "react";

import { useState } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

interface ILoginPageProps {
    onLogin: (login: string, password: string) => void;
    loginFailed: boolean;
}

const LoginBlock = (props: ILoginPageProps): ReactNode => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {

    }, [props.loginFailed]);

    return (
        <div className="flex flex-col gap-2 relative justify-start w-full">
            <form>
                <label htmlFor="email_input" className="flex select-none font-roboto text-black">
                    {translate("LoginPage.EmailFieldLabel")}
                </label>
                <input
                    type="email"
                    id="email_input"
                    className="bg-white border-solid border-[1px] rounded w-full"
                    name="email_input"
                    required
                    value={email}
                    style={{
                        width: "100%",
                        padding: "8px 10px",
                        height: "40px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                    }}

                    onChange={(value) => setEmail(value.target.value)} />
                <label htmlFor="password_input" className="flex select-none font-roboto text-black">
                    {translate("LoginPage.PasswordFieldLabel")}
                </label>
                <input
                    type="password"
                    id="password_input"
                    name="password_input"
                    autoComplete="on"
                    required
                    className="flex relative font-roboto text-black bg-slate-50  border-solid border-[1px] rounded w-full"
                    value={password}
                    style={{
                        width: "100%",
                        padding: "8px 10px",
                        height: "40px",
                        borderRadius: "4px",
                        border: "1px solid #A1AABC",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                    }}

                    onChange={(value) => setPassword(value.target.value)} />
            </form>
            <button onClick={() => { props.onLogin(email, password); }} className="w-80 flex my-3 relative self-center bg-wfg text-white dark:text-slate-900 font-roboto justify-center text-center items-center hover:bg-slate-50 dark:hover:text-wfg hover:text-wfg hover:border-2 hover:border-solid hover:border-wfg" style={{
                height: "50px",
                fontSize: "14px",
                fontWeight: "900",
                lineHeight: "14px",
                textTransform: "uppercase",
                fontStyle: "normal",

            }}
            >{translate("LoginPage.Login")}</button>
            <span className="text-xs text-red-500" style={{ display: props.loginFailed ? "block" : "none" }}>We could not log you in. Please check your username or password.</span>
        </div>
    );
};


export {
    LoginBlock
};
