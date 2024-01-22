/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * SPDX-FileCopyrightText: © 2024 Stanislas Daniel Claude Dolcini
 */

import { ReactNode } from "react";
import { BlockTitle } from "../components/BlockTitle";
import { Link } from "react-router-dom";
import { useTranslation as translate } from "../contexts/Models/useTranslation";
import { NavigationBar } from "../components/NavigationBar";
import { HouseIcon } from "../icons/HouseIcon";

const PrivacyPolicyPage = (): ReactNode => {
    return (<>

        <NavigationBar />
        <div className="w-3/5 mx-auto py-5">

            <div className="mb-5 inline-flex items-center" ><Link to="/Home" className="inline-flex items-center"><HouseIcon/>&nbsp;{translate("HomePage.Title")}&nbsp;</Link>{">"}&nbsp;{translate("PrivacyPolicy.Title")}</div>

            <div id="replay-container" className="text-sm p-6 bg-white shadow-md" style={{ border: "1px solid", borderRadius: "4px" }}>

                <div />
                <BlockTitle titleKey="PrivacyPolicy.Title"></BlockTitle>

                <p className="text-justify mt-2">
                    This Privacy Policy describes how Wildfire Games ("we,"
                    "us," or "our") collects, uses, and discloses information
                    about you when you use the Replay Pallàs web app and API
                    (the "Service").
                </p>
                <h3 className="font-semibold mt-1 mb-1">Information We Collect</h3>
                <p className="text-justify">
                    We collect information you provide directly to us, such as
                    your nickname and rating in the 0 A.D. game. We also collect
                    information about your use of the Service, such as the
                    matches you play and their associated metadata.
                </p>
                <h3 className="font-semibold mt-1 mb-1">Use of Information</h3>
                <p className="text-justify">
                    We use the information we collect to provide, maintain, and
                    improve the Service, to personalize your experience, and to
                    communicate with you about the Service. We may also use the
                    information for research and analytical purposes.
                </p>
                <p className="text-justify">
                    We do not share your personal information with third
                    parties, except as necessary to provide the Service or as
                    required by law. We may share aggregated or de-identified
                    information with third parties for research and analytical
                    purposes.
                </p>
                <h3 className="font-semibold mt-1 mb-1">Data Retention</h3>

                <p className="text-justify">
                    We retain the information we collect for as long as
                    necessary to provide the Service and for the purposes set
                    forth in this Privacy Policy. The exact length of time for
                    which this data is retained will depend on the specific
                    circumstances of each match and gameplay session, and will
                    be periodically reviewed and evaluated to ensure compliance
                    with the GDPR's data minimization principle.
                </p>
                <h3 className="font-semibold mt-1 mb-1">Your Rights</h3>

                Under the GDPR, you have the following rights:
                <ul className="list-disc list-inside">
                    <li className="text-justify">
                        Article 15 - Right of access: You have the right to
                        obtain confirmation as to whether or not personal data
                        concerning you is being processed, and if so, access to
                        that personal data.
                    </li>
                    <li className="text-justify">
                        Article 16 - Right to rectification: You have the right
                        to obtain rectification of inaccurate personal data
                        concerning you without undue delay.
                    </li>
                    <li className="text-justify">
                        Article 17 - Right to erasure (‘right to be forgotten’):
                        You have the right to obtain the erasure of personal
                        data concerning you without undue delay in certain
                        circumstances, such as when the personal data is no
                        longer necessary in relation to the purposes for which
                        it was collected or processed.
                    </li>

                    <li className="text-justify">
                        Article 18 - Right to restriction of processing: You
                        have the right to obtain restriction of processing of
                        your personal data in certain circumstances, such as
                        when the accuracy of the personal data is contested or
                        the processing is unlawful.
                    </li>
                    <li className="text-justify">
                        Article 20 - Right to data portability: You have the
                        right to receive the personal data concerning you, which
                        you have provided to us, in a structured, commonly used
                        and machine-readable format and have the right to
                        transmit that data to another controller without
                        hindrance from us.
                    </li>
                    <li className="text-justify">
                        Article 21 - Right to object: You have the right to
                        object to the processing of your personal data in
                        certain circumstances, such as when the processing is
                        based on our legitimate interests or for direct
                        marketing purposes.
                    </li>
                </ul>
                <p className="text-justify">
                    If you wish to exercise any of these rights, please contact
                    us using the contact details provided below. Please note
                    that we may ask you to verify your identity before
                    responding to such requests, and we will respond to your
                    request within one month of receipt. In certain
                    circumstances, we may be entitled to refuse to comply with
                    your request, such as when the request is manifestly
                    unfounded or excessive.
                </p>
                <h3 className="font-semibold mt-1 mb-1">Contact Us</h3>
                <p className="text-justify">
                    If you have any questions or concerns about our privacy
                    practices or this Privacy Policy, please contact us at stan
                    at wildfiregames.com.
                </p>
            </div>
            <div />
        </div>
    </>);
}

export {
    PrivacyPolicyPage
}
