from datetime import datetime

# Points awarded per round
ROUND_POINTS = {
    "First Round": 10,
    "Second Round": 20,
    "Sweet 16": 40,
    "Elite 8": 80,
    "Final Four": 160,
    "National Championship": 320,
}


def extract_game_number(game):
    """
    Attempt to extract a game number from the game 'title'
    by splitting on 'Game '.
    If unsuccessful, fall back to the scheduled timestamp.
    """
    title = game.get("title", "")
    try:
        # Example: "South Regional - First Round - Game 3"
        parts = title.split("Game ")
        if len(parts) >= 2:
            return int(parts[-1])
    except ValueError:
        pass
    # Fall back to scheduled time (converted to timestamp)
    sched = game.get("scheduled")
    if sched:
        try:
            dt = datetime.fromisoformat(sched.replace("Z", "+00:00"))
            return dt.timestamp()
        except Exception:
            pass
    return 0


def determine_winner(game):
    """
    Determines the winner of the game.
    """
    home = game.get("home", {}).get("name")
    away = game.get("away", {}).get("name")
    home_pts = game.get("home_points")
    away_pts = game.get("away_points")
    if home_pts is not None and away_pts is not None:
        return home if home_pts > away_pts else away
    return None


def parse_live_winners(live_bracket):
    """
    Parses the live bracket JSON to extract winners in a structure that mirrors the user bracket.
    Instead of relying on hardcoded region mappings, we use the "bracket" information embedded in the
    live bracket's "bracketed" array.

    The expected live bracket structure:
      - Rounds 1-4: Each round contains a "bracketed" array of regions.
          Each region object should contain a "bracket" dict with a "name" attribute
          (for example, "South Regional").
      - Rounds 5 and 6 (Final Four and Championship): Read directly from the "games" list.

    Returns a dictionary:
      winners[region_key][round_index] = [winner, winner, ...]

    The region_key is derived by removing the " Regional" suffix (if present)
    and then uppercasing it to align with user bracket keys (i.e. "SOUTH", "MIDWEST", "EAST", "WEST").
    """
    rounds = live_bracket["rounds"]
    # Initialize winners dictionary for each region and the Final Four.
    winners = {
        "SOUTH": [[] for _ in range(4)],
        "MIDWEST": [[] for _ in range(4)],
        "EAST": [[] for _ in range(4)],
        "WEST": [[] for _ in range(4)],
        "FINAL_FOUR": [[] for _ in range(2)],
    }

    # Process rounds 1 to 4 (typically First Round, Second Round, Sweet 16, Elite 8)
    # Each round has a "bracketed" array. We use the bracket info to get the region key.
    for round_index in range(1, 5):
        round_data = rounds[round_index]
        bracketed_list = round_data.get("bracketed", [])
        for region_item in bracketed_list:
            if "bracket" in region_item and "name" in region_item["bracket"]:
                region_name = region_item["bracket"]["name"]
                region_key = region_name.replace(" Regional", "").upper()
            else:
                continue

            games = region_item.get("games", [])
            games_sorted = sorted(games, key=extract_game_number)
            for game in games_sorted:
                winner = determine_winner(game)
                winners[region_key][round_index - 1].append(winner)

    # Process Round 5: Final Four – these games are not divided by region.
    final_four_games = rounds[5].get("games", [])
    final_four_games_sorted = sorted(final_four_games, key=extract_game_number)
    # If exactly two games are found, swap the order to match the expected ordering.
    if len(final_four_games_sorted) == 2:
        final_four_games_sorted = [
            final_four_games_sorted[1],
            final_four_games_sorted[0],
        ]
    for game in final_four_games_sorted:
        winner = determine_winner(game)
        winners["FINAL_FOUR"][0].append(winner)

    # Process Round 6: National Championship – again, not divided by region.
    championship_games = rounds[6].get("games", [])
    championship_games_sorted = sorted(championship_games, key=extract_game_number)
    for game in championship_games_sorted:
        winner = determine_winner(game)
        winners["FINAL_FOUR"][1].append(winner)

    return winners


def score_bracket(user_bracket, live_bracket):
    """
    Scores the user bracket against the live bracket.
    The user bracket is assumed to have proper ordering per region, including FINAL_FOUR.
    This function uses the winners extracted from the live bracket to compare against the user selections.
    """
    live_winners = parse_live_winners(live_bracket)
    print("live bracket winners:", live_winners, flush=True)
    print("user bracket:", user_bracket, flush=True)
    total_score = 0

    # Iterate through each region in the user bracket (including FINAL_FOUR).
    for region, region_data in user_bracket["regions"].items():
        rounds_list = region_data.get("rounds", [])
        for round_index, round_obj in enumerate(rounds_list):
            round_title = round_obj.get("title")
            seeds = round_obj.get("seeds", [])
            for game_index, seed in enumerate(seeds):
                user_winner = seed.get("winner")
                try:
                    live_winner = live_winners[region][round_index][game_index]
                    print(
                        "Region:",
                        region,
                        "Round:",
                        round_title,
                        "User winner:",
                        user_winner,
                        "Live winner:",
                        live_winner,
                        flush=True,
                    )
                    if user_winner == live_winner:
                        total_score += ROUND_POINTS.get(round_title, 0)
                except (IndexError, KeyError):
                    continue

    return total_score
