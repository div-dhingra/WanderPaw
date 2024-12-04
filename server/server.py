# NOTE: INCREMENTAL COMMITS: Code out entire thing, then delete portions to build up incremental commits (doing so AFTER I'm already done with the entire thing :)

# Import regex module for backend input-validation from request-headers (for non-frontend-called (i.e. frontend validation won't be present then), 
# intercepted/'direct' API-requests)
import re
import json # Module to read JSON objects, and convert them to usable JS-objects

import random # Module to generate random values

# Import Flask Class/Module/Library
from flask import Flask, jsonify, request

# For Environment Variables:
import os 
from dotenv import load_dotenv 

load_dotenv(dotenv_path=".dbenv")

# Import 'psycopg2' Module to Connect Database to our Flask-Python Backend
import psycopg2

# So my frontend can make API-calls to my backend (cross-origin (i.e. different domains) resource-sharing)
from flask_cors import CORS

from collections import OrderedDict

# Create Flask App (i.e. 'backend server/router')
app = Flask(__name__)
CORS(app)

connection_string = f""" gssencmode=disable 
    user={os.getenv("SUPABASE_USER")} password={os.getenv("SUPABASE_PASSWORD")} host={os.getenv("SUPABASE_HOST")} 
    port={os.getenv("SUPABASE_PORT") } dbname={os.getenv("SUPABASE_DB_NAME")} 
"""

conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

# : Try to fix this issue with supabase x flask (probably an issue with my SQL Queries Syntax) [although I just updated the value in 
# : supabase, itself so no need | just aligned here for consistency purposes :)]

# TODO: Test the patch-endpoints on my frontend, and (one by one) commit them to github branch (git branch backend-setup)
# TODO: ^^^ incremental commits for MODULARITY && READABILITY && EASY/EFFECTIVE CODE REVIEWS!!!
# 1 Pull request for ENTIRE FEATURE, incremental commits throughout
# If a feature is very large, it's common to split it into smaller PRs, each representing a meaningful, independent piece of the larger feature :)

# TODO: Do git status on the frontend to see what I changed, and only add what is needed (i.e. App.js 'Fetch initial petch-details' logic)

# TODO: Then add all patch-requests in my useEffect (clean-up function) SET-INTERVAL, that periodically update the health, hunger, mood of the pet.



# Users (non-serial attributes): UNIQUE username | is_activated_account | books_checked_out | books_overdue |
# password_hash BYTEA NOT NULL, -- password for the user (hashed for security) [bytea-format]
# # Dummy to single user for now (just update / read from this user's specific endpoint [check discord for api-endpoitns])
CREATE_USERS_TABLE = (
    """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, -- Unique user identifier for the table (hence SERIAL | unrelated to input)
            user_name TEXT NOT NULL UNIQUE, -- username
            pet_health INT NOT NULL DEFAULT 100, -- pet's current health level | 0 - 100
            pet_hunger INT NOT NULL DEFAULT 0, -- pet's current hunger level | 0 - 100
            pet_mood INT NOT NULL DEFAULT 100, -- pet's current mood level | 0 - 100
            creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- time account was created [NOW() is only for SQL-queries of the table, not creating its initial instance]
        );                    
    """
)

# Create Initial Users Table (Dummy User inside for testing)
def setInitialUsersTable():
    cursor.execute(CREATE_USERS_TABLE) # Insert dummy user into table
    cursor.execute("SELECT COUNT(*) FROM users;")

    row_count = cursor.fetchone()[0]

    if row_count == 0:
        cursor.execute("INSERT INTO users (user_name) VALUES (%s);", ("andrews_covalent_bond",))
        conn.commit() # Commit this change to GIT in supabase
        print("Initial Users Table Create") 
 
setInitialUsersTable() 

# Get details of this user's pet (health, hunger, mood)
# NOTE: Get-requests don't allow a request-body (RESTful principles): Use url-query-params 
# * (?user_name=andrews_covalent_bond")
@app.get("/api/users")
def getPetDetails():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_health, pet_hunger, pet_mood from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_health, pet_hunger, pet_mood = cursor.fetchone()

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"petDetails": {"health": pet_health, "hunger": pet_hunger, "mood": pet_mood}, "message": "Fetched pet details!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500       

# Update health of pet (from playing with it / feeding it)
# Health = f(Hunger, Mood)
@app.patch("/api/users/<user_name>/update-pet-health") # user_id is pulled from the query-param-path, hence its in the function-arg directly
def updatePetHealth(user_name : str):

    request_header_data = request.get_json()
    new_health : int = request_header_data.get("newHealth")

    try:
        cursor.execute("UPDATE users SET pet_health = %s WHERE user_name = %s", (new_health, user_name,))
        conn.commit() # Commit to remote Supabase-Database-Git Repo :)

        return jsonify({"message": f"User {user_name} pet health status updated to {new_health}"}), 200

    except Exception as e: # Handle database exceptions for caught-errors
        conn.rollback() # Undo the committed SQL-changes for this CURRENT SET OF COMMITS / Transaction SESSION
        return jsonify({"error": str(e)}), 500

# Update hunger of pet (from feeding it)
# NOTE: 'hunger' of pet is periodically (i.e. recurring interval-wise) increased if not fed for 'x amount of time'
@app.patch("/api/users/<user_name>/update-pet-hunger") # user_id is pulled from the query-param-path, hence its in the function-arg directly
def updatePetHunger(user_name : str):

    request_header_data = request.get_json()
    pet_hunger : int = request_header_data.get("newHunger")

    try:
        cursor.execute("UPDATE users SET pet_hunger = %s WHERE user_name = %s", (pet_hunger, user_name,))
        conn.commit() # Commit to remote Supabase-Database-Git Repo :)

        return jsonify({"message": f"User {user_name} pet hunger status updated to {pet_hunger}"}), 200

    except Exception as e: # Handle database exceptions for caught-errors
        conn.rollback() # Undo the committed SQL-changes for this CURRENT SET OF COMMITS / Transaction SESSION
        return jsonify({"error": str(e)}), 500

# Update mood of pet (from user interaction with it, i.e. playing with it)
# NOTE: 'mood' of pet is periodically (i.e. recurring interval-wise) decreased if not played/interacted with for 'x amount of time'
@app.patch("/api/users/<user_name>/update-pet-mood") # user_id is pulled from the query-param-path, hence its in the function-arg directly
def updatePetMood(user_name : str):

    request_header_data = request.get_json()
    pet_mood : int = request_header_data.get("newMood")

    try:
        cursor.execute("UPDATE users SET pet_mood = %s WHERE user_name = %s", (pet_mood, user_name,))
        conn.commit() # Commit to remote Supabase-Database-Git Repo :)

        return jsonify({"message": f"User {user_name} pet mood status updated to {pet_mood}"}), 200

    except Exception as e: # Handle database exceptions for caught-errors
        conn.rollback() # Undo the committed SQL-changes for this CURRENT SET OF COMMITS / Transaction SESSION
        return jsonify({"error": str(e)}), 500

