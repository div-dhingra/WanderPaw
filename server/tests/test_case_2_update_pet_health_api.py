# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/<test_api>.py

# Invalid pet health
def test_case_2_update_pet_health(): 

    client = app.test_client()

    # Define the payload for POST request
    payload_above = {
        "newHealth": 110 # Invalid Health (0 <= health <= 100)
    }
 
    response = client.patch("/api/users/andrews_covalent_bond/update-pet-health", json=payload_above) # Send POST request

    # Verify DB-updating error due to violated constraint 
    assert response.status_code == 500

    # Define the payload for POST request
    payload_below = {
        "newHealth": -90 # Invalid Health (0 <= health <= 100)
    }
 
    response = client.patch("/api/users/andrews_covalent_bond/update-pet-health", json=payload_below) # Send POST request

    # Verify DB-updating error due to violated constraint 
    assert response.status_code == 500