import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import grab_live_bracket_info from "./Bracket/LiveBracketPage";
import logo from "./../images/logo.png";

export function LiveScoresPage() {
        
    var march_maddness_data = grab_live_bracket_info();
    useEffect(() => {march_maddness_data}, []);
    console.log(march_maddness_data.toDateString)

    const umm = async () => {
        

    }

    const buttons = [{name: "Round of 64", date:"Mar 20 - 21"},
                     {name: "Round of 32", date: "Mar 22 - 23"},
                     {name: "Sweet 16", date: "Mar 27 - 28"},
                     {name: "Elite 8", date: "Mar 29 - 30"},
                     {name: "Final 4", date: "Apr 5"},
                     {name: "Final", date: "Apr 7"}]

    return (
        <div>
            <ButtonBar>
                { buttons.map((buttonIndex) =>  
                <Button button={buttonIndex} className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            {buttonIndex.name}
                        </p>
                        <p className="text-xs text-neutral-400">                        
                            {buttonIndex.date}
                        </p>
                    </div>
                </Button>
            ) }

            </ButtonBar>
        </div>
    );
}