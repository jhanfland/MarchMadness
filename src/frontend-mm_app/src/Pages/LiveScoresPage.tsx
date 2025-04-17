import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import logo from "./../images/logo.png";

export function LiveScoresPage() {
    const [marchMadnessData, mmData] = useState(null);

    function changeScores(buttonName, data){
        console.log(data)
        document.getElementById("title").innerHTML = buttonName;

        var container = document.getElementById("boxes");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

        for (let i = 0; i < 10; i++) {
            const newBox = document.createElement("div");
            newBox.className = "score-box";
            const team = document.createElement("p");
            const score = document.createElement("p");
            team.innerHTML = "team";
            score.innerHTML = "score";
            newBox.appendChild(team);
            newBox.appendChild(score);
            
            document.getElementById("boxes").appendChild(newBox);
        } 
        
        // const newBox = document.createElement("div");
        // const newBox2 = document.createElement("div");

        // newBox.className = "score-box";
        // newBox2.className =  "score-box";

        // document.getElementById("boxes").appendChild(newBox);
        // document.getElementById("boxes").appendChild(newBox2);

    }

    useEffect(() => {
        function grab_live_bracket_info() {
          fetch("http://localhost:8000/get_bracket", {
            method: "GET",
          })
          .then((response) => {
            if (!response.ok) {
            throw new Error("Failed to get data");
            }
            return response.json();
        })
        .then((data) => {
            changeScores(buttons[0].name, data);
            mmData(data);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
        });
            
        }
    grab_live_bracket_info();
    }, []);    

    // ButtonBar dynamically adjusts itself based on how many dicts are in the 
    // "buttons" variable
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
                        onClick={() => changeScores(buttonIndex.name, marchMadnessData)}>
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
                    <p id="title"></p>
                    <div className="columns-2" id="boxes"></div>
                </div>
        </div>
    );
}