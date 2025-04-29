
export type Team = {
    name: string,
    seed?: Number
  };
  
  export type Seed = {
    id?: number,
    date?: string,
    teams: Team[],
    region?: Region,
    homeScore?: Number,
    awayScore?: Number,
    location?: string
  };
  
  export type Round = {
    title: string,
    seeds: Seed[]
  };
  
  export type Bracket = {
    id: number,
    title: string,
    rounds?:Round[],
    regions?: Record<Region, Seed[]>
  };

  
export type Region = "EAST" | "WEST" | "SOUTH" | "MIDWEST" | "FINAL FOUR";