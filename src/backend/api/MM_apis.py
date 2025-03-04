import requests


class MM_APIs:

    @staticmethod
    def get_all_d1_teams:
        # getting all D1 basketball teams from API
        d1_teams_url = "https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams"
        response = requests.get(d1_teams_url)
        if response.status_code != 200:
            return []

        data = response.json()
        teams = []

        # get list of teams
        for league in data.get("sports", [])[0].get("leagues", []):
            for team_add in league.get("teams", []):
                team = team_add.get("team", {})
                teams.append({
                    "id": team.get("id"),
                    "abbreviation": team.get("abbreviation"),
                    "displayName": team.get("displayName"),
                    "shortDisplayName": team.get("shortDisplayName"),
                    "name": team.get("name"),
                    # could also get logos if needed
                })

        return teams


    def get_live_games():
        # getting live March Madness games from API
        live_games_url = "https://ncaa-api.henrygd.me/scoreboard/basketball-men/d1"

        response = requests.get(live_games_url)
        if response.status_code != 200:
            return []

        data = response.json()
        games = data.get("games", [])  # get the list of games

        live_games = []
        for g in games: # goes through games
            game = g.get("game", {})
            if not game:
                continue

            home_team = game["home"]["names"]["short"]
            away_team = game["away"]["names"]["short"]
            home_score = game["home"]["score"] if game["home"]["score"] else "0"
            away_score = game["away"]["score"] if game["away"]["score"] else "0"
            game_state = game.get("gameState", "Unknown")
            winner = home_team if game_state == "final" and game["home"].get("winner") else away_team if game_state == "final" else "TBD"

            live_games.append({
                "gameID": game.get("gameID"),
                "home_team": home_team,
                "away_team": away_team,
                "home_score": home_score,
                "away_score": away_score,
                "game_state": game_state,
                "start_time": game.get("startTime", "Unknown"),
                "start_date": game.get("startDate", "Unknown"),
                "network": game.get("network", "Unknown"),
                "winner": winner
            })

        return live_games

