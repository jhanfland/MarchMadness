import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import logo from "./../images/logo.png";

export function LiveScoresPage() {
        
    // useEffect(() => {march_maddness_data}, []);

    // const [items, setItems] = useState([]);

    // useEffect(() => {
    //     function grab_live_bracket_info() {
    //       fetch("http://localhost:8000/get_bracket", {
    //         method: "GET",
    //       })
    //         .then((response) => {
    //             if (!response.ok) {
    //             throw new Error("Failed to fetch brackets");
    //             }
    //             return response.json();
    //         });
    //     }
    // grab_live_bracket_info();
    // }, []);

    // var march_maddness_data = grab_live_bracket_info();

    function changeScores(buttonName){
        document.getElementById("title").innerHTML = buttonName;
        
        const newBox = document.createElement("div");
        const newBox2 = document.createElement("div");

        newBox.className = "score-box";
        newBox2.className =  "score-box";

        document.getElementById("boxes").appendChild(newBox);
        document.getElementById("boxes").appendChild(newBox2);

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
                <Button button={buttonIndex} className="live-scores-button" 
                        onClick={() => changeScores(buttonIndex.name)}>
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
                <div className="scores-box-container">
                    <p id="title">{buttons[0].name}</p>
                    <div className="columns-2" id="boxes">
                        
                    </div>
                </div>
        </div>
    );
}