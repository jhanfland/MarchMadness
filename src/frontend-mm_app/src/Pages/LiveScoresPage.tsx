import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import grab_live_bracket_info from "./Bracket/LiveBracketPage";
import logo from "./../images/logo.png";

export function LiveScoresPage() {
        
    var march_maddness_data = grab_live_bracket_info();
    useEffect(() => {march_maddness_data}, []);
    console.log(march_maddness_data)

    return (
        <div>
            <ButtonBar>
                <Button className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            Round of 64
                        </p>
                        <p className="text-xs text-neutral-400">                        
                            Mar 20 - 21
                        </p>
                    </div>
                </Button>
                    
                <Button className="live-scores-button"> 
                    <div>
                        <p className="whitespace-pre-line">
                            Round of 32
                        </p>
                        <p className="text-xs text-neutral-400">
                            Mar 22 - 23
                        </p>
                    </div>
                </Button>

                <Button className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            Sweet 16
                        </p>
                        <p className="text-xs text-neutral-400">
                            Mar 27 - 28
                        </p>
                    </div>
                </Button>

                <Button className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            Elite 8
                        </p>
                        <p className="text-xs text-neutral-400">
                            Mar 29 - 30 
                        </p>
                    </div>
                </Button>

                <Button className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            Final 4
                        </p>
                        <p className="text-xs text-neutral-400">
                            Apr 5
                        </p>
                    </div>
                </Button>

                <Button className="live-scores-button">
                    <div>
                        <p className="whitespace-pre-line">
                            Final
                        </p>
                        <p className="text-xs text-neutral-400">
                            Apr 7
                        </p>
                    </div>
                </Button>

            </ButtonBar>
        </div>
    );
}