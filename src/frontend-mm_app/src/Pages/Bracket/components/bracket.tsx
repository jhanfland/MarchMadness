import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
  Bracket as BracketType,
  Region,
  Round,
  Seed as SeedType,
} from "@/Pages/Bracket/components/bracketTypes";
import {
  Bracket as ReactBracket,
  Seed,
  SeedItem,
  SeedTeam,
} from "react-brackets";

interface BracketProps {
  bracket: BracketType;
  liveBracket: Boolean;
  onChange?: (selected: Record<string, string>) => void;
}

const Bracket = forwardRef(function Bracket({ bracket, liveBracket, onChange }: BracketProps, ref) {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>({});
  const [selectedRegion, setSelectedRegion] = useState<Region>("EAST");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [finalFourRounds, setFinalFourRounds] = useState<Round[]>([
    {
      title: "Final Four",
      seeds: [
        { id: 1, date: new Date().toDateString(), teams: [{ name: "East Champ" }, { name: "Midwest Champ" }] },
        { id: 2, date: new Date().toDateString(), teams: [{ name: "South Champ" }, { name: "West Champ" }] }
      ]
    },
    {
      title: "Championship",
      seeds: [
        { id: 1, date: new Date().toDateString(), teams: [{ name: "TBD" }, { name: "TBD" }] }
      ]
    }
  ]);

  useEffect(() => {
    if (onChange) onChange(selectedTeams);
  }, [selectedTeams]);

  useEffect(() => {
    if (selectedRegion === "FINAL FOUR") return;

    const seeds = bracket.regions[selectedRegion]?.rounds?.[0]?.seeds || [];

    const builtRounds: Round[] = [
      { title: "Round of 64", seeds: seeds }
    ];

    for (let i = 1; i < 4; i++) {
      const prev = builtRounds[i - 1].seeds;
      const next: SeedType[] = [];

      for (let j = 0; j < prev.length; j += 2) {
        const key1 = `${i - 1}-${j}-${selectedRegion}`;
        const key2 = `${i - 1}-${j + 1}-${selectedRegion}`;

        const [s1, n1] = selectedTeams[key1]?.split("-")[0].split("_") || [undefined, "TBD"];
        const [s2, n2] = selectedTeams[key2]?.split("-")[0].split("_") || [undefined, "TBD"];

        next.push({ id: j / 2 + 1, teams: [{ name: n1, seed: s1 }, { name: n2, seed: s2 }] });
      }

      builtRounds.push({
        title: i === 1 ? "Round of 32" : i === 2 ? "Sweet 16" : "Elite 8",
        seeds: next,
      });
    }

    setRounds(builtRounds);
  }, [selectedRegion, selectedTeams, bracket]);

  useEffect(() => {
    const winners: Record<string, string> = {
      EAST: "East Champ", WEST: "West Champ", SOUTH: "South Champ", MIDWEST: "Midwest Champ"
    };

    const updated = [...finalFourRounds];

    for (const region of ["EAST", "WEST", "SOUTH", "MIDWEST"]) {
      const winnerKey = `3-0-${region}`;
      const value = selectedTeams[winnerKey];
      if (value) {
        const [seed, name] = value.split("-")[0].split("_");
        winners[region] = `${name}_${seed}`;
      }
    }

    updated[0].seeds[0].teams = [
      { name: winners.EAST.split("_")[0], seed: winners.EAST.split("_")[1] },
      { name: winners.MIDWEST.split("_")[0], seed: winners.MIDWEST.split("_")[1] }
    ];
    updated[0].seeds[1].teams = [
      { name: winners.SOUTH.split("_")[0], seed: winners.SOUTH.split("_")[1] },
      { name: winners.WEST.split("_")[0], seed: winners.WEST.split("_")[1] }
    ];

    const [s1Seed, s1Name] = selectedTeams["0-0-FINAL FOUR"]?.split("-")[0].split("_") || [undefined, "TBD"];
    const [s2Seed, s2Name] = selectedTeams["0-1-FINAL FOUR"]?.split("-")[0].split("_") || [undefined, "TBD"];

    updated[1].seeds[0].teams = [
      { name: s1Name, seed: s1Seed },
      { name: s2Name, seed: s2Seed }
    ];

    setFinalFourRounds(updated);
  }, [selectedTeams]);

  const CustomSeed = ({
    seed,
    breakpoint,
    seedIndex,
    roundIndex,
    region,
  }: {
    seed: SeedType;
    breakpoint: number;
    seedIndex: number;
    roundIndex: number;
    region: Region;
  }) => {
    const key = `${roundIndex}-${seedIndex}-${region}`;

    const team1 = seed.teams[0]?.name;
    const team1seed = seed.teams[0]?.seed;
    const team2 = seed.teams[1]?.name;
    const team2seed = seed.teams[1]?.seed;

    const value1 = `${team1seed}_${team1}-${seed.id}-0`;
    const value2 = `${team2seed}_${team2}-${seed.id}-1`;

    const update = (val: string) => {
      const [, removed] = val.split("-")[0].split("_");

      setSelectedTeams((prev) => {
        const newMap: Record<string, string> = {};
        const [rNum, , rRegion] = key.split("-");
        const roundNum = parseInt(rNum);

        for (const [k, v] of Object.entries(prev)) {
          const [kr, , krRegion] = k.split("-");
          const roundK = parseInt(kr);
          if (!(krRegion === rRegion && roundK > roundNum && v.includes(removed))) {
            newMap[k] = v;
          }
        }

        newMap[key] = val;

        // clear Final Four if team removed
        if (["EAST", "WEST", "SOUTH", "MIDWEST"].includes(rRegion)) {
          for (const k of Object.keys(newMap)) {
            if ((k.includes("FINAL FOUR") || k.includes("CHAMPIONSHIP")) && newMap[k].includes(removed)) {
              delete newMap[k];
            }
          }
        }

        return newMap;
      });
    };

    return (
      <Seed mobileBreakpoint={breakpoint}>
        <SeedItem>
          <div className="text-left">
            <SeedTeam>
              {`${team1seed ?? ""} ${team1 ?? "NO TEAM"}`}
              <input
                type="radio"
                name={`select-${key}`}
                value={value1}
                disabled={["TBD", "East Champ", "West Champ", "South Champ", "Midwest Champ"].includes(team1 || "")}
                checked={selectedTeams[key] === value1}
                onChange={() => update(value1)}
              />
            </SeedTeam>
            <SeedTeam>
              {`${team2seed ?? ""} ${team2 ?? "NO TEAM"}`}
              <input
                type="radio"
                name={`select-${key}`}
                value={value2}
                disabled={["TBD", "East Champ", "West Champ", "South Champ", "Midwest Champ"].includes(team2 || "")}
                checked={selectedTeams[key] === value2}
                onChange={() => update(value2)}
              />
            </SeedTeam>
          </div>
        </SeedItem>
      </Seed>
    );
  };

  return (
    <div>
      <p>{bracket.title}</p>
      <ReactBracket
        rounds={selectedRegion === "FINAL FOUR" ? finalFourRounds : rounds}
        renderSeedComponent={(props) => (
          <CustomSeed {...props} region={selectedRegion} />
        )}
      />
      {!liveBracket && (
        <div className="flex gap-5 mt-2">
          {(["EAST", "WEST", "SOUTH", "MIDWEST", "FINAL FOUR"] as Region[]).map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`font-bold ${selectedRegion === region ? "text-white" : "text-gray-500"}`}
            >
              {region}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default Bracket;