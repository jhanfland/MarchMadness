from app import db

class Game(db.Model):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    game_id = db.Column(db.String(20), unique=True, nullable=False)  # API game id
    home_team = db.Column(db.String(100), nullable=False)
    away_team = db.Column(db.String(100), nullable=False)
    home_score = db.Column(db.Integer, default=0)
    away_score = db.Column(db.Integer, default=0)
    game_state = db.Column(db.String(20), nullable=False)  # "pre", "live", "final"
    start_time = db.Column(db.String(50))
    start_date = db.Column(db.String(50))
    network = db.Column(db.String(50))
    winner = db.Column(db.String(100), nullable=True) # tbd winnter until final

