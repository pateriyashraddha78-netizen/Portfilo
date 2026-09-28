# Shradha Pateriya, Portfolio

A full-stack developer portfolio: Flask + SQLite backend, vanilla-JS frontend that loads all content from the REST API. Light/dark theme, responsive, accessible, reduced-motion aware.

## Features
- Profile, skills, education and projects served by the API (no hardcoded cards in HTML)
- Project search + filters (All, Featured, Python, JavaScript, React)
- Contact form with client and server validation, stored in SQLite
- Loading, empty, error and success states; safe DOM rendering (no innerHTML)
- Resume button with graceful fallback when the PDF is missing
- SEO metadata, semantic HTML, Open Graph tags

## Tech stack
Python, Flask, SQLite, HTML5, CSS3, JavaScript (fetch API), Gunicorn.

## Structure
```text
app.py  requirements.txt  Procfile  README.md  .gitignore
data/portfolio.db (auto-created)   templates/index.html
static/{css/style.css, js/app.js, images/, resume/resume.pdf}
tests/test_api.py
```

## Run locally
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Open http://127.0.0.1:5000. Run tests with `python -m pytest`.

Environment variables (optional): `PORT`, `FLASK_DEBUG=1`, `DATABASE_PATH`.

## API
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | `{"status":"ok"}` |
| GET | /api/profile | Profile, education, soft skills |
| GET | /api/projects | Projects (featured first) |
| GET | /api/skills | Skills grouped by category |
| POST | /api/contact | JSON `{name, email, message}`; 201 on success, 400 with `errors` on invalid input |

## Database
SQLite file `data/portfolio.db`, created on startup. Table `messages(id, name, email, message, created_at)`. The `projects` table is re-seeded from `app.py` on each start. Edit the `PROJECTS` list there to add projects. On Render's free tier the disk is ephemeral, so stored messages reset on redeploy; attach a Render Disk and set `DATABASE_PATH` to keep them.

## Resume
Put your PDF at `static/resume/resume.pdf`.

## Deploy
GitHub repository: `pateriyashraddha78-netizen/Portfilo`

Render build command: `pip install -r requirements.txt`

Render start command: `gunicorn app:app`

## Projects
The portfolio includes GitHub links for BookHub, CareerHub/JobHunt, Movie Recommendation System, Music Player, Online Exam Portal, DarshanHotel.com, RealTimeTaskManager, Weather App and Tic-Tac-Toe.
