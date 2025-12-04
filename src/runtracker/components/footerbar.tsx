import { FooterIcon } from "./footericon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function FooterBar() {
    const [mainSection, setMainSection] = useState<string>("run");
    const navigate = useNavigate();
    const onClickFactory = (section: string, targetPath: string) => () => {
        setMainSection(section);
        navigate(targetPath);
    }
    return (
        <div className="flex justify-around items-center w-full h-full my-2">
            <FooterIcon variant={mainSection === "run" ? "secondary" : "ghost"} onClick={onClickFactory("run", "")} type="run" />
            <FooterIcon variant={mainSection === "charts" ? "secondary" : "ghost"} onClick={onClickFactory("charts", "/charts")} type="chart" />
        </div>
    );
}
