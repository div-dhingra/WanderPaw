# Import flask app that all apis are bundled into for test
from server import app
from datetime import datetime

# Command to run tests (return True/False in console):
# pytest tests/<test_api>.py

# Non-existing user
def test_case_2_get_pet_mood():
    client = app.test_client()
    response = client.get("/api/users/pet-mood?user_name=non_existent_user")

    # Verify non-existent user error is returned
    assert response.status_code == 500