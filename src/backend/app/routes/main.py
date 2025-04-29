# mypy: disable-error-code=import-not-found
from flask import Blueprint, jsonify, abort

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def hello_world():
    return jsonify({"message": "Hello, World!"})


# Dummy route to trigger a 500 error
@main_bp.route('/some-500-error-route')
def some_500_error_route():
    abort(500)
