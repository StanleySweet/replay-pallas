import { ReactNode } from "react";

import { useState } from "react";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import axios, { AxiosResponse } from "axios";
import { hash } from "bcryptjs";
import { User } from "../types/User";

interface ILoginPageProps {
    onLogin: (login: string, password: string) => void;
}

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const RegisterBlock = (props: ILoginPageProps): ReactNode => {
    const [email, setEmail] = useState<string>("");
    const [nick, setNick] = useState<string>("");
    const [emailErrorVisible, setEmailErrorVisible] = useState<boolean>(false);
    const [passwordErrorVisible, setPasswordErrorVisible] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

    const validate_email = (email: string) => {
        setEmail(email);
        if (!emailRegex.test(email)) {
            setEmailErrorVisible(true);
            return;
        }
        setEmailErrorVisible(false);
    };

    const validate_password = (password: string) => {
        setPassword(password);
        if (password.length < 8) {
            setPasswordErrorVisible(true);
            return;
        }
        setPasswordErrorVisible(false);
    };

    const is_form_invalid = (): boolean => {
        return password.length < 8 || !emailRegex.test(email);
    };

    const register = () => {
        if (passwordErrorVisible || emailErrorVisible)
            return;

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

                const response = await axios.post<User, AxiosResponse<User>>(`${import.meta.env.VITE_API_URL}/users/`, {
                    "password": hashedPassword,
                    "email": hashedEmail,
                    "nick": nick
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.data.id !== 0) {
                    props.onLogin(email, password);
                }
            });
        });



    };

    return (
        <div className="flex flex-col gap-2 relative justify-start w-full">
                <form>
                <label htmlFor="email_input" className="flex select-none font-roboto text-black">
                    {translate("LoginPage.EmailFieldLabel")}
                </label>
                <input
                    type="email"
                    id="email_input"
                    name="email_input"
                    className="bg-white border-solid border-[1px] rounded w-full"
                    required
                    value={email}
                    style={{
                        padding: "8px 10px",
                        height: "40px",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                    }}
                    onChange={(value) => validate_email(value.target.value)} />
                <span className="text-xs text-red-500" style={{ display: emailErrorVisible ? "block" : "none" }}>Invalid e-mail address</span>
                <label htmlFor="nick_input" className="flex select-none font-roboto text-black">
                    {translate("LoginPage.NickFieldLabel")}
                </label>
                <input
                    type="text"
                    className="bg-white border-solid border-[1px] rounded w-full"
                    id="nick_input"
                    name="nick_input"
                    value={nick}
                    style={{
                        padding: "8px 10px",
                        height: "40px",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                    }}



                    onChange={(value) => setNick(value.target.value)} />
                <label htmlFor="password_input" className="flex select-none font-roboto text-black">
                    {translate("LoginPage.PasswordFieldLabel")}
                </label>
                <input
                    type="password"
                    id="password_input"
                    autoComplete="on"
                    name="password_input"
                    required
                    className="flex relative font-roboto text-black bg-slate-50 border-slate-900 border-solid border-[1px] rounded w-full"
                    value={password}
                    style={{
                        padding: "8px 10px",
                        height: "40px",
                        fontSize: "14px",
                        fontWeight: "400",
                        lineHeight: "16px",
                    }}

                    onChange={(value) => validate_password(value.target.value)} />

                <span className="text-xs text-red-500" style={{ display: passwordErrorVisible ? "block" : "none" }}>Password must be at least 8 characters long</span>
               </form>
                <button disabled={is_form_invalid()} onClick={() => { register(); }} className="w-80 flex my-3 relative self-center bg-wfg  font-roboto justify-center text-center text-white dark:text-slate-900 items-center hover:bg-slate-50 hover:text-wfg dark:hover:text-wfg hover:border-2 hover:border-solid hover:border-wfg" style={{
                    height: "50px",
                    fontSize: "14px",
                    fontWeight: "900",
                    lineHeight: "14px",
                    textTransform: "uppercase",
                    fontStyle: "normal",

                }}
                >{translate("LoginPage.Register")}</button>
            </div>
    );
};


export {
    RegisterBlock
};
