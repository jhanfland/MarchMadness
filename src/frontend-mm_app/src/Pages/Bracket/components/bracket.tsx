import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
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
  liveBracket: Boolean; // The 'liveBracket' prop is of type boolean
}

interface CustomSeedProps {
  seed: SeedType;
  breakpoint: number;
  seedIndex: number;
  roundIndex: number;
  region: Region;
  selection: Record<string, string>;
  setSelection: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  liveBracket: Boolean
}

const CustomSeed = ({
  seed,
  breakpoint,
  seedIndex,
  region,
  roundIndex,
  selection,
  setSelection,
  liveBracket
}: CustomSeedProps) => {
  // return for live bracket, else statement for user bracket
  if (liveBracket) {
    return (
      <Seed mobileBreakpoint={breakpoint}>
        <SeedItem>
          <SeedTeam>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <span>{`${seed.teams[0]?.seed ?? ""}  ${seed.teams[0]?.name ?? ""}`}</span>
            <span>{seed.homeScore ?? ""}</span>
          </div>
          </SeedTeam>
          <SeedTeam>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span>{`${seed.teams[1]?.seed ?? ""}  ${seed.teams[1]?.name ?? ""}`}</span>
              <span>{seed.awayScore ?? ""}</span>
            </div>
          </SeedTeam>
        </SeedItem>
      </Seed>
    )
  } else {
    const key = `${roundIndex}-${seedIndex}-${region}`;

    const team1 = seed.teams[0]?.name;
    const team1seed = seed.teams[0]?.seed;

    const team2 = seed.teams[1]?.name;
    const team2seed = seed.teams[1]?.seed;

    const value1 = `${team1seed}_${team1}-${seed.id}-0`;
    const value2 = `${team2seed}_${team2}-${seed.id}-1`;

    function updateSelection(teamSeedPlace: string) {
      setSelection((prev) => ({ ...prev, [key]: teamSeedPlace }));
    }

    return (
      <Seed mobileBreakpoint={breakpoint}>
        <SeedItem>
          <div className="text-left">
            <SeedTeam style={{ color: "var(--primary-color)" }}>
              {`${seed.teams[0]?.seed ?? ""}  ${seed.teams[0]?.name ?? "NO TEAM "}`}
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
              {`${seed.teams[1]?.seed ?? ""}  ${seed.teams[1]?.name ?? "NO TEAM "}`}
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
  }
};

const Bracket = forwardRef(function Bracket({ bracket, liveBracket }: BracketProps, ref) {
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

        const [team1Seed, team1] = selectedTeams[team1Key]?.split("-")[0].split("_") || [undefined, "TBD"];
        const [team2Seed, team2] = selectedTeams[team2Key]?.split("-")[0].split("_") || [undefined, "TBD"];

        nextSeeds.push({
          id: j / 2 + 1,
          teams: [{ name: team1, seed: team1Seed}, { name: team2, seed: team2Seed}],
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
  }, [bracket, selectedTeams, selectedRegion]);

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
        const [teamSeed, teamName] = selected.split("-")[0].split("_");
        regionWinners[region] = teamName + "_" + teamSeed;
      }
    }
  
    // Step 2: Set Final Four matchups
    updatedFinalFour[0].seeds[0].teams = [
      { name: regionWinners["EAST"].split("_")[0], seed: regionWinners["EAST"].split("_")[1] || undefined},
      { name: regionWinners["MIDWEST"].split("_")[0], seed: regionWinners["MIDWEST"].split("_")[1] || undefined },
    ];
    updatedFinalFour[0].seeds[1].teams = [
      { name: regionWinners["SOUTH"].split("_")[0], seed: regionWinners["SOUTH"].split("_")[1] || undefined },
      { name: regionWinners["WEST"].split("_")[0], seed: regionWinners["WEST"].split("_")[1] || undefined },
    ];
  
    // Step 3: Pull semifinal winners for the Championship
    const semi1Key = `0-0-FINAL FOUR`;
    const semi2Key = `0-1-FINAL FOUR`;
  
    const [semi1Seed, semi1Winner] = selectedTeams[semi1Key]?.split("-")[0].split("_") || [undefined, "TBD"];
    const [semi2Seed, semi2Winner] = selectedTeams[semi2Key]?.split("-")[0].split("_") || [undefined, "TBD"];
  
    updatedFinalFour[1].seeds[0].teams = [
      { name: semi1Winner, seed: semi1Seed},
      { name: semi2Winner, seed: semi2Seed},
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
                liveBracket={liveBracket}
              />
            )}
          />
        ) : (
          <ReactBracket rounds={bracket[0].rounds} renderSeedComponent={(props) => (
            <CustomSeed
              {...props}
              region={selectedRegion}
              selection={selectedTeams}
              setSelection={setSelectedTeams}
              liveBracket={liveBracket}
            />
          )}
        />
        )}
    </>
    );
  }

  

  console.log("selected Teams", selectedTeams, "parsed data", parseSelectedTeamData(selectedTeams));
  /**
   * This is how we propogate it up to save button
   */
  useImperativeHandle(ref, () => ({
    getParsedBracketData: () => parseSelectedTeamData(selectedTeams),
  }));
  // 
  /**
   * We need to move this function to BracketPage but will work on that later when working with Norris
   * This method should parse the data properly in this format, for easy db retrieval, and score comparison
   * Format of JSON
   * 0-1-EAST: "8_Mississippi State Bulldogs-2-0" --> (Round(horizontal))-(Index(vertical))-(REGION):(Seed)_(Team Name)-(Index(vertical) + 1)-(teamIndex from matchup -- either 0 or 1)
   * @param data 
   * @returns 
   */
  function parseSelectedTeamData (data: any) {
    // means full bracket
    if (Object.keys(selectedTeams).length != 63) {
      // May want to disable the save button until they are allowed to do all 63 teams picked
      return undefined;
    }

    // want bracket format to look like this after manipulating data, fill seeds with team name, team seed, and team selected by user for each matchup of each round
    return {
      id: bracket.id,
      title: bracket.title,
      regions: {
        EAST: {
          rounds: [
            {title: 'First Round', seeds: []},
            {title: 'Second Round', seeds: []},
            {title: 'Sweet 16', seeds: []},
            {title: 'Elite 8', seeds: []}
          ]
        },
        MIDWEST: {
          rounds: [
            {title: 'First Round', seeds: []},
            {title: 'Second Round', seeds: []},
            {title: 'Sweet 16', seeds: []},
            {title: 'Elite 8', seeds: []}
          ]
        }, 
        SOUTH: {
          rounds: [
            {title: 'First Round', seeds: []},
            {title: 'Second Round', seeds: []},
            {title: 'Sweet 16', seeds: []},
            {title: 'Elite 8', seeds: []}
          ]
        },
        WEST: {
          rounds: [
            {title: 'First Round', seeds: []},
            {title: 'Second Round', seeds: []},
            {title: 'Sweet 16', seeds: []},
            {title: 'Elite 8', seeds: []}
          ]
        },
        FINAL_FOUR: {
          rounds: [
            {title: 'Final Four', seeds: []},
            {title: 'National Championship', seeds: []},
          ]
        }
      }
    }
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
})

export default Bracket;
