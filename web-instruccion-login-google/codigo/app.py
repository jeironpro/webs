# Importaciones
import json
import os
from config import Config
import sqlite3
import requests
from flask import Flask, redirect, render_template, request, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user
)

# Permitir el protocolo HTTP en oauthlib
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = Config.OAUTHLIB_INSECURE_TRANSPORT

from oauthlib.oauth2 import WebApplicationClient
from user import User
from db import register_db, init_db

# Iniciar la aplicación
app = Flask(__name__)

# Carga la configuración
app.config.from_object(Config)

# Instanciar LoginManager
login_manager = LoginManager()

# Agregar la aplicación a la instancia
login_manager.init_app(app)

# Registrar teardown
register_db(app)

# Inicializar DB al arrancar
with app.app_context():
    init_db()

# Inicializar cliente
client = WebApplicationClient(app.config["GOOGLE_CLIENT_ID"])

# Manejar sesión de usuario
@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

# Ruta principal
@app.route("/")
def index():
    if current_user.is_authenticated:
        return render_template(
            "index.html", 
            name=current_user.name,
            email=current_user.email,
            profile_picture=current_user.profile_picture
        )
    return render_template("index.html")

def get_google_provider_cfg():
    """ Devuelve un diccionario con toda la información necesaria para hacer OAuth dinámicamente """
    return requests.get(app.config["GOOGLE_DISCOVERY_URL"]).json()

# Login
@app.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )

    return redirect(request_uri)

# Callback
@app.route("/login/callback")
def callback():
    code = request.args.get("code")

    if not code:
        return "Authorization code missing", 400 

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=url_for("callback", _external=True),
        code=code,
    )

    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(app.config["GOOGLE_CLIENT_ID"], app.config["GOOGLE_CLIENT_SECRET"]),
        timeout=10,
    )

    if not token_response.ok:
        return "Failed to fetch token from google.", 400

    client.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)

    userinfo_response = requests.get(uri, headers=headers, timeout=10)

    if not userinfo_response.ok:
        return "Failed to fetch user info.", 400

    userinfo = userinfo_response.json()

    if not userinfo.get("email_verified"):
        return "Email not verified by Google.", 400

    google_id = userinfo["sub"]
    email = userinfo["email"]
    name = userinfo.get("given_name", "")
    picture = userinfo.get("picture", "")

    user = User.get(google_id)

    if not user:
        user = User.create(
            _id=google_id,
            name=name,
            email=email,
            profile_picture=picture
        )
    login_user(user)

    return redirect(url_for("index"))

# Logout
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)