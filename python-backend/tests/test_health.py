from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from python_backend.main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as test_client:
        yield test_client


def test_health_returns_ok(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert response.json() == {"status": "ok"}


def test_unknown_route_returns_not_found(client: TestClient) -> None:
    response = client.get("/missing")

    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}


def test_health_rejects_unsupported_method(client: TestClient) -> None:
    response = client.post("/health")

    assert response.status_code == 405
    assert response.json() == {"detail": "Method Not Allowed"}
