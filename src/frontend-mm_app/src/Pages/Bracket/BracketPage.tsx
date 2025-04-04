import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Bracket as BracketType,
  Seed,
} from "@/Pages/Bracket/components/bracketTypes";

const BACKEND_URL = "http://localhost:8000"

export default function BracketPage({ initialBrackets = [] }: { initialBrackets?: BracketType[] }) {
// "initialBrackets" for testability — allows tests to simulate empty or preset states without hardcoding logic (was "mockBracket" before)
  const [brackets, setBrackets] = useState<BracketType[]>(initialBrackets);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Please log in to see or create brackets");
    } else {
      setLoading(false);
    }
    // TODO: will need to add fetch bracket logic when we can save brackets
    // const fetchBrackets = async () => {
    // };
    // fetchBrackets();
  }, [token]);


  const createBracket = async () => {
    const token = localStorage.getItem("token");

    try {
      const API = await fetch(
        `${BACKEND_URL}/generate_bracket_template`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      /* needs 200 response (.ok is boolean for 200) */
      if (!API.ok) throw new Error("Failed to get bracket");
      /* saves data to react */
      const data = await API.json();
      /* update list of brackets and create bracket */
      setBrackets((prev) => [
        ...prev,
        {
          id: 1, // want to correspond to the next user bracket, may want to have a backend route to return the number of brackets the user has created
          title: data.title,
          regions: data.regions as Record<string, Seed[]>,
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Error with creating bracket:", err);
      setError("Failed to generate bracket.");
    }
  };

  console.log("brackets structure set by Stephen", brackets);
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

      {token ? (
        <Button
          onClick={() => createBracket()}
          className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
        >
          CREATE NEW BRACKET
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}
