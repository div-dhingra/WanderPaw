from server import app

# New user creation test-case: Duplicate username (return error)
def test_case_2_create_new_user():
    client = app.test_client()

    req_body = {"user_name": "andrews_covalent_bond", "password": "dummy_password"}
    response = client.post("/api/users", json=req_body) # Send post request
    data = response.json

    assert response.status_code == 409
    assert data['error'] == 'Username is taken! Please enter a new username.'