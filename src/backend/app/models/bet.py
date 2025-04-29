# mypy: disable-error-code="name-defined"
from app import db


class Bet(db.Model):
    __tablename__ = 'bets'
    bet_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    game_id = db.Column(db.Integer)
    bet_amount = db.Column(db.Integer)
    bet_type = db.Column(db.String(20))
    odds = db.Column(db.Float)
    status = db.Column(db.String(20))
    created_at = db.Column(db.String(20))
