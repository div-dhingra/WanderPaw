
# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/test_api.py

# 2 tests per api (good + faulty [expect faulty error response, ex. args not provided, etc.])

# Existing User | Check: Returning right information?
def test_case_1_get_pet_health():
    client = app.test_client()
    response = client.get("/api/users/pet-health?user_name=andrews_covalent_bond")

    data = response.json

    # Verify HTTP-ok status
    assert response.status_code == 200

    # Verify pet_health object structure (i.e. all keys exists in response)
    assert "health" in data
    assert "message" in data

    # Verify expected, specific values
    assert data["message"] == "Fetched pet health!"

    pet_health = data.get("health")

    # Verify data-type of each pet detail 
    # (values are dynamic, but data-types are static so we can uniformly test them)
    assert isinstance(pet_health, int)  

    # Verify that health, hunger, mood integer-attributes are within range (0 - 100)
    assert 0 <= pet_health <= 100