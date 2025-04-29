import Bracket from "@/Pages/Bracket/components/bracket";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import {
  Bracket as BracketType,
  Seed,
} from "@/Pages/Bracket/components/bracketTypes";

const BACKEND_URL = "http://localhost:8000";

export default function BracketPage({
  initialBrackets = [],
}: {
  initialBrackets?: BracketType[];
}) {
  const [brackets, setBrackets] = useState<BracketType[]>(initialBrackets);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scoresMap, setScoresMap] = useState<Record<number, number>>({});
  const [selectedTeamsMap, setSelectedTeamsMap] = useState<
    Record<number, Record<string, string>>
  >({});
  const token = localStorage.getItem("token");
  const bracketRefs = useRef<Record<number, any>>({});

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

        const savedBrackets = await Promise.all(
          bracket_numbers.map(async (num) => {
            const res = await fetch(`${BACKEND_URL}/get_user_bracket/${num}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            return data.bracket;
          }),
        );
        const rawBrackets = savedBrackets.map(b => JSON.parse(JSON.stringify(b)));

        const templateRes = await fetch(
          `${BACKEND_URL}/generate_bracket_template`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const template = await templateRes.json();

        const selectionMap: Record<number, Record<string, string>> = {};

        const formatted: BracketType[] = savedBrackets.map((saved) => {
          const selected = extractSelectedTeamsFromBracket(saved);
          selectionMap[saved.id] = selected;

          for (const region of ["EAST", "WEST", "SOUTH", "MIDWEST"]) {
            const seeds = template.regions[region];
            if (seeds?.length > 0) {
              saved.regions[region].rounds[0].seeds = seeds;
            }
          }

          const getTeam = (key: string) => {
            const val = selected[key];
            if (!val) return { name: "TBD" };
            const [seed, name] = val.split("-")[0].split("_");
            return { name, seed };
          };

          saved.regions["FINAL_FOUR"] = {
            rounds: [
              {
                title: "Final Four",
                seeds: [
                  {
                    id: 1,
                    teams: [getTeam("3-0-EAST"), getTeam("3-0-MIDWEST")],
                  },
                  { id: 2, teams: [getTeam("3-0-SOUTH"), getTeam("3-0-WEST")] },
                ],
              },
              {
                title: "National Championship",
                seeds: [
                  {
                    id: 1,
                    teams: [
                      getTeam("0-0-FINAL FOUR"),
                      getTeam("0-1-FINAL FOUR"),
                    ],
                  },
                ],
              },
              {
                title: "Champion",
                seeds: [
                  {
                    id: 1,
                    teams: [getTeam("1-0-FINAL FOUR"), { name: "TBD" }],
                  },
                ],
              },
            ],
          };

          return saved;
        });

        setBrackets(formatted);
        setSelectedTeamsMap(selectionMap);
        const liveRes = await fetch(`${BACKEND_URL}/get_bracket`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const liveBracket = await liveRes.json();
        
        // ── score the untouched clone, not the mutated one ───────────────
        const newScores: Record<number, number> = {};
        await Promise.all(
          rawBrackets.map(async (raw) => {
            const resp = await fetch(`${BACKEND_URL}/score_bracket`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                user_bracket: raw,        // << use the clean copy
                live_bracket: liveBracket,
              }),
            });
            const { score } = await resp.json();
            newScores[raw.id] = score;
          })
        );
        setScoresMap(newScores);


      } catch (err) {
        console.error("Bracket load error:", err);
        setError("Could not load brackets.");
      } finally {
        setLoading(false);
      }
    }

    fetchBrackets();
  }, [token]);

  const extractSelectedTeamsFromBracket = (
    bracket: BracketType,
  ): Record<string, string> => {
    const selected: Record<string, string> = {};

    for (const [region, regionObj] of Object.entries(bracket.regions)) {
      const isFinalFour = region === "FINAL_FOUR";
      const regionKey = isFinalFour ? "FINAL FOUR" : region;

      regionObj.rounds?.forEach((round, roundIndex) => {
        round.seeds?.forEach((seed, seedIndex) => {
          seed.teams?.forEach((team, teamIndex) => {
            if (!team?.name || team.name === "TBD" || !team.seed) return;

            if (isFinalFour) {
              const key = `${roundIndex}-${seedIndex}-${regionKey}`;
              const value = `${team.seed}_${team.name}-${seed.id}-${teamIndex}`;
              selected[key] = value;
            } else {
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
    try {
      const API = await fetch(`${BACKEND_URL}/generate_bracket_template`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const bracket_number = await fetch(`${BACKEND_URL}/get_user_bracket_id`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!API.ok) throw new Error("Failed to get bracket");
      if (!bracket_number.ok)
        throw new Error("Failed to collect bracket id/number");

      const data = await API.json();
      const bracket_num_data = await bracket_number.json();

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
    const bracketRef = bracketRefs.current[bracket_number];
    if (!bracketRef) {
      console.error(`No ref found for bracket ${bracket_number}`);
      setError("Failed to save bracket: Reference not found");
      return;
    }

    const token = localStorage.getItem("token");
    const bracket = bracketRef.getParsedBracketData();
    if (!bracket) {
      alert("Please finish all 63 picks before saving!");
      return;
    }

    try {
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

      const userBracketResponse = await fetch(
        `${BACKEND_URL}/get_user_bracket/${bracket_number}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userBracketData = await userBracketResponse.json();
      if (!userBracketData.bracket) {
        throw new Error("User bracket not found");
      }

      const liveBracketResponse = await fetch(`${BACKEND_URL}/get_bracket`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const liveBracketData = await liveBracketResponse.json();

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
      console.log("Score data: ", scoreData);
      setScoresMap(prev => ({
        ...prev,
        [bracket_number]: scoreData.score,
      }));
    } catch (error) {
      console.error("Error saving bracket:", error);
      setError("Failed to save bracket.");
    }
  };

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
                  ref={(el) => {
                    if (el) bracketRefs.current[bracket.id] = el;
                  }}
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

                {/* SAVE button only if not yet scored; otherwise show score */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-4">
                  {scoresMap[bracket.id] == null ? (
                    <Button
                      onClick={() => saveBracket(bracket.id)}
                      className="bg-[var(--primary-color)] font-bold hover:bg-blue-900"
                    >
                      SAVE BRACKET
                    </Button>
                  ) : (
                    <span className="font-bold">Score: {scoresMap[bracket.id]}</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    ) : (
      !loading &&
      !error && <p>No brackets found.</p>
    )}

    {/* remove the old single-score display; scores are shown per-bracket now */}

    {token && (
      <Button
        onClick={() => createBracket()}
        className="bg-[var(--primary-color)] font-bold hover:bg-blue-900 mt-4"
      >
        CREATE NEW BRACKET
      </Button>
    )}
  </div>
);
}
