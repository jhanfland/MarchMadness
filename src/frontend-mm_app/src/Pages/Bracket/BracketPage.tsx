import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Bracket as BracketType, Team, Seed, Round } from "@/Pages/Bracket/components/bracketTypes";

// Create a default empty bracket for March Madness with all rounds.
const emptyBracket: BracketType = {
  id: Date.now(), 
  title: "New March Madness Bracket",
  rounds: [
    { title: "Round of 64", seeds: [] },
    { title: "Round of 32", seeds: [] },
    { title: "Sweet 16", seeds: [] },
    { title: "Elite 8", seeds: [] },
    { title: "Final Four", seeds: [] },
    { title: "National Championship", seeds: [] },
  ],
};

export default function BracketPage() {
  const [brackets, setBrackets] = useState<BracketType[]>([]);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("Updated brackets", brackets);
  }, [brackets]);  // This will run when `brackets` state changes

  function formatDataIntoBracketStructure(data : any): any {
    const roundObjArray: Round[] = []
    data.rounds.forEach((round : any, idx1 : any) => {
      // Skip the First Four
      if (idx1 != 0) {
        // is in bracketed information
        const seedArray : Seed[] = [];
        if (idx1 < 5) {
          round.bracketed.forEach((region: any, idx2: any) => {
            region.games.forEach((game : any, idx3: any) => {
              // grabs team info
              const awayTeam : Team = {name: game.away.alias };
              const homeTeam : Team = {name: game.home.alias };
              // puts team info into an array
              const teamArray : Team[] = [homeTeam, awayTeam];
              // creates info abouth the game
              const teamInfo : Seed = {id: game.id, teams: teamArray, date: new Date(game.scheduled).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), region: region.bracket.name.match(/^(\w+)/)?.[1].toUpperCase() || ""}
              // pushes all seed info into an array from a selected round
              seedArray.push(teamInfo)
            })
          })
          // is in game information after the final 4
        } else { 
          round.games.forEach((game : any) => {
              // grabs team info
              const awayTeam : Team = {name: game.away.alias };
              const homeTeam : Team = {name: game.home.alias };
              // puts team info into an array
              const teamArray : Team[] = [homeTeam, awayTeam];
              // creates info abouth the game
              const teamInfo : Seed = {id: game.id, teams: teamArray, date: new Date(game.scheduled).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              // pushes all seed info into an array from a selected round
              seedArray.push(teamInfo)
          })
        }
        // puts all seeds from a certain round into a round object then pushes it into an array to store all rounds
        const roundObj : Round = {title: round.name , seeds : seedArray};
        roundObjArray.push(roundObj);
      }
    })
    // will need to change id based on which bracket they have created
    const bracketObj: BracketType = {title: data.name , id: 1, rounds: roundObjArray }
    console.log("bracketObj", bracketObj)
    // updated brackets object
    if (brackets.length > 0) {
      setBrackets(prev => [...prev, bracketObj])
    } else {
      setBrackets([bracketObj])
    }
  }

  function create_raw_bracket() {
    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }
    // Uncomment and update when backend is ready:
    fetch("http://localhost:8000/get_bracket", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch brackets");
        }
        return response.json();
      })
      .then((data) => {
          console.log("data", data);
          setBrackets(prev => [...prev, formatDataIntoBracketStructure(data)]);
          setData(data);
      })
      .catch((err) => {
        console.error("Error fetching brackets:", err);
        setError(err.message);
        setLoading(false);
      });
    setLoading(false);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brackets</h1>
      {loading && <p>Loading brackets...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && brackets.length > 0 ? (
        <ul>
          {brackets.map((bracket, index) => (
            <li key={index} className="mb-2 border p-2 rounded">
              <Bracket bracket={brackets} />
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No brackets found.</p>
      )}
      <Button
        onClick={() => create_raw_bracket()}
        className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
      >
        CREATE NEW BRACKET
      </Button>
    </div>
  );
}
