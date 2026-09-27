// Revelado al hacer scroll: cada .fase y .banda entra con fade + subida.
// gates: prefers-reduced-motion desactiva todo en CSS; aqui solo observamos.
const observador = new IntersectionObserver(
    (entradas) => {
        for (const entrada of entradas) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("is-in");
                observador.unobserve(entrada.target);
            }
        }
    },
    { threshold: 0.12 },
);

document
    .querySelectorAll(".fase, .flujo__pasos li, .banda__item, .cierre__caja")
    .forEach((el) => {
        el.classList.add("reveal");
        observador.observe(el);
    });

// ---------- Modal de código ----------
// Los fragmentos viven aqui como texto plano (whitespace exacto, sin pasar por
// el parser HTML) y se resaltan con un tokenizador minimo. El pie del modal
// enlaza al archivo completo de codigo/ para descargarlo.
const FRAGMENTOS = {
    config: {
        nombre: "config.py",
        ruta: "./codigo/config.py",
        codigo: `# Importaciones
import os
import secrets
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


class Config:
    """ Clase de configuración de variables de entorno de la aplicación """
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
        nombre: "app.py — /login",
        ruta: "./codigo/app.py",
        codigo: `# Login
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
        nombre: "app.py — /login/callback",
        ruta: "./codigo/app.py",
        codigo: `# Callback
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
        nombre: "user.py",
        ruta: "./codigo/user.py",
        codigo: `# Importaciones
from flask_login import UserMixin
from db import get_db

# Clase que representa un usuario y maneja la integración con Flask-Login
class User(UserMixin):
    def __init__(self, _id, name, email, profile_picture):
        self.id = _id
        self.name = name
        self.email = email
        self.profile_picture = profile_picture

    @staticmethod
    def get(user_id):
        """ Obtiene un usuario de la base de datos por su ID """
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
        """ Crea un nuevo usuario en la base de datos y lo retorna """
        db = get_db()
        db.execute(
            "INSERT INTO user (id, name, email, profile_picture) VALUES(?, ?, ?, ?)",
            (_id, name, email, profile_picture),
        )
        db.commit()

        return User(_id=_id, name=name, email=email, profile_picture=profile_picture)`,
    },
    db: {
        nombre: "db.py",
        ruta: "./codigo/db.py",
        codigo: `# Importaciones
import sqlite3
from typing import Optional
from flask import current_app, g

def get_db() -> sqlite3.Connection:
    """ Obtiene una conexión SQLite asociada al contexto de la petición """
    if "db" not in g:
        db_path = current_app.config["DATABASE"]
        g.db = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        g.db.row_factory = sqlite3.Row

    return g.db


def init_db() -> None:
    """ Inicializa la base de datos ejecutando el esquema SQL """
    db = get_db()
    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))
    db.commit()


def close_db(e: Optional[BaseException] = None) -> None:
    """ Cierra la conexión al finalizar el contexto """
    db = g.pop("db", None)
    if db is not None:
        db.close()


def register_db(app) -> None:
    """ Registra el cierre de la base de datos en el contexto de la app """
    app.teardown_appcontext(close_db)`,
    },
    schema: {
        nombre: "schema.sql",
        ruta: "./codigo/schema.sql",
        codigo: `-- Esquema de la tabla de usuarios
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    profile_picture TEXT NOT NULL
)`,
    },
    logout: {
        nombre: "app.py — /logout",
        ruta: "./codigo/app.py",
        codigo: `# Logout
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))`,
    },
};

// Escapa HTML y resalta comentarios, cadenas y palabras clave con un solo
// paso de tokenizado (el orden en la alternancia evita sustituciones anidadas).
const PALABRAS_CLAVE =
    "def|class|return|if|else|elif|for|while|import|from|as|with|in|is|not|and|or|None|True|False|pass|try|except|raise|CREATE|TABLE|IF|EXISTS|PRIMARY|KEY|UNIQUE|NOT|NULL|TEXT";

function resaltar(codigo) {
    const escapado = codigo
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
    const patron = new RegExp(
        `(#[^\\n]*)|("(?:[^"\\\\]|\\\\.)*")|\\b(${PALABRAS_CLAVE})\\b`,
        "g",
    );
    return escapado.replace(patron, (coincide, comentario, cadena, palabra) => {
        if (comentario) return `<span class="tok-com">${comentario}</span>`;
        if (cadena) return `<span class="tok-str">${cadena}</span>`;
        if (palabra) return `<span class="tok-key">${palabra}</span>`;
        return coincide;
    });
}

const modal = document.getElementById("modal-codigo");
const modalTitulo = document.getElementById("modal-titulo");
const modalContenido = document.getElementById("modal-contenido");
const modalDescarga = document.getElementById("modal-descarga");
let botonOrigen = null;

function abrirModal(id) {
    const info = FRAGMENTOS[id];
    if (!info) return;
    modalTitulo.textContent = info.nombre;
    modalContenido.innerHTML = resaltar(info.codigo);
    modalDescarga.href = info.ruta;
    modalDescarga.setAttribute("download", info.ruta.split("/").pop());
    modal.showModal();
}

document.querySelectorAll(".fase__ver").forEach((boton) => {
    boton.addEventListener("click", () => {
        botonOrigen = boton;
        abrirModal(boton.dataset.codigo);
    });
});

// Cierre: ✕, Escape (nativo del dialog) y clic en el fondo — un clic sobre el
// propio dialog solo puede venir del backdrop, porque la tarjeta lo cubre.
modal.addEventListener("click", (evento) => {
    if (evento.target === modal) modal.close();
});

modal.addEventListener("close", () => {
    if (botonOrigen) {
        botonOrigen.focus();
        botonOrigen = null;
    }
});

document.querySelectorAll("[data-cerrar]").forEach((boton) => {
    boton.addEventListener("click", () => modal.close());
});

