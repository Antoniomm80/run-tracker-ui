import { FooterIcon } from "./footericon";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./footerbar.css";

export function FooterBar() {
    const [mainSection, setMainSection] = useState<string>("run");
    const navigate = useNavigate();
    const onClickFactory = (section: string, targetPath: string) => () => {
        setMainSection(section);
        navigate(targetPath);
    }
    return (
        <div className="flex justify-around items-center w-full h-full footer-bar">
            <FooterIcon variant={mainSection === "run" ? "light" : "transparent"} onClick={onClickFactory("run", "")} type="run" />
            <FooterIcon variant={mainSection === "charts" ? "light" : "transparent"} onClick={onClickFactory("charts", "/charts")} type="chart" />
        </div>
    );
}
