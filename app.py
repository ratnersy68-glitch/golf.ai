import os, json, uuid, requests
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from openai import OpenAI
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv()

app = Flask(__name__)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
sg = SendGridAPIClient(os.getenv("SENDGRID_API_KEY"))

DB_FILE = "db.json"

def load_db():
    with open(DB_FILE) as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_location(zip_code):
    res = requests.get("https://maps.googleapis.com/maps/api/geocode/json", params={
        "address": zip_code,
        "key": os.getenv("GOOGLE_API_KEY")
    }).json()

    loc = res["results"][0]
    return {
        "lat": loc["geometry"]["location"]["lat"],
        "lng": loc["geometry"]["location"]["lng"],
        "city": loc["address_components"][1]["long_name"]
    }

def get_courses(lat, lng):
    res = requests.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", params={
        "location": f"{lat},{lng}",
        "radius": 15000,
        "keyword": "golf course",
        "key": os.getenv("GOOGLE_API_KEY")
    }).json()

    return [c for c in res["results"] if c.get("rating", 0) >= 4][:5]

def generate_email(name, city, msg, tone):
    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": f"Write outreach emails in a {tone} tone"},
            {"role": "user", "content": f"Write email to {name} in {city}. Idea: {msg}"}
        ]
    )
    return completion.choices[0].message.content

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    loc = get_location(data["zip"])
    courses = get_courses(loc["lat"], loc["lng"])

    db = load_db()
    results = []

    for c in courses:
        msg = generate_email(c["name"], loc["city"], data["message"], data["tone"])

        lead = {
            "id": str(uuid.uuid4()),
            "name": c["name"],
            "rating": c.get("rating", 0),
            "message": msg,
            "status": "new"
        }

        db["leads"].append(lead)
        results.append(lead)

    save_db(db)
    return jsonify(results)

@app.route("/send", methods=["POST"])
def send():
    data = request.json
    db = load_db()

    lead = next(l for l in db["leads"] if l["id"] == data["id"])

    email = Mail(
        from_email=os.getenv("FROM_EMAIL"),
        to_emails=data["email"],
        subject=f"Idea for {lead['name']}",
        plain_text_content=lead["message"]
    )

    sg.send(email)

    lead["status"] = "sent"

    db["followUps"].append({
        "id": str(uuid.uuid4()),
        "leadId": lead["id"],
        "email": data["email"],
        "date": (datetime.now() + timedelta(days=3)).isoformat(),
        "sent": False
    })

    save_db(db)
    return jsonify({"success": True})

@app.route("/leads")
def leads():
    return jsonify(load_db()["leads"])

if __name__ == "__main__":
    import os
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

















Hello