from app import db

class Bracket(db.Model):
    __tablename__ = 'bracket'
    id = db.Column(db.Integer, primary_key=True)
    bracket_number = db.Column(db.Integer, primary_key=True)
    bracket_selection = db.Column(db.JSON, nullable=False)