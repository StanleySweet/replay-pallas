import { ReactNode } from "react"

import { useState } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";

interface ILoginPageProps {
    onLogin: (login: string, password: string) => void;
}

const LoginBlock = (props: ILoginPageProps): ReactNode => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    return (
        <div className="flex flex-col gap-2 relative justify-start w-full">
            <label htmlFor="email_input" className="flex select-none font-roboto text-black">
                {translate("LoginPage.EmailFieldLabel")}
            </label>
            <input
                type="text"
                id="email_input"
                name="email_input"
                required
                value={email}
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

                onChange={(value) => setEmail(value.target.value)} />
            <label htmlFor="password_input" className="flex select-none font-roboto text-black">
                {translate("LoginPage.PasswordFieldLabel")}
            </label>
            <input
                type="password"
                id="password_input"
                name="password_input"
                required
                className="flex relative font-roboto text-black bg-brokenWhite"
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
            <button onClick={() => { props.onLogin(email, password); }} className="flex my-3 relative self-center bg-wfg text-white font-roboto justify-center text-center items-center hover:bg-white hover:text-wfg hover:border-wfg" style={{
                width: "100%",
                height: "50px",
                fontSize: "14px",
                fontWeight: "900",
                lineHeight: "14px",
                textTransform: "uppercase",
                fontStyle: "normal",
                border: "2px solid #000000",

            }}
            >{translate("LoginPage.Login")}</button>
        </div>
    );
}


export {
    LoginBlock
}
