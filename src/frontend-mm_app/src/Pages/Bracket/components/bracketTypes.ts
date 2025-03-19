
export type Team = {
    name: string;
  };
  
  export type Seed = {
    id: number;
    date?: string;
    teams: Team[];
  };
  
  export type Round = {
    title: string;
    seeds: Seed[];
  };
  
  export type Bracket = {
    id: number;
    title: string;
    rounds: Round[];
  };

  
export type Region = "EAST" | "WEST" | "SOUTH" | "MIDWEST";