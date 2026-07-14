import os
import uuid
import json
from datetime import datetime

import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template

load_dotenv()

app = Flask(__name__)

DB_FILE = "db.json"

SUNO_API_BASE = os.getenv("SUNO_API_BASE", "https://api.sunoapi.org")
SUNO_API_KEY = os.getenv("SUNO_API_KEY")
SUNO_MODEL = os.getenv("SUNO_MODEL", "V4_5")


def load_db():
    with open(DB_FILE) as f:
        return json.load(f)


def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)


def suno_headers():
    return {
        "Authorization": f"Bearer {SUNO_API_KEY}",
        "Content-Type": "application/json",
    }


def submit_generation(prompt, style, title, instrumental):
    body = {
        "prompt": prompt,
        "style": style or "",
        "title": title or "",
        "customMode": bool(style or title),
        "instrumental": instrumental,
        "model": SUNO_MODEL,
    }
    res = requests.post(
        f"{SUNO_API_BASE}/api/v1/generate",
        headers=suno_headers(),
        json=body,
        timeout=30,
    )
    res.raise_for_status()
    payload = res.json()
    data = payload.get("data") or {}
    task_id = data.get("taskId") or data.get("task_id") or data.get("id")
    if not task_id:
        raise RuntimeError(f"Suno API did not return a task id: {payload}")
    return task_id


def extract_audio_tracks(payload):
    """Walk the response looking for track-like objects with an audio URL.
    Provider response shapes vary, so this scans generically instead of
    assuming one exact schema.
    """
    tracks = []

    def walk(node):
        if isinstance(node, dict):
            audio_url = None
            for key in ("audioUrl", "audio_url", "streamAudioUrl", "stream_audio_url"):
                val = node.get(key)
                if isinstance(val, str) and val.startswith("http"):
                    audio_url = val
                    break
            if audio_url:
                tracks.append({
                    "audio_url": audio_url,
                    "title": node.get("title") or node.get("name") or "",
                    "image_url": node.get("imageUrl") or node.get("image_url") or "",
                    "duration": node.get("duration"),
                })
            for val in node.values():
                walk(val)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(payload)
    return tracks


def check_status(task_id):
    res = requests.get(
        f"{SUNO_API_BASE}/api/v1/generate/record-info",
        headers=suno_headers(),
        params={"taskId": task_id},
        timeout=30,
    )
    res.raise_for_status()
    payload = res.json()
    data = payload.get("data") or {}
    status = str(data.get("status") or payload.get("status") or "").upper()

    if status in ("SUCCESS", "COMPLETE", "COMPLETED"):
        tracks = extract_audio_tracks(data)
        return "complete", tracks
    if status in ("FAILED", "ERROR"):
        return "failed", []
    return "pending", []


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/generate", methods=["POST"])
def generate():
    if not SUNO_API_KEY:
        return jsonify({"error": "SUNO_API_KEY is not configured"}), 500

    data = request.json or {}
    prompt = (data.get("prompt") or "").strip()
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    style = data.get("style")
    title = data.get("title")
    instrumental = bool(data.get("instrumental"))

    try:
        task_id = submit_generation(prompt, style, title, instrumental)
    except (requests.RequestException, RuntimeError) as e:
        return jsonify({"error": str(e)}), 502

    song = {
        "id": str(uuid.uuid4()),
        "task_id": task_id,
        "prompt": prompt,
        "style": style or "",
        "title": title or "",
        "instrumental": instrumental,
        "status": "pending",
        "tracks": [],
        "created_at": datetime.now().isoformat(),
    }

    db = load_db()
    db["songs"].insert(0, song)
    save_db(db)

    return jsonify(song)


@app.route("/api/songs")
def songs():
    db = load_db()
    changed = False

    for song in db["songs"]:
        if song["status"] == "pending":
            try:
                status, tracks = check_status(song["task_id"])
            except requests.RequestException:
                continue
            if status != "pending":
                song["status"] = status
                song["tracks"] = tracks
                changed = True

    if changed:
        save_db(db)

    return jsonify(db["songs"])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
