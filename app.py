"""Portfolio backend: Flask + SQLite."""
import os, re, sqlite3
from flask import Flask, jsonify, render_template, request

BASE = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)
application = app
app.config["DB_PATH"] = os.environ.get("DATABASE_PATH", os.path.join(BASE, "data", "portfolio.db"))
GH = "https://github.com/pateriyashraddha78-netizen"

PROFILE = {
    "name": "Shradha Pateriya", "role": "Python Web Developer | MCA Graduate",
    "location": "Indore, Madhya Pradesh, India",
    "tagline": "Building clean, responsive, and real-world web applications.",
    "about": "I am an MCA graduate from UIT RGPV, Bhopal, with a strong foundation in Python, web development and full-stack technologies. I am a quick learner, adaptable, and enjoy solving practical problems while continuously improving my technical and communication skills.",
    "goal": "Looking for an opportunity as a Python Developer, Backend Developer, Full-Stack Developer, Software Developer, or related entry-level technology role.",
    "github": GH, "resume": "/static/resume/resume.pdf",
    "education": [
        {"degree": "MCA", "institution": "University Institute of Technology, Rajiv Gandhi Proudyogiki Vishwavidyalaya (UIT RGPV), Bhopal", "detail": "Master of Computer Applications"},
        {"degree": "B.Sc", "institution": "Mahatma Gandhi Chitrkoot Vishwavidhyalaya, Tikamgarh", "detail": "Mathematics, Physics and Computer Science"},
    ],
    "soft_skills": ["Problem Solving", "Quick Learner", "Adaptability", "Team Collaboration", "Time Management", "Good Communication", "Self-Motivation"],
}
SKILLS = [
    {"category": "Frontend", "items": [("HTML5", 4), ("CSS3", 4), ("JavaScript", 3), ("React.js", 3)]},
    {"category": "Backend", "items": [("Python", 4), ("Flask", 3), ("REST APIs", 3)]},
    {"category": "Database", "items": [("SQL", 3), ("SQLite", 3), ("MySQL", 3)]},
    {"category": "Tools", "items": [("Git", 3), ("GitHub", 3), ("VS Code", 4), ("Postman", 3)]},
    {"category": "CMS / Web", "items": [("WordPress", 3), ("ACF", 2), ("Gutenberg", 2)]},
    {"category": "Additional", "items": [("Pandas", 3), ("NumPy", 3), ("Scikit-learn", 2), ("Basic Machine Learning", 2)]},
]
PROJECTS = [
    ("BookHub", "Full-stack book discovery platform with search, book details, favorites, reading history, themes and API integration.", "BookHub", "https://book-hub-260.preview.emergentagent.com", "React,TypeScript,Vite,FastAPI,API Integration", 1),
    ("CareerHub / JobHunt", "Job board application for discovering and managing job opportunities with a clean and responsive interface.", "jobhunt", None, "HTML,CSS,JavaScript,Python,Flask", 1),
    ("Movie Recommendation System", "Movie recommendation system designed to provide personalized movie suggestions using recommendation techniques.", "movieRecommendation", None, "Python,Machine Learning,Pandas,Scikit-learn", 1),
    ("Music Player", "Responsive music player supporting music categories and interactive playback controls.", "musicplayer", None, "HTML,CSS,JavaScript", 0),
    ("Online Exam Portal", "Web-based examination platform designed around online test workflows and user interaction.", "OnlineExam", None, "HTML,CSS,JavaScript", 0),
    ("DarshanHotel.com", "Responsive hotel website with rooms, availability, pricing, amenities, booking/inquiry and contact sections.", "DarshanHotel.com", None, "HTML,CSS,JavaScript", 0),
    ("RealTimeTaskManager", "Task management application with CRUD functionality and real-time task updates.", "RealTimeTaskManager", None, "Python,Flask,Firebase", 0),
    ("Weather App", "Weather application for searching and displaying weather information using an external API.", "Weatherapp", None, "HTML,CSS,JavaScript,API", 0),
    ("Tic-Tac-Toe", "Interactive browser-based Tic-Tac-Toe game with a responsive interface.", "Tic-Tac-Toe", None, "HTML,CSS,JavaScript", 0),
]

def db():
    con = sqlite3.connect(app.config["DB_PATH"])
    con.row_factory = sqlite3.Row
    return con

def init_db():
    os.makedirs(os.path.dirname(app.config["DB_PATH"]), exist_ok=True)
    with db() as con:
        con.execute("""CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
            message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
        con.execute("""CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY, name TEXT, description TEXT, github TEXT, live_url TEXT,
            tech TEXT, featured INTEGER)""")
        con.execute("DELETE FROM projects")
        con.executemany("INSERT INTO projects (id,name,description,github,live_url,tech,featured) VALUES (?,?,?,?,?,?,?)",
            [(i, n, d, f"{GH}/{r}", live, t, f) for i, (n, d, r, live, t, f) in enumerate(PROJECTS, 1)])

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@app.route("/")
def index(): return render_template("index.html")
@app.get("/api/health")
def health(): return jsonify(status="ok")
@app.get("/api/profile")
def profile(): return jsonify(PROFILE)
@app.get("/api/skills")
def skills(): return jsonify([{"category": s["category"], "items": [{"name": n, "level": l} for n, l in s["items"]]} for s in SKILLS])
@app.get("/api/projects")
def projects():
    with db() as con: rows = con.execute("SELECT * FROM projects ORDER BY featured DESC, id").fetchall()
    return jsonify([{**dict(r), "tech": r["tech"].split(","), "featured": bool(r["featured"])} for r in rows])
@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}
    name, email, message = str(data.get("name", "")).strip(), str(data.get("email", "")).strip(), str(data.get("message", "")).strip()
    errors = {}
    if not 2 <= len(name) <= 100: errors["name"] = "Enter your name (2-100 characters)."
    if not EMAIL_RE.match(email) or len(email) > 254: errors["email"] = "Enter a valid email address."
    if not 10 <= len(message) <= 2000: errors["message"] = "Message must be 10-2000 characters."
    if errors: return jsonify(success=False, errors=errors), 400
    try:
        with db() as con: con.execute("INSERT INTO messages (name,email,message) VALUES (?,?,?)", (name, email, message))
    except sqlite3.Error: return jsonify(success=False, error="Something went wrong. Please try again later."), 500
    return jsonify(success=True, message="Thanks! Your message has been received."), 201

init_db()
if __name__ == "__main__": app.run(debug=os.environ.get("FLASK_DEBUG") == "1", port=int(os.environ.get("PORT", 5000)))
