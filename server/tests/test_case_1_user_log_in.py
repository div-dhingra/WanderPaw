from server import app

# User login success | Correct password
def test_case_1_login_user():
    client = app.test_client()

    req_body = {"user_name": "andrews_covalent_bond", "password": "cmpe_131"}
    response = client.post("/api/auth/login", json=req_body) # Send post request
    data = response.json

    assert response.status_code == 201

    assert data['message'] == 'Welcome Back!'
    assert data['user_name'] == req_body['user_name']
