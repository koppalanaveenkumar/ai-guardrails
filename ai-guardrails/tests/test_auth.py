def test_register_user(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "api_key" in data
    assert data["api_key"].startswith("ag_live_")

def test_register_duplicate_email(client):
    # Register once
    client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@example.com", "password": "password123"}
    )
    # Register again
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "duplicate@example.com", "password": "password123"}
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

def test_login_success(client):
    # Setup user
    reg_response = client.post(
        "/api/v1/auth/register",
        json={"email": "login@example.com", "password": "password123"}
    )
    api_key_original = reg_response.json()["api_key"]

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert response.json()["api_key"] == api_key_original

def test_login_failure(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "nonexistent@example.com", "password": "password123"}
    )
    assert response.status_code == 401
