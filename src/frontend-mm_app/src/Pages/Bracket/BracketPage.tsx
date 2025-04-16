import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
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
  const [score, setScore] = useState<number | null>(null);
  const token = localStorage.getItem("token");
  const bracketRefs = useRef<Record<number, any>>({}); // multiple refs for each bracket

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
    // const token = localStorage.getItem("token");

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

      const bracket_number = await fetch(
        `${BACKEND_URL}/get_user_bracket_id`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      /* needs 200 response (.ok is boolean for 200) */
      if (!API.ok) throw new Error("Failed to get bracket");
      if (!bracket_number.ok) throw new Error("Failed to collect bracket id/number");
      /* saves data to react */
      const data = await API.json();
      const bracket_num_data = await bracket_number.json();
      console.log("Bracket number data:", bracket_num_data);
      /* update list of brackets and create bracket */
      setBrackets((prev) => [
        ...prev,
        {
          id: bracket_num_data.next_bracket_number,
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

  const saveBracket = async (bracket_number: number) => {
  
    // Get the specific bracket ref for this bracket number
    const bracketRef = bracketRefs.current[bracket_number];
    if (!bracketRef) {
      console.error(`No ref found for bracket ${bracket_number}`);
      setError("Failed to save bracket: Reference not found");
      return;
    }
    
    // Grab the parsed bracket from the reference.
    const bracket = bracketRef.getParsedBracketData();
    console.log("parsedBracketData", bracket);
    if (!bracket) {
      alert("Please finish all 63 picks before saving!");
      return;
    }
  
    try {
      // Save user bracket via the create_user_bracket endpoint.
      const saveResponse = await fetch(`${BACKEND_URL}/create_user_bracket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bracket_number,
          bracket_selection: bracket,
        }),
      });
      const saveData = await saveResponse.json();
  
      // Retrieve the saved user bracket.
      const userBracketResponse = await fetch(`${BACKEND_URL}/get_user_bracket/${bracket_number}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userBracketData = await userBracketResponse.json();
      if (!userBracketData.bracket) {
        throw new Error("User bracket not found");
      }
  
      // Retrieve the live bracket from the external API endpoint.
      const liveBracketResponse = await fetch(`${BACKEND_URL}/get_bracket`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const liveBracketData = await liveBracketResponse.json();
      console.log("User bracket: ", userBracketData.bracket)
      console.log("Live Bracket: ", liveBracketData)
      // Call the scoring endpoint with both the user and live bracket JSON objects.
      const scoreResponse = await fetch(`${BACKEND_URL}/score_bracket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_bracket: userBracketData.bracket,
          live_bracket: liveBracketData,
        }),
      });
  
      if (!scoreResponse.ok) throw new Error("Scoring failed");
      const scoreData = await scoreResponse.json();
      console.log("Score data: ", scoreData)
      setScore(scoreData.score); // update the score state with returned score
    } catch (error) {
      console.error("Error saving bracket:", error);
      setError("Failed to save bracket.");
    }
  };
  
  console.log("brackets structure set by Stephen", brackets);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Brackets</h1>
      {loading && <p>Loading brackets...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && brackets.length > 0 ? (
        <>
          <ul>
            {brackets.map((bracket, index) => (
              <li key={index} className="mb-2 border p-2 rounded">
                <div className="relative">
                  <Bracket 
                    ref={(el) => { if (el) { bracketRefs.current[bracket.id] = el; }}}
                    bracket={bracket} 
                    liveBracket={false} 
                  />
                  <div className="absolute bottom-2 right-2">
                    <Button
                      onClick={() => saveBracket(bracket.id)}
                      className="bg-[var(--primary-color)] font-bold hover:bg-blue-900"
                    >
                      SAVE BRACKET
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {score !== null && (
            <p className="text-xl font-bold mt-4">
              Score: {score}
            </p>
          )}
        </>
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
