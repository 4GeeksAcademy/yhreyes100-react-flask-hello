"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, jsonify,request,url_for,send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db,User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)


# Configura la extensión Flask-JWT-Extended
app.config["JWT_SECRET_KEY"] = "super19"  # ¡Cambia las palabras "super-secret" por otra cosa!
jwt = JWTManager(app)

CORS(app)


# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')



# Handle/serialize errors like a JSON object



@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    logged_user = get_jwt_identity();
    user = User.query.filter_by(username=logged_user).first()
    users = User.query.all()
    users = list(map(lambda x: x.serialize(), users))
    response_body = {
    "users":users
    }

    return jsonify(response_body), 200

@app.route('/user', methods=['POST'])
def create_user():
    data =  request.json
    user1 = User(username=data["username"], password=data["password"])
    db.session.add(user1)
    db.session.commit()
    users = User.query.all()
    users = list(map(lambda x: x.serialize(), users))
    response_body = {
    "users":users
    }

    return jsonify(response_body), 200




@app.route('/login', methods=['POST'])
def token():
    user = User.query.filter_by(username=request.json["username"], password=request.json["password"]).first()
    access_token=create_access_token(identity=user.username)
    return jsonify({"token":access_token,"user":user.username}),200

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
