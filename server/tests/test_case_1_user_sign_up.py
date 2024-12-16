from server import app

# New user creation test-case: Unique, NEW username
def test_case_1_create_new_user():
    client = app.test_client()

    req_body = {"user_name": "new_user", "password": "dummy_password"}
    response = client.post("/api/users", json=req_body) # Send post request
    data = response.json

    assert response.status_code == 201

    assert data['message'] == 'Congratulations! You\'ve succesfully made an account!'
    assert data['user_name'] == req_body['user_name']
    assert data['health'] == 100 # Default SQL-assignment for new account
    assert data['hunger'] == 0 # Default SQL-assignment for new account
    assert data['mood'] == 100 # Default SQL-assignment for new account
