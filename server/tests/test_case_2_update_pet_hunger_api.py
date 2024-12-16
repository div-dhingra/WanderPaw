# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/<test_api>.py

# Invalid pet hunger
def test_case_2_update_pet_hunger(): 

    client = app.test_client()

    # Define the payload for POST request
    payload_above = {
        "newHunger": 110 # Invalid Hunger (0 <= hunger <= 100)
    }
 
    response = client.patch("/api/users/andrews_covalent_bond/update-pet-hunger", json=payload_above) # Send POST request

    # Verify DB-updating error due to violated constraint 
    assert response.status_code == 500

    # Define the payload for POST request
    payload_below = {
        "newHunger": -90 # Invalid Hunger (0 <= hunger <= 100)
    }
 
    response = client.patch("/api/users/andrews_covalent_bond/update-pet-hunger", json=payload_below) # Send POST request

    # Verify DB-updating error due to violated constraint 
    assert response.status_code == 500