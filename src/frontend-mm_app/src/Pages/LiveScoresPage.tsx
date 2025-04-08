import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import grab_live_bracket_info from "./Bracket/LiveBracketPage";

export function LiveScoresPage() {
        
    var march_maddness_data = grab_live_bracket_info();
    useEffect(() => {march_maddness_data}, []);
    console.log(march_maddness_data)



    return (
        <div>
            <ButtonBar>
                <Button className="live-scores-button">
                    <p className="whitespace-pre-line">
                        Round of 64

                    </p>
                    <hr></hr>
                    <p className="text-xs">                        
                        Mar 20 - 21
                    </p>
                    
                </Button>
                    
                <Button className="live-scores-button"> 
                    Round of 32
                    <h1>
                        Mar 22 - 23
                    </h1>
                </Button>

                <Button className="live-scores-button">
                    Sweet 16
                    <h1>
                        Mar 27 - 28
                    </h1>

                </Button>

                <Button className="live-scores-button">
                    Elite 8
                    <h1>
                        Mar 29 - 30 
                    </h1>
                </Button>

                <Button className="live-scores-button">
                    Final 4
                    <h1>
                        Apr 5
                    </h1>
                </Button>

                <Button className="live-scores-button">
                    Final
                    <h1>
                        Apr 7
                    </h1>
                </Button>
            </ButtonBar>
        </div>
    );
}