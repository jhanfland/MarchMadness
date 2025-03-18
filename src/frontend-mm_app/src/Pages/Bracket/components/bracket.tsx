import { useState } from "react";
import { Bracket as BracketType, Region } from "@/Pages/Bracket/components/bracketTypes";
import { Bracket as SingleEliminationBracket } from "@g-loot/react-tournament-brackets";

export default function Bracket({ bracket }: BracketType) {
    const [selectedRegion, setSelectedRegion] = useState<Region>("EAST");

    return (
        <div> 
            <p> {bracket.title} </p>
            <SingleEliminationBracket rounds={rounds} />
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
