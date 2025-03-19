import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Bracket as BracketType } from "@/Pages/Bracket/components/bracketTypes";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    // Uncomment and update when backend is ready:
    /*
    fetch("http://localhost:8000/getBrackets", {
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
        setBrackets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching brackets:", err);
        setError(err.message);
        setLoading(false);
      });
    */
    // For now, stop the loading indicator.
    setLoading(false);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brackets</h1>
      {loading && <p>Loading brackets...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && brackets.length > 0 ? (
        <ul>
          {brackets.map((bracket, index) => (
            <li key={index} className="mb-2 border p-2 rounded">
              <Bracket bracket={bracket} />
            </li>
          ))}
        </ul>
      ) : (
        !loading && !error && <p>No brackets found.</p>
      )}
      <Button
        onClick={() => setBrackets((prev) => [...prev, emptyBracket])}
        className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
      >
        CREATE NEW BRACKET
      </Button>
    </div>
  );
}
