from server import app

# User-login error: Invalid Password
def test_case_2_login_user():
    client = app.test_client()

    req_body = {"user_name": "andrews_covalent_bond", "password": "incorrect_password"}
    response = client.post("/api/auth/login", json=req_body) # Send post request
    data = response.json

    assert response.status_code == 401
    assert data['error'] == 'Invalid Password. Please Try Again!'