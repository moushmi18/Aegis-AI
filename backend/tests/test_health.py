"""API tests for the health and root endpoints."""

from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == settings.APP_NAME
    assert data["version"] == settings.APP_VERSION
    assert data["environment"] == settings.APP_ENV
    assert "timestamp" in data
    assert data["timestamp"]


def test_root_returns_service_info() -> None:
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == settings.APP_NAME
    assert data["version"] == settings.APP_VERSION
    assert data["health"] == "/api/v1/health"
    assert data["docs"] == "/docs"
