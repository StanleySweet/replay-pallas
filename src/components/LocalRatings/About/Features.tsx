import { ReactNode } from "react";
import aboutData from './about.json'
import { uid } from "chart.js/helpers";

const Features = (): ReactNode => {
    return (
        <div className="max-h-[265px] overflow-y-scroll overflow-x-auto overflow-hidden text-justify pr-4">
            {
                aboutData["Features"].map(a => {
                    return <span key={uid()}><h3 className="font-semibold mt-1 mb-1">{a.title}</h3>
                        {a.text.map((b) => <p key={uid()} className="text-justify">{b}</p>)}
                    </span>
                })
            }
        </div>
    );
}

export {
    Features
}
