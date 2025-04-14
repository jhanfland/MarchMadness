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
  const [selectedTeamsMap, setSelectedTeamsMap] = useState<Record<number, Record<string, string>>>({});

  const token = localStorage.getItem("token");
  //const bracketRef = useRef<any>(null);

  useEffect(() => {
    async function fetchBrackets() {
      if (!token) {
        setError("Please log in to see or create brackets");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/get_user_bracket_numbers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { bracket_numbers } = await res.json();

        const bracketsData = await Promise.all(
          bracket_numbers.map(async (num) => {
            const bracketRes = await fetch(`${BACKEND_URL}/get_user_bracket/${num}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const bracketJson = await bracketRes.json();
            return bracketJson.bracket;
          })
        );

        setBrackets(bracketsData);
      } catch (err) {
        console.error("Error fetching saved brackets:", err);
        setError("Could not load saved brackets.");
      } finally {
        setLoading(false);
      }
    }

    fetchBrackets();
  }, [token]);
    // TODO: will need to add fetch bracket logic when we can save brackets
    // const fetchBrackets = async () => {
    // };
    // fetchBrackets();

    const convertToRoundsFormat = (regionSeeds: Record<string, Seed[]>) => {
      const regionNames = ["EAST", "WEST", "SOUTH", "MIDWEST"];
      const roundTitles = ["First Round", "Second Round", "Sweet 16", "Elite 8"];
      const formatted: any = {};
    
      for (const region of regionNames) {
        formatted[region] = {
          rounds: roundTitles.map((title, idx) => ({
            title,
            seeds: idx === 0 ? regionSeeds[region] || [] : [],
          })),
        };
      }
    
      formatted["FINAL_FOUR"] = {
        rounds: [
          { title: "Final Four", seeds: [] },
          { title: "National Championship", seeds: [] },
        ],
      };
    
      return formatted;
    };
    
    function parseSelectedTeamData(bracket: BracketType, selectedTeams: Record<string, string>) {
      const regionNames = ["EAST", "WEST", "SOUTH", "MIDWEST"];
      const roundTitles = ["First Round", "Second Round", "Sweet 16", "Elite 8"];
    
      const requiredKeys: string[] = [];
    
      // Add 63 required matchups
      for (const region of regionNames) {
        for (let i = 0; i < 8; i++) requiredKeys.push(`0-${i}-${region}`);
        for (let i = 0; i < 4; i++) requiredKeys.push(`1-${i}-${region}`);
        for (let i = 0; i < 2; i++) requiredKeys.push(`2-${i}-${region}`);
        requiredKeys.push(`3-0-${region}`);
      }
      requiredKeys.push(`0-0-FINAL FOUR`, `0-1-FINAL FOUR`, `1-0-FINAL FOUR`);
    
      const isComplete = requiredKeys.every((key) => key in selectedTeams);
      console.log("Selected Keys:", Object.keys(selectedTeams).sort());
      console.log("Required Keys:", requiredKeys.sort());
      console.log("Missing Keys:", requiredKeys.filter((key) => !(key in selectedTeams)));
      if (!isComplete) return undefined;
    
      const regions: any = {};
    
      for (const region of regionNames) {
        regions[region] = { rounds: roundTitles.map((title) => ({ title, seeds: [] })) };
      }
    
      regions.FINAL_FOUR = {
        rounds: [
          { title: "Final Four", seeds: [] },
          { title: "National Championship", seeds: [] },
        ]
      };
    
      for (const [key, value] of Object.entries(selectedTeams)) {
        const [roundStr, indexStr, region] = key.split("-");
        const roundIndex = parseInt(roundStr);
        const seedId = parseInt(indexStr) + 1;
        const teamIndex = parseInt(value.split("-")[1]);
        const [teamSeed, teamName] = value.split("-")[0].split("_");
    
        if (!regions[region]) continue; // skip if region missing
    
        if (!regions[region].rounds[roundIndex]) {
          // add round object if not there
          regions[region].rounds[roundIndex] = { title: `Round ${roundIndex + 1}`, seeds: [] };
        }
    
        if (!regions[region].rounds[roundIndex].seeds[seedId - 1]) {
          regions[region].rounds[roundIndex].seeds[seedId - 1] = {
            id: seedId,
            teams: [{ name: "TBD" }, { name: "TBD" }],
          };
        }
    
        regions[region].rounds[roundIndex].seeds[seedId - 1].teams[teamIndex] = {
          name: teamName,
          seed: teamSeed,
        };
      }
    
      return {
        id: bracket.id,
        title: bracket.title,
        regions,
      };
    }

  const createBracket = async () => {
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

      const newBracket = {
        id: bracket_num_data.next_bracket_number,
        title: data.title,
        regions: convertToRoundsFormat(data.regions),
      };

      /* update list of brackets and create bracket */
      setBrackets((prev) => [...prev, newBracket]);
      setSelectedTeamsMap((prev) => ({ ...prev, [newBracket.id]: {} }));

      setLoading(false);
    } catch (err) {
      console.error("Error with creating bracket:", err);
      setError("Failed to generate bracket.");
    }
  };

  const saveBracket = async (bracket_number: number, bracket: BracketType) => {
    const selectedTeams = selectedTeamsMap[bracket_number];
    const parsed = parseSelectedTeamData(bracket, selectedTeams);
    
    if (!parsed) {
      alert("Please finish all 63 picks before saving!");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/create_user_bracket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bracket_number,
          bracket_selection: parsed,
        }),
      });

      const data = await response.json();
      console.log("Saved bracket response:", data);
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
      <ul>
        {brackets.map((bracket, index) => {
          const selectedTeams = selectedTeamsMap[bracket.id] || {};

          return (
            <li key={index} className="mb-2 border p-2 rounded">
              <div className="relative">
                <Bracket
                  bracket={bracket}
                  liveBracket={false}
                  onChange={(newMap) =>
                    setSelectedTeamsMap((prev) => ({ ...prev, [bracket.id]: newMap }))
                  }
                />
                <div className="absolute bottom-2 right-2">
                  <Button
                    onClick={() => saveBracket(bracket.id, bracket)}
                    className="bg-[var(--primary-color)] font-bold hover:bg-blue-900"
                  >
                    SAVE BRACKET
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    ) : (
      !loading && !error && <p>No brackets found.</p>
    )}

    {token && (
      <Button
        onClick={createBracket}
        className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
      >
        CREATE NEW BRACKET
      </Button>
    )}
  </div>
);
}