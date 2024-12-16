# API-Endpoint Test #1: 

# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/test_api.py

# 2 tests per api (good + faulty [expect faulty error response, ex. args not provided, etc.])

# Existing User
def test_case_1_get_pet_details():
    client = app.test_client()
    response = client.get("/api/users/pet-details?user_name=andrews_covalent_bond")

    data = response.json

    # Verify HTTP-ok status
    assert response.status_code == 200

    # Verify the top-level keys
    assert "petDetails" in data
    assert "message" in data

    # Verify pet_details structure (i.e. all keys exists in response)
    pet_details = data["petDetails"]
    assert "health" in pet_details
    assert "hunger" in pet_details
    assert "mood" in pet_details

    # Verify expected, specific values
    assert data["message"] == "Fetched pet details!"

    pet_health = pet_details.get("health")
    pet_hunger, hunger_last_updated = pet_details.get("hunger")
    pet_mood, mood_last_updated = pet_details.get("mood")

    # Verify data-type of each pet detail 
    # (values are dynamic, but data-types are static so we can uniformly test them)
    assert isinstance(pet_health, int)  
    assert isinstance(pet_hunger, int)  
    assert isinstance(pet_mood, int)  
    assert datetime.strptime(hunger_last_updated, '%a, %d %b %Y %H:%M:%S GMT') # If conversion to datetime object is valid,
    assert datetime.strptime(mood_last_updated, '%a, %d %b %Y %H:%M:%S GMT')   # FOR THIS PROVIDED FORMAT, then the string is 
                                                                               # a valid 'TIMESTAMP'-PSQL object.
                                                                               # Else, invalid string.

    # Verify that health, hunger, mood integer-attributes are within range (0 - 100)
    assert 0 <= pet_health <= 100
    assert 0 <= pet_hunger <= 100
    assert 0 <= pet_mood <= 100

    # game_data = []
    # qualified_games = find_qualified_games(game_data, 57, 1)
    # assert qualified_games == []
