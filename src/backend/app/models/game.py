# mypy: disable-error-code="name-defined"
from app import db


class Game(db.Model):
    __tablename__ = 'games'
    game_id = db.Column(db.Integer, primary_key=True)
    team_1 = db.Column(db.String(20))
    team_2 = db.Column(db.String(20))
    start_time = db.Column(db.String(20))
    winner = db.Column(db.String(20))
