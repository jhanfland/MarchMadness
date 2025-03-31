import { useEffect, useState } from "react";
import {
  Bracket as BracketType,
  Region,
  Round,
  Seed as SeedType,
} from "@/Pages/Bracket/components/bracketTypes";
import {
  Bracket as ReactBracket,
  RoundProps,
  Seed,
  SeedItem,
  SeedTeam,
} from "react-brackets";


interface BracketProps {
  bracket: BracketType; // The 'bracket' prop is of type BracketType
  liveBracket: boolean; // The 'liveBracket' prop is of type boolean
}

interface CustomSeedProps {
  seed: SeedType;
  breakpoint: number;
  seedIndex: number;
  roundIndex: number;
  region: Region;
  selection: Record<string, string>;
  setSelection: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CustomSeed = ({
  seed,
  breakpoint,
  seedIndex,
  region,
  roundIndex,
  selection,
  setSelection,
}: CustomSeedProps) => {
  const key = `${roundIndex}-${seedIndex}-${region}`;

  const team1 = seed.teams[0]?.name;

  const team2 = seed.teams[1]?.name;

  const value1 = `${team1}-${seed.id}-0`;
  const value2 = `${team2}-${seed.id}-1`;

  function updateSelection(teamSeedPlace: string) {
    setSelection((prev) => ({ ...prev, [key]: teamSeedPlace }));
  }

  return (
    <Seed mobileBreakpoint={breakpoint}>
      <SeedItem>
        <div className="text-left">
          <SeedTeam style={{ color: "var(--primary-color)" }}>
            {seed.teams[0]?.name || "NO TEAM "}
            <input
              disabled={["TBD", "Midwest Champ", "East Champ", "South Champ", "West Champ"].includes(team1)}
              type="radio"
              name={`team-select-${key}`}
              value={value1}
              checked={selection[key] === value1}
              onChange={() => updateSelection(value1)}
            />
          </SeedTeam>
          <SeedTeam>
            {seed.teams[1]?.name || "NO TEAM "}
            <input
              disabled={["TBD", "Midwest Champ", "East Champ", "South Champ", "West Champ"].includes(team2)}
              type="radio"
              name={`team-select-${key}`}
              value={value2}
              checked={selection[key] === value2}
              onChange={() => updateSelection(value2)}
            />
          </SeedTeam>
        </div>
      </SeedItem>
    </Seed>
  );
};

export default function Bracket({ bracket, liveBracket }: BracketProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region>("EAST");

  const [selectedTeams, setSelectedTeams] = useState<Record<string, string>>({});

  const [rounds, setRounds] = useState<Round[]>([]);

  const [finalFourRounds, setFinalFourRounds] = useState<Round[]>([
    {
      title: "Final Four",
      seeds: [
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [{ name: "East Champ" }, { name: "Midwest Champ" }],
        },
        {
          id: 2,
          date: new Date().toDateString(),
          teams: [{ name: "South Champ" }, { name: "West Champ" }],
        },
      ],
    },
    {
      title: "Championship",
      seeds: [
        {
          id: 1,
          date: new Date().toDateString(),
          teams: [{ name: "TBD" }, { name: "TBD" }],
        },
      ],
    },
  ]);

  // updates everytime reigon changes
  useEffect(() => {
    // tests to make sure code doesn't crash or overwrite
    if (!bracket?.regions?.[selectedRegion]) return;
    if (selectedRegion === "FINAL FOUR") return;

    // uses the bracket reigons to build the baseSeeds for rnd 64
    const baseSeeds = bracket.regions[selectedRegion];

    const newRounds: Round[] = [
      {
        title: "Round of 64",
        seeds: baseSeeds,
      },
    ];

    // creates other 3 rounds
    for (let i = 1; i < 4; i++) {
      const prevSeeds = newRounds[i - 1].seeds;
      const nextSeeds: SeedType[] = [];

      for (let j = 0; j < prevSeeds.length; j += 2) {
        const team1Key = `${i - 1}-${j}-${selectedRegion}`;
        const team2Key = `${i - 1}-${j + 1}-${selectedRegion}`;

        const team1 = selectedTeams[team1Key]?.split("-")[0] || "TBD";
        const team2 = selectedTeams[team2Key]?.split("-")[0] || "TBD";

        nextSeeds.push({
          id: j / 2 + 1,
          teams: [{ name: team1 }, { name: team2 }],
        });
      }

      // add other rounds with seeds to bracket
      newRounds.push({
        title:
          i === 1 ? "Round of 32" : i === 2 ? "Sweet 16" : "Elite 8",
        seeds: nextSeeds,
      });
    }

    setRounds(newRounds);
  }, [bracket, selectedRegion, selectedTeams]);

  useEffect(() => {
    const regionOrder = ["EAST", "WEST", "SOUTH", "MIDWEST"];
  
    const updatedFinalFour = [...finalFourRounds];
  
    const regionWinners: Record<string, string> = {
      EAST: "East Champ",
      WEST: "West Champ",
      SOUTH: "South Champ",
      MIDWEST: "Midwest Champ",
    };
  
    // Step 1: Get each region's champion
    for (const region of regionOrder) {
      const winnerKey = `3-0-${region}`;
      const selected = selectedTeams[winnerKey];
      if (selected) {
        const teamName = selected.split("-")[0];
        regionWinners[region] = teamName;
      }
    }
  
    // Step 2: Set Final Four matchups
    updatedFinalFour[0].seeds[0].teams = [
      { name: regionWinners["EAST"] },
      { name: regionWinners["MIDWEST"] },
    ];
    updatedFinalFour[0].seeds[1].teams = [
      { name: regionWinners["SOUTH"] },
      { name: regionWinners["WEST"] },
    ];
  
    // Step 3: Pull semifinal winners for the Championship
    const semi1Key = `0-0-FINAL FOUR`;
    const semi2Key = `0-1-FINAL FOUR`;
  
    const semi1Winner = selectedTeams[semi1Key]?.split("-")[0] || "TBD";
    const semi2Winner = selectedTeams[semi2Key]?.split("-")[0] || "TBD";
  
    updatedFinalFour[1].seeds[0].teams = [
      { name: semi1Winner },
      { name: semi2Winner },
    ];
  
    setFinalFourRounds(updatedFinalFour);
  }, [selectedTeams]);
  
  

  /*function genSeeds(numberOfTeams: number): SeedType[] {
    const seeds = Array.from({ length: numberOfTeams }, (_, index) => ({
      id: index + 1,
      teams: [{ name: "TBD" }, { name: "TBD" }],
    }));

    return seeds;
  }*/

  // either returns a live bracket or a bracket with just the first round
  function createBracket() {
    return (
      <>
        {liveBracket === false ? (
          <ReactBracket
            bracketClassName={""}
            rounds={selectedRegion === "FINAL FOUR" ? finalFourRounds : rounds}
            renderSeedComponent={(props) => (
              <CustomSeed
                {...props}
                region={selectedRegion}
                selection={selectedTeams}
                setSelection={setSelectedTeams}
              />
            )}
          />
        ) : (
          <ReactBracket rounds={bracket[0].rounds} />
        )}
      </>
    );
  }

  return (
    <div>
      <p> {bracket.title} </p>
      {createBracket()}
      {liveBracket === false && (
        <div className="flex gap-5">
          {(["EAST", "WEST", "SOUTH", "MIDWEST", "FINAL FOUR"] as Region[]).map(
            (region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`font-bold ${
                  selectedRegion === region ? "text-white" : "text-gray-500"
                }`}
              >
                {region}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
