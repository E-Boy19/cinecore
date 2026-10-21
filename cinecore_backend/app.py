from __future__ import annotations

import os
from datetime import date, datetime
from typing import Any

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "MovieDB"),
}


def get_db():
    return mysql.connector.connect(**DB_CONFIG)


def json_value(value: Any) -> Any:
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value


def serialize_row(row: dict[str, Any] | None) -> dict[str, Any] | None:
    if row is None:
        return None
    return {key: json_value(value) for key, value in row.items()}


def serialize_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [serialize_row(row) for row in rows]


def error_response(message: str, status: int = 400):
    return jsonify({"error": message}), status


@app.get("/api/health")
def health():
    connection = None
    cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor()
        cursor.execute("SELECT DATABASE() AS db")
        row = cursor.fetchone()
        return jsonify({"status": "ok", "database": row[0]})
    except Exception as exc:
        return jsonify({"status": "error", "error": str(exc)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- MOVIES ----------------

@app.get("/api/movies")
def get_movies():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            ORDER BY MID
            """
        )
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/movies/<int:movie_id>")
def get_movie(movie_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            WHERE MID = %s
            """,
            (movie_id,),
        )
        row = cursor.fetchone()
        if not row:
            return error_response("Movie not found.", 404)
        return jsonify(serialize_row(row))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.post("/api/movies")
def create_movie():
    data = request.get_json(silent=True) or {}
    required = ["Name", "Genre", "FilmIndustry", "ReleaseDate", "IMDbRating", "PID", "DID"]
    missing = [field for field in required if data.get(field) in (None, "")]
    if missing:
        return error_response(f"Missing fields: {', '.join(missing)}")

    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        rating = float(data["IMDbRating"])
        if rating < 0 or rating > 10:
            return error_response("IMDb rating must be between 0 and 10.")

        cursor.execute("SELECT COALESCE(MAX(MID), 100) + 1 AS NextMID FROM MOVIES")
        movie_id = int(cursor.fetchone()["NextMID"])

        cursor.execute(
            """
            INSERT INTO MOVIES
                (MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                movie_id,
                str(data["Name"]).strip(),
                str(data["Genre"]).strip(),
                str(data["FilmIndustry"]).strip(),
                data["ReleaseDate"],
                rating,
                int(data["PID"]),
                int(data["DID"]),
            ),
        )

        actor_ids = data.get("actorIds") or []
        for actor_id in actor_ids:
            cursor.execute(
                "INSERT INTO MOVIE_ACTORS (MID, AID) VALUES (%s, %s)",
                (movie_id, int(actor_id)),
            )

        connection.commit()

        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            WHERE MID = %s
            """,
            (movie_id,),
        )
        return jsonify(serialize_row(cursor.fetchone())), 201
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.put("/api/movies/<int:movie_id>")
def update_movie(movie_id: int):
    data = request.get_json(silent=True) or {}
    allowed = ["Name", "Genre", "FilmIndustry", "ReleaseDate", "IMDbRating", "PID", "DID"]

    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT MID FROM MOVIES WHERE MID = %s", (movie_id,))
        if not cursor.fetchone():
            connection.rollback()
            return error_response("Movie not found.", 404)

        assignments = []
        values: list[Any] = []

        for field in allowed:
            if field in data:
                value = data[field]
                if field == "IMDbRating":
                    value = float(value)
                    if value < 0 or value > 10:
                        return error_response("IMDb rating must be between 0 and 10.")
                elif field in ("PID", "DID"):
                    value = int(value)
                elif field in ("Name", "Genre", "FilmIndustry"):
                    value = str(value).strip()
                assignments.append(f"{field} = %s")
                values.append(value)

        if assignments:
            values.append(movie_id)
            cursor.execute(
                f"UPDATE MOVIES SET {', '.join(assignments)} WHERE MID = %s",
                tuple(values),
            )

        if "actorIds" in data:
            cursor.execute("DELETE FROM MOVIE_ACTORS WHERE MID = %s", (movie_id,))
            for actor_id in data.get("actorIds") or []:
                cursor.execute(
                    "INSERT INTO MOVIE_ACTORS (MID, AID) VALUES (%s, %s)",
                    (movie_id, int(actor_id)),
                )

        connection.commit()

        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            WHERE MID = %s
            """,
            (movie_id,),
        )
        return jsonify(serialize_row(cursor.fetchone()))
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.delete("/api/movies/<int:movie_id>")
def delete_movie(movie_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor()

        cursor.execute("SELECT MID FROM MOVIES WHERE MID = %s", (movie_id,))
        if not cursor.fetchone():
            connection.rollback()
            return error_response("Movie not found.", 404)

        cursor.execute("DELETE FROM MOVIE_ACTORS WHERE MID = %s", (movie_id,))
        cursor.execute("DELETE FROM MOVIES WHERE MID = %s", (movie_id,))
        connection.commit()
        return jsonify({"success": True})
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- ACTORS ----------------

@app.get("/api/actors")
def get_actors():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT AID, Name, Age, Gender FROM ACTORS ORDER BY AID")
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/actors/<int:actor_id>")
def get_actor(actor_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT AID, Name, Age, Gender FROM ACTORS WHERE AID = %s",
            (actor_id,),
        )
        row = cursor.fetchone()
        if not row:
            return error_response("Actor not found.", 404)
        return jsonify(serialize_row(row))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.post("/api/actors")
def create_actor():
    data = request.get_json(silent=True) or {}
    if not data.get("Name"):
        return error_response("Actor name is required.")

    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COALESCE(MAX(AID), 0) + 1 AS NextAID FROM ACTORS")
        actor_id = int(cursor.fetchone()["NextAID"])

        cursor.execute(
            """
            INSERT INTO ACTORS (AID, Name, Age, Gender)
            VALUES (%s, %s, %s, %s)
            """,
            (
                actor_id,
                str(data["Name"]).strip(),
                int(data.get("Age", 35)),
                str(data.get("Gender", "Male")),
            ),
        )
        connection.commit()

        cursor.execute(
            "SELECT AID, Name, Age, Gender FROM ACTORS WHERE AID = %s",
            (actor_id,),
        )
        return jsonify(serialize_row(cursor.fetchone())), 201
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/actors/<int:actor_id>/movies")
def actor_movies(actor_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT M.MID, M.Name, M.Genre, M.FilmIndustry, M.ReleaseDate,
                   M.IMDbRating, M.PID, M.DID
            FROM MOVIES M
            JOIN MOVIE_ACTORS MA ON M.MID = MA.MID
            WHERE MA.AID = %s
            ORDER BY M.MID
            """,
            (actor_id,),
        )
        rows = cursor.fetchall()
        return jsonify([{"movie": serialize_row(row), "role": None} for row in rows])
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/movies/<int:movie_id>/actors")
def movie_actors(movie_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT A.AID, A.Name, A.Age, A.Gender
            FROM ACTORS A
            JOIN MOVIE_ACTORS MA ON A.AID = MA.AID
            WHERE MA.MID = %s
            ORDER BY A.AID
            """,
            (movie_id,),
        )
        rows = cursor.fetchall()
        return jsonify([{"actor": serialize_row(row), "role": None} for row in rows])
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/movie-actors")
def get_movie_actors():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT MID, AID FROM MOVIE_ACTORS ORDER BY MID, AID")
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- DIRECTORS ----------------

@app.get("/api/directors")
def get_directors():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT DID, Name, Age FROM DIRECTOR ORDER BY DID")
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/directors/<int:director_id>")
def get_director(director_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT DID, Name, Age FROM DIRECTOR WHERE DID = %s",
            (director_id,),
        )
        row = cursor.fetchone()
        if not row:
            return error_response("Director not found.", 404)
        return jsonify(serialize_row(row))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.post("/api/directors")
def create_director():
    data = request.get_json(silent=True) or {}
    if not data.get("Name"):
        return error_response("Director name is required.")

    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COALESCE(MAX(DID), 0) + 1 AS NextDID FROM DIRECTOR")
        director_id = int(cursor.fetchone()["NextDID"])

        cursor.execute(
            """
            INSERT INTO DIRECTOR (DID, Name, Age)
            VALUES (%s, %s, %s)
            """,
            (director_id, str(data["Name"]).strip(), int(data.get("Age", 45))),
        )
        connection.commit()

        cursor.execute(
            "SELECT DID, Name, Age FROM DIRECTOR WHERE DID = %s",
            (director_id,),
        )
        return jsonify(serialize_row(cursor.fetchone())), 201
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/directors/<int:director_id>/movies")
def director_movies(director_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            WHERE DID = %s
            ORDER BY MID
            """,
            (director_id,),
        )
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- PRODUCERS ----------------

@app.get("/api/producers")
def get_producers():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT PID, Name, Age, CompanyName FROM PRODUCER ORDER BY PID")
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/producers/<int:producer_id>")
def get_producer(producer_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            "SELECT PID, Name, Age, CompanyName FROM PRODUCER WHERE PID = %s",
            (producer_id,),
        )
        row = cursor.fetchone()
        if not row:
            return error_response("Producer not found.", 404)
        return jsonify(serialize_row(row))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.post("/api/producers")
def create_producer():
    data = request.get_json(silent=True) or {}
    if not data.get("Name") or not data.get("CompanyName"):
        return error_response("Producer name and company name are required.")

    connection = cursor = None
    try:
        connection = get_db()
        connection.start_transaction()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COALESCE(MAX(PID), 0) + 1 AS NextPID FROM PRODUCER")
        producer_id = int(cursor.fetchone()["NextPID"])

        cursor.execute(
            """
            INSERT INTO PRODUCER (PID, Name, Age, CompanyName)
            VALUES (%s, %s, %s, %s)
            """,
            (
                producer_id,
                str(data["Name"]).strip(),
                int(data.get("Age", 45)),
                str(data["CompanyName"]).strip(),
            ),
        )
        connection.commit()

        cursor.execute(
            "SELECT PID, Name, Age, CompanyName FROM PRODUCER WHERE PID = %s",
            (producer_id,),
        )
        return jsonify(serialize_row(cursor.fetchone())), 201
    except mysql.connector.Error as exc:
        if connection:
            connection.rollback()
        return error_response(str(exc), 400)
    except Exception as exc:
        if connection:
            connection.rollback()
        connection.rollback() if connection else None
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.get("/api/producers/<int:producer_id>/movies")
def producer_movies(producer_id: int):
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT MID, Name, Genre, FilmIndustry, ReleaseDate, IMDbRating, PID, DID
            FROM MOVIES
            WHERE PID = %s
            ORDER BY MID
            """,
            (producer_id,),
        )
        return jsonify(serialize_rows(cursor.fetchall()))
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- AUDIT ----------------

@app.get("/api/audit-logs")
def get_audit_logs():
    connection = cursor = None
    try:
        connection = get_db()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT AuditID, MID, MovieName, ActionType, OldRating, NewRating, ActionTime
            FROM MOVIE_AUDIT
            ORDER BY ActionTime DESC, AuditID DESC
            """
        )
        return jsonify(serialize_rows(cursor.fetchall()))
    except mysql.connector.Error as exc:
        return error_response(str(exc), 500)
    except Exception as exc:
        return error_response(str(exc), 500)
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )
