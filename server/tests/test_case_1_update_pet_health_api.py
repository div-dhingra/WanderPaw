# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/<test_api>.py

def test_case_1_update_pet_health():
    client = app.test_client()

    # Define the payload for POST request
    payload = {
        "newHealth": 100
    }
    response = client.patch("/api/users/andrews_covalent_bond/update-pet-health", json=payload) # Send POST request
    data_1 = response.json

    # Check response status for post-request, itself
    assert response.status_code == 200

    # Verify JSON-response-object structure (i.e. all keys exists in response)
    assert "message" in data_1

    # GET updated values from database (to check that the post-request actually updated values in the database)
    response = client.get("/api/users/pet-health?user_name=andrews_covalent_bond")
    data_2 = response.json

    # Check response status for integrated get-request
    assert response.status_code == 200

    user_name = "andrews_covalent_bond"
    new_health =  data_2.get("health")

    # Assert key-value pairs in response
    assert data_1["message"] == f"User {user_name} pet health status updated to {new_health}"