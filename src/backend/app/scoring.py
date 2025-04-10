"""
This module provides functionality to score a March Madness bracket by comparing
a user’s picks with the actual results:
    - 10 points for each correct pick in the First Round
    - 20 for Second Round
    - 40 for Sweet 16
    - 80 for Elite 8
    - 160 for Final 4
    - 320 for Championship

Both the user and actual bracket JSONs can be structured in two ways:
1. A complete rounds-based bracket with a "rounds" key.
2. A region-based bracket with a "regions" key (the user bracket format).
   Note: The round "National Championship" is remapped to "Championship".
If a game in the actual bracket does not yet have a winner, no points are added.
"""

# Points awarded per round
ROUND_POINTS = {
    "First Round": 10,
    "Second Round": 20,
    "Sweet 16": 40,
    "Elite 8": 80,
    "Final 4": 160,
    "Championship": 320
}

def extract_rounds(bracket):
    """
    Convert a bracket JSON into a rounds-based dictionary.
    This handles both:
      - A bracket with a "rounds" key (already rounds-based)
      - A bracket with a "regions" key (user bracket format)
    It also remaps "National Championship" to "Championship".
    """
    all_rounds = {}

    if "rounds" in bracket:
        for round_obj in bracket["rounds"]:
            # Use round_obj["title"], remapping if needed.
            round_title = round_obj.get("title")
            if round_title == "National Championship":
                round_title = "Championship"
            # The API live bracket may not include a "winner" so compute it here.
            seeds = round_obj.get("seeds", [])
            for seed in seeds:
                # If winner is not provided and scores are available, compute it.
                if seed.get("winner") is None and "homeScore" in seed and "awayScore" in seed:
                    try:
                        home = seed["homeScore"]
                        away = seed["awayScore"]
                        if home > away:
                            seed["winner"] = seed["teams"][0]["name"]
                        elif away > home:
                            seed["winner"] = seed["teams"][1]["name"]
                    except (IndexError, TypeError):
                        pass
            all_rounds.setdefault(round_title, []).extend(seeds)
        return all_rounds

    elif "regions" in bracket:
        # User bracket format: iterate over regions and their rounds.
        for region, region_data in bracket["regions"].items():
            rounds_list = region_data.get("rounds", [])
            for round_obj in rounds_list:
                round_title = round_obj.get("title")
                if round_title == "National Championship":
                    round_title = "Championship"
                all_rounds.setdefault(round_title, []).extend(round_obj.get("seeds", []))
        return all_rounds
    else:
        return {}

def transform_live_bracket(live_json):
    """
    Transform the raw live bracket (from the API) into a rounds-based structure.
    This replicates the logic from LiveBracketPage.tsx in Python.
    We assume the raw live JSON has a "rounds" array. We skip the first round (if needed)
    and then for rounds with bracketed info versus direct games.
    Each seed's winner is computed from scores if not already present.
    """
    rounds_out = []
    # We assume live_json has "rounds" key.
    rounds = live_json.get("rounds", [])
    # Skip the first round if necessary. (Based on your LiveBracketPage.tsx, idx0 is skipped.)
    for idx, round_data in enumerate(rounds):
        if idx == 0:
            continue
        seed_list = []
        if idx < 5:
            # For rounds that have "bracketed" info.
            bracketed = round_data.get("bracketed", [])
            # For each region in bracketed, sort games and process seeds.
            for region_data in bracketed:
                games = region_data.get("games", [])
                games.sort(key=lambda g: int(g.get("title", "Game 99").split("Game ")[-1]))
                for game in games:
                    team_home = game.get("home", {})
                    team_away = game.get("away", {})
                    seed = {
                        "id": game.get("id"),
                        "teams": [
                            {"name": team_home.get("alias", "TBD"), "seed": team_home.get("seed")},
                            {"name": team_away.get("alias", "TBD"), "seed": team_away.get("seed")}
                        ],
                        "homeScore": game.get("home_points"),
                        "awayScore": game.get("away_points"),
                        "date": game.get("scheduled", ""),
                        "region": (region_data.get("bracket", {}).get("name") or "").split(" ")[0].toUpperCase()  # crude extraction
                    }
                    # Compute winner if scores are available.
                    if seed.get("homeScore") is not None and seed.get("awayScore") is not None:
                        if seed["homeScore"] > seed["awayScore"]:
                            seed["winner"] = seed["teams"][0]["name"]
                        elif seed["awayScore"] > seed["homeScore"]:
                            seed["winner"] = seed["teams"][1]["name"]
                    seed_list.append(seed)
        else:
            # For rounds after idx 4 (e.g., Final Four / Championship)
            games = round_data.get("games", [])
            for game in games:
                team_home = game.get("home", {})
                team_away = game.get("away", {})
                seed = {
                    "id": game.get("id"),
                    "teams": [
                        {"name": team_home.get("alias", "TBD"), "seed": team_home.get("seed")},
                        {"name": team_away.get("alias", "TBD"), "seed": team_away.get("seed")}
                    ],
                    "homeScore": game.get("home_points"),
                    "awayScore": game.get("away_points"),
                    "date": game.get("scheduled", ""),
                    "region": "FINAL FOUR"
                }
                if seed.get("homeScore") is not None and seed.get("awayScore") is not None:
                    if seed["homeScore"] > seed["awayScore"]:
                        seed["winner"] = seed["teams"][0]["name"]
                    elif seed["awayScore"] > seed["homeScore"]:
                        seed["winner"] = seed["teams"][1]["name"]
                seed_list.append(seed)

        # Use the API round's "name" as the title.
        round_obj = {
            "title": round_data.get("name"),
            "seeds": seed_list
        }
        rounds_out.append(round_obj)
    return {"rounds": rounds_out}

def score_bracket(user_bracket, actual_bracket):
    """
    Calculate the score for a user's bracket based on the actual results.
    For the actual bracket, we first transform the live API data into a rounds-based structure.
    Then we extract rounds from both user and live brackets and compare them.
    
    Args:
        user_bracket (dict): The user's bracket JSON (region-based).
        actual_bracket (dict): The raw live bracket JSON from the API.
    
    Returns:
        int: Total score computed for the user's bracket.
    """
    # Transform the raw live bracket into rounds-based format.
    transformed_live = transform_live_bracket(actual_bracket)
    
    user_rounds = extract_rounds(user_bracket)
    actual_rounds = extract_rounds(transformed_live)
    
    total_score = 0
    for round_name, points in ROUND_POINTS.items():
        user_games = user_rounds.get(round_name, [])
        actual_games = actual_rounds.get(round_name, [])
        for user_game, actual_game in zip(user_games, actual_games):
            if actual_game.get("winner") is not None:
                if user_game.get("winner") == actual_game.get("winner"):
                    total_score += points
    return total_score
