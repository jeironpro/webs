const observer = new IntersectionObserver(
    (entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-in");
                observer.unobserve(entry.target);
            }
        }
    },
    { threshold: 0.12 }
);

document.querySelectorAll(".phase, .flow__steps li, .band__item, .closing__box").forEach((el) => {
    el.classList.add("reveal");
    observer.observe(el);
});

const SNIPPETS = {
    config: {
        name: "config.py",
        path: "./codigo/config.py",
        code: `# Imports
import os
import secrets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """ Application environment variable configuration class """
    SECRET_KEY = secrets.token_hex(64)
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
    GOOGLE_DISCOVERY_URL = (
        "https://accounts.google.com/.well-known/openid-configuration"
    )
    DATABASE = os.getenv("DATABASE")
    OAUTHLIB_INSECURE_TRANSPORT = os.getenv("OAUTHLIB_INSECURE_TRANSPORT")`,
    },
    login: {
        name: "app.py — /login",
        path: "./codigo/app.py",
        code: `# Login
@app.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )

    return redirect(request_uri)`,
    },
    callback: {
        name: "app.py — /login/callback",
        path: "./codigo/app.py",
        code: `# Callback
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
        return "Email not verified by Google.", 400`,
    },
    user: {
        name: "user.py",
        path: "./codigo/user.py",
        code: `# Imports
from flask_login import UserMixin
from db import get_db

# Class that represents a user and handles the Flask-Login integration
class User(UserMixin):
    def __init__(self, _id, name, email, profile_picture):
        self.id = _id
        self.name = name
        self.email = email
        self.profile_picture = profile_picture

    @staticmethod
    def get(user_id):
        """ Get a user from the database by its ID """
        db = get_db()
        user = db.execute(
            "SELECT * FROM user WHERE id = ?", (user_id,)
        ).fetchone()

        if not user:
            return None

        return User(
            _id=user[0], name=user[1], email=user[2], profile_picture=user[3]
        )

    @staticmethod
    def create(_id, name, email, profile_picture):
        """ Create a new user in the database and return it """
        db = get_db()
        db.execute(
            "INSERT INTO user (id, name, email, profile_picture) VALUES(?, ?, ?, ?)",
            (_id, name, email, profile_picture),
        )
        db.commit()

        return User(_id=_id, name=name, email=email, profile_picture=profile_picture)`,
    },
    db: {
        name: "db.py",
        path: "./codigo/db.py",
        code: `# Imports
import sqlite3
from typing import Optional
from flask import current_app, g

def get_db() -> sqlite3.Connection:
    """ Get a SQLite connection bound to the request context """
    if "db" not in g:
        db_path = current_app.config["DATABASE"]
        g.db = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row

    return g.db

def init_db() -> None:
    """ Initialize the database by running the SQL schema """
    db = get_db()
    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))
    db.commit()

def close_db(e: Optional[BaseException] = None) -> None:
    """ Close the connection at the end of the context """
    db = g.pop("db", None)
    if db is not None:
        db.close()

def register_db(app) -> None:
    """ Register the database teardown in the app context """
    app.teardown_appcontext(close_db)`,
    },
    schema: {
        name: "schema.sql",
        path: "./codigo/schema.sql",
        code: `-- User table schema
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_picture TEXT NOT NULL
)`,
    },
    logout: {
        name: "app.py — /logout",
        path: "./codigo/app.py",
        code: `# Logout
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))`,
    },
};

const KEYWORDS =
    "def|class|return|if|else|elif|for|while|import|from|as|with|in|is|not|and|or|None|True|False|pass|try|except|raise|CREATE|TABLE|IF|EXISTS|PRIMARY|KEY|UNIQUE|NOT|NULL|TEXT";

function highlight(code) {
    const fragment = document.createDocumentFragment();
    const pattern = new RegExp(`(#[^\\n]*)|("(?:[^"\\\\]|\\\\.)*")|\\b(${KEYWORDS})\\b`, "g");

    let last = 0;
    for (const match of code.matchAll(pattern)) {
        const [text, comment, string, word] = match;
        if (match.index > last) {
            fragment.append(code.slice(last, match.index));
        }

        const tokenClass = comment ? "tok-com" : string ? "tok-str" : word ? "tok-key" : "";
        if (tokenClass) {
            const token = document.createElement("span");
            token.className = tokenClass;
            token.textContent = text;
            fragment.append(token);
        } else {
            fragment.append(text);
        }

        last = match.index + text.length;
    }

    if (last < code.length) fragment.append(code.slice(last));
    return fragment;
}

const modal = document.getElementById("modal-code");
const modalTitle = document.getElementById("modal-title");
const modalContent = document.getElementById("modal-content");
const modalDownload = document.getElementById("modal-download");
let originButton = null;

function openModal(id) {
    const info = SNIPPETS[id];
    if (!info) return;
    modalTitle.textContent = info.name;
    modalContent.replaceChildren(highlight(info.code));
    modalDownload.href = info.path;
    modalDownload.setAttribute("download", info.path.split("/").pop());
    modal.showModal();
}

document.querySelectorAll(".phase__view").forEach((button) => {
    button.addEventListener("click", () => {
        originButton = button;
        openModal(button.dataset.code);
    });
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.close();
});

modal.addEventListener("close", () => {
    if (originButton) {
        originButton.focus();
        originButton = null;
    }
});

document.querySelectorAll("[data-close]").forEach((button) => {
    button.addEventListener("click", () => modal.close());
});
