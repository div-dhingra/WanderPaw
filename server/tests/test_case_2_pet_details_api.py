# API-Endpoint Test #1: 

# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/test_api.py

# ! 2 tests per api (good + faulty [expect faulty error response, ex. args not provided, etc.])

# Non-existing user
def test_case_2_get_pet_details():
    client = app.test_client()
    response = client.get("/api/users/pet-details?user_name=non_existent_user")

    # Verify non-existent user error is returned
    assert response.status_code == 500