import ButtonBar from "@/components/ui/buttonbar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import logo from "./../images/logo.png";

export function LiveScoresPage() {
    const [marchMadnessData, mmData] = useState(null);

    function changeScores(buttonName, data){
        console.log(data)
        // Changes name of button container (stored in element "title") with button name
        var title = document.getElementById("title");
        title.innerHTML = buttonName;
        title.className = "text-[22px] pb-6 pt-5";

        // Clears the children of the boxes container after every button press and
        // and when the page refreshes
        var container = document.getElementById("boxes");
        while (container.firstChild) {
            container.removeChild(container.firstChild);
          }

        function createNewElements(game){
            const newBox = document.createElement("div");
            newBox.className = "score-box";

            const away = document.createElement("div");
            const home = document.createElement("div");

            const name_away = document.createElement("p");
            const name_home = document.createElement("p");
            const score_away = document.createElement("p");
            const score_home = document.createElement("p");

            name_away.innerHTML = game.away.alias;
            name_home.innerHTML = game.home.alias;
            score_away.innerHTML = game.away_points;
            score_home.innerHTML = game.home_points;
            name_away.className = "mr-auto";
            name_home.className = "mr-auto";

            const away_square = document.createElement("div");
            away_square.className = "valid-square";
            away.appendChild(away_square);
            away.appendChild(name_away);
            away.appendChild(score_away);

            const home_square = document.createElement("div");
            home_square.className = "valid-square";
            home.appendChild(home_square);
            home.appendChild(name_home);
            home.appendChild(score_home);

            // Changes text size and font based who won the game
            if(game.away_points < game.home_points){
                home.className = "font-semibold text-[16px] flex pb-[10px] pt-[10px]";
                away.className = "text-zinc-400 text-[16px] flex pb-[10px]";
            } else {
                home.className = "text-zinc-400 text-[16px] flex pb-[10px] pt-[10px]";
                away.className = "font-semibold text-[16px] flex pb-[10px]"
            }

            newBox.appendChild(home);
            newBox.appendChild(away);

            document.getElementById("boxes").appendChild(newBox);
        }

        data.rounds.forEach((round : any, index : any) => {
            // Skips "First Four" round
            if (index != 0) {
                // Only adds score boxes based on the button that was pressed
                if(round.name === buttonName){
                    if(index < 5){
                        round.bracketed.forEach((region : any) => {
                            region.games.forEach((game : any) => {
                                document.getElementById("boxes").className = "columns-2";
                                createNewElements(game);
                            });
                        });
                    } else {
                        round.games.forEach((game : any) => {
                            if(index == 6){
                                document.getElementById("boxes").className = "columns-1";
                            } else {
                                document.getElementById("boxes").className = "columns-2";
                            }
                                
                            createNewElements(game);
                        });
                    }
                }
            }
        })
    }

    // Data Fetch method that runs when the page is refreshed 
    useEffect(() => {
        function grab_bracket_data() {
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
        grab_bracket_data();
    }, []);    

    // ButtonBar dynamically adjusts itself based on how many dicts are in the 
    // "buttons" variable
    const buttons = [{name: "First Round", date:"Mar 20 - 21"},
                     {name: "Second Round", date: "Mar 22 - 23"},
                     {name: "Sweet 16", date: "Mar 27 - 28"},
                     {name: "Elite Eight", date: "Mar 29 - 30"},
                     {name: "Final Four", date: "Apr 5"},
                     {name: "National Championship", date: "Apr 7"}]

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