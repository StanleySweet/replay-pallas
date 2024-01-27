import { ReactNode } from "react";
import { WipBlock } from "./WipBlock";
import { BlockTitle } from "../BlockTitle";

const ManageConfigurationBlock = (): ReactNode => {
    return (<>
        <div className="text-sm p-6 bg-white shadow-md wfg-chart-tab">
            <BlockTitle titleKey="LatestUser.Title" />
            <WipBlock />
        </div>
    </>);
}

export {
    ManageConfigurationBlock
}
