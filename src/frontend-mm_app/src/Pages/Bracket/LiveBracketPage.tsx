import { Bracket as BracketType, Team, Seed, Round } from "@/Pages/Bracket/components/bracketTypes";
import { useState, useEffect } from "react";
import Bracket from "@/Pages/Bracket/components/bracket";

export default function LiveBracketPage() {
    // use state var to set live bracket
    const [liveBracket, setLiveBracket] = useState<BracketType []>([])
    // does not show info while waiting/loading info from the api
    const [loading, setLoading] = useState(true);

    // formats the data to make it consistent with our bracket structure
    function formatDataIntoBracketStructure(data : any): any {
        const roundObjArray: Round[] = []
        data.rounds.forEach((round : any, idx1 : any) => {
        // Skip the First Four
        if (idx1 != 0) {
            // is in bracketed information
            const seedArray : Seed[] = [];
            if (idx1 < 5) {
                const regionOrder = ["EAST", "MIDWEST", "SOUTH", "WEST",];
                // Sort regions based on the predefined order
                round.bracketed.sort((a: any, b: any) => {
                    return regionOrder.indexOf(a.bracket.name.match(/^(\w+)/)?.[1].toUpperCase()) - regionOrder.indexOf(b.bracket.name.match(/^(\w+)/)?.[1].toUpperCase());
                });
                round.bracketed.forEach((region: any, idx2: any) => {
                    // sort games
                    region.games.sort((a: any, b: any) => {
                        const gameNumberA = parseInt(a.title.match(/Game (\d+)/)?.[1]);
                        const gameNumberB = parseInt(b.title.match(/Game (\d+)/)?.[1]);
                        return gameNumberA - gameNumberB;
                    });
                    region.games.forEach((game : any, idx3: any) => {
                    console.log("games", game);
                    // grabs team info
                    const awayTeam : Team = {name: game.away.alias, seed: game.away.seed};
                    const homeTeam : Team = {name: game.home.alias, seed: game.home.seed };
                    // puts team info into an array
                    const teamArray : Team[] = [homeTeam, awayTeam];
                    // creates info abouth the game
                    const teamInfo : Seed = {id: game.id, teams: teamArray, homeScore: game.home_points, awayScore: game.away_points, date: new Date(game.scheduled).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), region: region.bracket.name.match(/^(\w+)/)?.[1].toUpperCase() || ""}
                    // pushes all seed info into an array from a selected round
                    seedArray.push(teamInfo)
                    })
                })
            // is in game information after the final 4
            } else { 
                round.games.forEach((game : any) => {
                    // grabs team info
                    const awayTeam : Team = {name: game.away.alias, seed: game.away.seed };
                    const homeTeam : Team = {name: game.home.alias, seed: game.home.seed };
                    // puts team info into an array
                    const teamArray : Team[] = [homeTeam, awayTeam];
                    // creates info abouth the game
                    const teamInfo : Seed = {id: game.id, teams: teamArray, region: 'FINAL FOUR', homeScore: game.home_points, awayScore: game.away_points, date: new Date(game.scheduled).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    // pushes all seed info into an array from a selected round
                    seedArray.push(teamInfo)
                })
            }
            // puts all seeds from a certain round into a round object then pushes it into an array to store all rounds
            const roundObj : Round = {title: round.name , seeds : seedArray};
            roundObjArray.push(roundObj);
        }
        })
        console.log("roundObjArrray", roundObjArray);
        // will need to change id based on which bracket they have created
        const bracketObj: BracketType = {title: data.name , id: 1, rounds: roundObjArray }
        // updated brackets object
        setLiveBracket([bracketObj]);
    };


    useEffect(() => {
        function grab_live_bracket_info() {
          fetch("http://localhost:8000/get_bracket", {
            method: "GET",
          })
            .then((response) => {
                if (!response.ok) {
                throw new Error("Failed to fetch brackets");
                }
                return response.json();
            })
            .then((data) => {
                formatDataIntoBracketStructure(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching brackets:", err);
            });
        }
    grab_live_bracket_info();
    }, []);

    return (
        <div>
            {loading ? <p>Loading brackets...</p> : <Bracket bracket={liveBracket} liveBracket={true} />}
        </div>
    );
}