import { useState } from "react";
import { Bracket as BracketType, Region } from "@/Pages/Bracket/components/bracketTypes";
import { Bracket as ReactBracket, RoundProps } from 'react-brackets';



export default function Bracket({ bracket }: BracketType) {
    // if (bracket.length == 0) {
    //     return <div />
    // }
    const [selectedRegion, setSelectedRegion] = useState<Region>("EAST");
    console.log("bracket within page", bracket)

    const rounds: RoundProps[] = bracket[0].rounds
    // [
    //   {
    //     title: 'Round one',
    //     seeds: [
    //       {
    //         id: 1,
    //         date: new Date().toDateString(),
    //         teams: [{ name: 'Team A' }, { name: 'Team B' }],
    //       },
    //       {
    //         id: 2,
    //         date: new Date().toDateString(),
    //         teams: [{ name: 'Team C' }, { name: 'Team D' }],
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Round two',
    //     seeds: [
    //       {
    //         id: 3,
    //         date: new Date().toDateString(),
    //         teams: [{ name: 'Team A' }, { name: 'Team C' }],
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Round Three',
    //     seeds: [
    //       {
    //         id: 3,
    //         date: new Date().toDateString(),
    //         teams: [{ name: 'Team A' }, { name: 'Team C' }],
    //       },
    //     ],
    //   },
    //   {
    //     title: 'Round Four',
    //     seeds: [
    //       {
    //         id: 3,
    //         date: new Date().toDateString(),
    //         teams: [{ name: 'Team D' }, { name: 'Team Z' }],
    //       },
    //     ],
    //   },
    // ];

    return (
        <div> 
            <p> {bracket.title} </p>
            <ReactBracket rounds={rounds} />
            <div className="flex gap-5"> 
                {(["EAST", "WEST", "SOUTH", "MIDWEST"] as Region[]).map((region) => (
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
        </div>
    );
}
