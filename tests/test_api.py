import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pytest, app as m

@pytest.fixture()
def client(tmp_path):
    m.app.config["DB_PATH"] = str(tmp_path / "t.db")
    m.init_db()
    return m.app.test_client()

def test_health(client): assert client.get("/api/health").json == {"status":"ok"}
def test_profile(client): assert client.get("/api/profile").json["name"] == "Shradha Pateriya"
def test_skills(client): assert len(client.get("/api/skills").json) == 6
def test_projects(client):
    p = client.get("/api/projects").json
    assert len(p) == 9 and sum(x["featured"] for x in p) == 3 and p[0]["name"] == "BookHub"
def test_contact_ok(client):
    r = client.post("/api/contact", json={"name":"Asha", "email":"a@b.co", "message":"Hello, great portfolio!"})
    assert r.status_code == 201 and r.json["success"]
def test_contact_invalid(client):
    r = client.post("/api/contact", json={"name":"", "email":"bad", "message":"x"})
    assert r.status_code == 400 and set(r.json["errors"]) == {"name", "email", "message"}
