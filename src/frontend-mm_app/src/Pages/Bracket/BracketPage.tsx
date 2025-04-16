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
  const [selectedTeamsMap, setSelectedTeamsMap] = useState<Record<number, Record<string, string>>>({});
  const token = localStorage.getItem("token");
  const bracketRef = useRef<any>(null);

  useEffect(() => {
    async function fetchBrackets() {
      if (!token) {
        setError("Login required.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/get_user_bracket_numbers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { bracket_numbers } = await res.json();

        // loads each saved bracket from database
        const savedBrackets = await Promise.all(
          bracket_numbers.map(async (num) => {
            const res = await fetch(`${BACKEND_URL}/get_user_bracket/${num}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return data.bracket;
          })
        );

        // loads a blank bracket to get rounds of 64 teams for correct seeding
        const templateRes = await fetch(`${BACKEND_URL}/generate_bracket_template`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const template = await templateRes.json();

        // map to store user picks per bracket
        const selectionMap: Record<number, Record<string, string>> = {};
        
        // for each bracket, call func that pulls out user selections, and stores bracket in map
        const formatted: BracketType[] = savedBrackets.map((saved) => {
          const selected = extractSelectedTeamsFromBracket(saved);
          selectionMap[saved.id] = selected;

          // gives rnd 64 actual seeds and teamnames
          for (const region of ["EAST", "WEST", "SOUTH", "MIDWEST"]) {
            const seeds = template.regions[region];
            if (seeds?.length > 0) {
              saved.regions[region].rounds[0].seeds = seeds;
            }
          }

          // helper func to parse team name and seed from map
          const getTeam = (key: string) => {
            const val = selected[key];
            if (!val) return { name: "TBD" };
            const [seed, name] = val.split("-")[0].split("_");
            return { name, seed };
          };

          // manually builds out final four region
          saved.regions["FINAL_FOUR"] = {
            rounds: [
              {
                title: "Final Four",
                seeds: [
                  { id: 1, teams: [getTeam("3-0-EAST"), getTeam("3-0-MIDWEST")] },
                  { id: 2, teams: [getTeam("3-0-SOUTH"), getTeam("3-0-WEST")] },
                ],
              },
              {
                title: "National Championship",
                seeds: [
                  { id: 1, teams: [getTeam("0-0-FINAL FOUR"), getTeam("0-1-FINAL FOUR")] },
                ],
              },
              {
                title: "Champion",
                seeds: [
                  { id: 1, teams: [getTeam("1-0-FINAL FOUR"), { name: "TBD" }] },
                ],
              },
            ],
          };

          // returns bracket object with seeds and final four
          return saved;
        });

        // updates state to render correctly
        setBrackets(formatted);
        setSelectedTeamsMap(selectionMap);
      } catch (err) {
        console.error("Bracket load error:", err);
        setError("Could not load brackets.");
      } finally {
        setLoading(false);
      }
    }

    fetchBrackets();
  }, [token]);

  const extractSelectedTeamsFromBracket = (bracket: BracketType): Record<string, string> => {
    const selected: Record<string, string> = {};
  
    // loops through each region, round, seed, and team
    // constructs a selectedTeams object using a key of format
    // Final four key, and region key for main bracket rnds

    // OVERALL, function ensures every team lands in the correct
    // matchup when restoring a saved bracket
    for (const [region, regionObj] of Object.entries(bracket.regions)) {
      const isFinalFour = region === "FINAL_FOUR";
      const regionKey = isFinalFour ? "FINAL FOUR" : region;
  
      // iterates through base regions, rnds, seeds, teams
      regionObj.rounds?.forEach((round, roundIndex) => {
        round.seeds?.forEach((seed, seedIndex) => {
          seed.teams?.forEach((team, teamIndex) => {
            if (!team?.name || team.name === "TBD" || !team.seed) return;
  
            // final four and championship rounds - specia key
            if (isFinalFour) {
              const key = `${roundIndex}-${seedIndex}-${regionKey}`;
              const value = `${team.seed}_${team.name}-${seed.id}-${teamIndex}`;
              selected[key] = value;
            } else {
              // for Rounds 1–4, use `seed.id - 1` to recover original bracket position
              const key = `${roundIndex}-${seed.id - 1}-${regionKey}`;
              const value = `${team.seed}_${team.name}-${seed.id}-${teamIndex}`;
              selected[key] = value;
            }
          });
        });
      });
    }
  
    return selected;
  };

  // this func is what is used to dynamically render rounds
  // and fill in the teams based on the user picks, as this func
  // turns the raw seeds into a a full bracket to render
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
        { title: "Champion", seeds: [] },
      ],
    };
  
    return formatted;
  };
  

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
      /* update list of brackets and create bracket */
      setBrackets((prev) => [
        ...prev,
        {
          id: bracket_num_data.next_bracket_number,
          title: data.title,
          regions: convertToRoundsFormat(data.regions),
        },
      ]);
      setLoading(false);
    } catch (err) {
      console.error("Error with creating bracket:", err);
      setError("Failed to generate bracket.");
    }
  };

  const saveBracket = async (bracket_number: number) => {
    const token = localStorage.getItem("token");
  
    // Grab the parsed bracket from the reference.
    const bracket = bracketRef.current?.getParsedBracketData();
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
      console.log("Saved bracket response:", saveData);
  
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
        <ul>
          {brackets.map((bracket, index) => {
            const selectedTeams = selectedTeamsMap[bracket.id] || {};

            return (
              <li key={index} className="mb-2 border p-2 rounded">
                <div className="relative">
                  <Bracket
                    ref={bracketRef}
                    bracket={bracket}
                    liveBracket={false}
                    initialSelection={selectedTeams}
                    onChange={(newMap) =>
                      setSelectedTeamsMap((prev) => ({
                        ...prev,
                        [bracket.id]: newMap,
                      }))
                    }
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
              );
            })}
          </ul>
        ) : (
          !loading && !error && <p>No brackets found.</p>
        )}

          {score !== null && (
            <p className="text-xl font-bold mt-4">
              Score: {score}
            </p>
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

