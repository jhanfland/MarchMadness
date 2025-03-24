
export type Team = {
    name: string;
  };
  
  export type Seed = {
    id: number;
    date?: string;
    teams: Team[];
    region?: Region
  };
  
  export type Round = {
    title: string;
    seeds: Seed[];
  };
  
  export type Bracket = {
    id: number;
    title: string;
    round?:Round[];
    reigons?: Record<Region, Seed[]>;
  };

  
export type Region = "EAST" | "WEST" | "SOUTH" | "MIDWEST" | "FINAL FOUR";