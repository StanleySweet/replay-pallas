import { ReactNode } from "react"

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
        setEmail(email)
        if (!emailRegex.test(email)) {
            setEmailErrorVisible(true);
            return;
        }
        setEmailErrorVisible(false);
    }

    const validate_password = (password: string) => {
        setPassword(password)
        if (password.length <= 8) {
            setPasswordErrorVisible(true);
            return;
        }
        setPasswordErrorVisible(false);
    }

    const is_form_invalid = (): boolean => {
        return password.length < 8 || !emailRegex.test(email);
    }

    const register = () => {
        if (passwordErrorVisible || emailErrorVisible)
            return;


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

                console.log(email)

                const response = await axios.post<User,AxiosResponse<User>>(`http://localhost:8080/users/`, {
                    "password": hashedPassword,
                    "email": hashedEmail,
                    "nick": nick
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.id !== 0)
                {
                    console.log(response.data)
                    props.onLogin(email, password);
                }
            });
        });



    }

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
                onChange={(value) => validate_email(value.target.value)} />
            <span className="text-xs text-red-500" style={{ display: emailErrorVisible ? "block" : "none" }}>Invalid e-mail address</span>
            <label htmlFor="nick_input" className="flex select-none font-roboto text-black">
                {translate("LoginPage.NickFieldLabel")}
            </label>
            <input
                type="text"
                id="nick_input"
                name="nick_input"
                required
                value={nick}
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



                onChange={(value) => setNick(value.target.value)} />
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

                onChange={(value) => validate_password(value.target.value)} />

            <span className="text-xs text-red-500" style={{ display: passwordErrorVisible ? "block" : "none" }}>Password must be at least 8 characters long</span>
            <button disabled={is_form_invalid()} onClick={() => { register() }} className="flex my-3 relative self-center bg-wfg text-white font-roboto justify-center text-center items-center hover:bg-white hover:text-wfg hover:border-wfg" style={{
                width: "100%",
                height: "50px",
                fontSize: "14px",
                fontWeight: "900",
                lineHeight: "14px",
                textTransform: "uppercase",
                fontStyle: "normal",
                border: "2px solid #000000",

            }}
            >{translate("LoginPage.Register")}</button>
        </div>
    );
}


export {
    RegisterBlock
}
