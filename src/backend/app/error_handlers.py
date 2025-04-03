# mypy: disable-error-code=import-not-found
from flask import jsonify


def register_error_handlers(app):
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"message": "Internal Server Error"}), 500

    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"message": "Not Found"}), 404
