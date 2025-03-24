import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Bracket as BracketType, Team, Seed, Round } from "@/Pages/Bracket/components/bracketTypes";

// Create a default empty bracket for March Madness with all rounds.
/*const emptyBracket: BracketType = {
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
}; */

export default function BracketPage() {
  const [brackets, setBrackets] = useState<BracketType[]>([]);
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");


  useEffect(() => {
    
  }, [])

  useEffect(() => {
    console.log("Updated brackets", brackets);
  }, [brackets]);  

  const createBracket = async () => {
    const token = localStorage.getItem("token");

    try {
      const API = await fetch("http://localhost:8000/generate_bracket_template", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      /* needs 200 response (.ok is boolean for 200) */
      if (!API.ok) throw new Error("Failed to get bracket");
      /* saves data to react */
      const data = await API.json();
      /* update list of brackets and create bracket */
      setBrackets(prev => [...prev, {
        id: data.id,
        title: data.title,
        regions: data.regions as Record<string, Seed[]>,
      }]);
      setLoading(false)
    } catch (err) {
      console.error("Error with creating bracket:", err);
      setError("Failed to generate bracket.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brackets</h1>
      {loading && <p>Loading brackets...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && brackets.length > 0 ? (
        <ul>
          {brackets.map((bracket, index) => (
            <li key={index} className="mb-2 border p-2 rounded">
              <Bracket bracket={bracket} liveBracket={false} />
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No brackets found.</p>
      )}
      <Button
        onClick={() => createBracket()}
        className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
      >
        CREATE NEW BRACKET
      </Button>
    </div>
  );
}
