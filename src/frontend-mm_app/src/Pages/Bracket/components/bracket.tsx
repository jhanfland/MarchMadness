import { useState } from "react";
import { Bracket as BracketType, Region } from "@/Pages/Bracket/components/bracketTypes";
import { Bracket as ReactBracket, RoundProps } from 'react-brackets';

const finalFourRounds: RoundProps[] = [
  {
    title: "Final Four",
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: "East Champ" }, { name: "West Champ" }],
      },
      {
        id: 2,
        date: new Date().toDateString(),
        teams: [{ name: "South Champ" }, { name: "Midwest Champ" }],
      },
    ],
  },
  {
    title: 'Championship',
    seeds: [
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [{ name: 'Team D' }, { name: 'Team Z' }],
      }
    ],
  },
];

interface BracketProps {
    bracket: BracketType; // The 'bracket' prop is of type BracketType
    liveBracket: boolean; // The 'liveBracket' prop is of type boolean
  }


export default function Bracket({ bracket, liveBracket } : BracketProps) {

    const [selectedRegion, setSelectedRegion] = useState<Region>("EAST");


    // either returns a live bracket or a bracket with just the first round
    function createBracket() {
        return (
            <>
                {liveBracket === false ? 
                    (<ReactBracket rounds={ selectedRegion === "FINAL FOUR" ? 
                        finalFourRounds : [{ title: "Round of 64", seeds: bracket.regions[selectedRegion] ?? [], }, ] } />)
                : (<ReactBracket rounds={bracket[0].rounds} />)
                }
            </>
        )
    }

    return (
        <div> 
            <p> {bracket.title} </p>
            {createBracket()}
            { liveBracket === false && 
                <div className="flex gap-5"> 
                    {(["EAST", "WEST", "SOUTH", "MIDWEST", "FINAL FOUR"] as Region[]).map((region) => (
                        <button 
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`font-bold ${
                                selectedRegion === region ? "text-white" : "text-gray-500"
                            }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>
            }
        </div>
    );
}
