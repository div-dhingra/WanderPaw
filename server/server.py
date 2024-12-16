# NOTE: INCREMENTAL COMMITS: Code out entire thing, then delete portions to build up incremental commits (doing so AFTER I'm already done with the entire thing :)

# Import regex module for backend input-validation from request-headers (for non-frontend-called (i.e. frontend validation won't be present then), 
# intercepted/'direct' API-requests)
import re
import json # Module to read JSON objects, and convert them to usable JS-objects

import random # Module to generate random values

import bcrypt # for password hashing

from datetime import datetime

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

# Users (non-serial attributes): UNIQUE username | is_activated_account | books_checked_out | books_overdue |
# password_hash BYTEA NOT NULL, -- password for the user (hashed for security) [bytea-format]
# # Dummy to single user for now (just update / read from this user's specific endpoint [check discord for api-endpoitns])
CREATE_USERS_TABLE = (
    """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, -- Unique user identifier for the table (hence SERIAL | unrelated to input)
            user_name TEXT NOT NULL UNIQUE, -- username
            password_hash BYTEA, -- password
            pet_health INT NOT NULL DEFAULT 100, -- pet's current health level | 0 - 100
            pet_hunger INT NOT NULL DEFAULT 0, -- pet's current hunger level | 0 - 100
            pet_mood INT NOT NULL DEFAULT 100, -- pet's current mood level | 0 - 100
            hunger_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- time pet was last fed 
            mood_last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- time pet was last played with / petted
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
        # Generate cipher-text, w/ unique salt sprinkled on top for randomness...
        random_salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw("cmpe_131".encode('utf-8'), random_salt)

        cursor.execute("INSERT INTO users (user_name, password_hash) VALUES (%s, %s);", ("andrews_covalent_bond", password_hash))
        conn.commit() # Commit this change to GIT in supabase
        print("Initial Users Table Create") 
 
setInitialUsersTable() 

# Get details of this user's pet (health, hunger, mood)
# NOTE: Get-requests don't allow a request-body (RESTful principles): Use url-query-params 
# * (?user_name=andrews_covalent_bond")
@app.get("/api/users/pet-details")
def getPetDetails():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated = cursor.fetchone()

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"petDetails": {"health": pet_health, "hunger": (pet_hunger, hunger_last_updated), "mood": (pet_mood, mood_last_updated)}, "message": "Fetched pet details!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      
 
# Get UP-TO-DATE health-attribute of pet, SPECIFICALLY
# .../pet-health?user_name=andrews_covalent_bond" [no request-body for get-requests] (url-query params instead)
@app.get("/api/users/pet-health")
def getPetHealth():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_health from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_health = cursor.fetchone()[0]

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"health": pet_health, "message": "Fetched pet health!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      

# Get UP-TO-DATE hunger-attribute of pet, SPECIFICALLY
# .../pet-hunger?user_name=andrews_covalent_bond" [no request-body for get-requests] (url-query params instead)
@app.get("/api/users/pet-hunger")
def getPetHunger():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_hunger, hunger_last_updated from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_hunger, last_updated = cursor.fetchone()

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"hunger": (pet_hunger, last_updated), "message": "Fetched pet hunger!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      

# Get UP-TO-DATE mood-attribute of pet, SPECIFICALLY
# .../pet-mood?user_name=andrews_covalent_bond" [no request-body for get-requests] (url-query params instead)
@app.get("/api/users/pet-mood")
def getPetMood():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_mood, mood_last_updated from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_mood, last_updated = cursor.fetchone()

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"mood": (pet_mood, last_updated), "message": "Fetched pet mood!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      
        
# Update health of pet (from playing with it / feeding it)
# Health = f(Hunger, Mood)
@app.patch("/api/users/<user_name>/update-pet-health") # user_id is pulled from the query-param-path, hence its in the function-arg directly
def updatePetHealth(user_name : str):

    request_header_data = request.get_json()
    new_health = request_header_data.get("newHealth")

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
    current_time = datetime.now()

    try:
        cursor.execute("UPDATE users SET pet_hunger = %s, hunger_last_updated = %s WHERE user_name = %s", (pet_hunger, current_time, user_name,))
        conn.commit() # Commit to remote Supabase-Database-Git Repo :)

        print(cursor)

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

    current_time = datetime.now()

    try:
        cursor.execute("UPDATE users SET pet_mood = %s, mood_last_updated = %s WHERE user_name = %s", (pet_mood, current_time, user_name,))
        conn.commit() # Commit to remote Supabase-Database-Git Repo :)

        return jsonify({"message": f"User {user_name} pet mood status updated to {pet_mood}"}), 200

    except Exception as e: # Handle database exceptions for caught-errors
        conn.rollback() # Undo the committed SQL-changes for this CURRENT SET OF COMMITS / Transaction SESSION
        return jsonify({"error": str(e)}), 500

#  User Sign-up endpoint
@app.post("/api/users")
def userSignUp(): # Log-in or Create New User-account, depending on if it already exists.
   
    request_header_data = request.get_json()
    
    # Get all MANUALLY-required data-fields (columns) to create the user in my table
    # backend for intercepted, modified requests)
    user_name =  request_header_data.get("user_name")
    password = request_header_data.get("password") # For security, store hash of password (not password explicitly) in my database
    # or not password 

    # No user name provided
    if not user_name:
        return jsonify({'error': 'Please provide a username'}), 400

    try: 

        # * Check if this user already exists — if so, return 'Welcome Back' (account already exists),
        # * instead of duplicating the entry in the table
        cursor.execute("SELECT * FROM users WHERE user_name = %s", (user_name,))
        user_exists = cursor.fetchone() 

        # * FIRST: Check If this user already exists (to avoid unnecessary computations if the user doesn't) [i.e., as below]
        if user_exists:

            # * Get/Fetch password-hash (password CIPHERTEXT w/ un-enc salt sprinkled on top)
            # * for this existing user_account
            cursor.execute("SELECT password_hash FROM users WHERE user_name = %s", (user_name,))
            stored_password_hash = cursor.fetchone()[0] # Tuple of 1 element/column_field | * === tuple of all column_fields for this entry
            stored_password_hash = bytes(stored_password_hash) # Convert from memory-view format back to bytes-format :)

            # Check if correct password
            correct_password = (stored_password_hash == bcrypt.hashpw(password.encode('utf-8'), stored_password_hash))
            if correct_password:
                cursor.execute("SELECT pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated from users WHERE user_name=%s", (user_name,)) 
                pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated = cursor.fetchone()
                return jsonify({'message': 'Welcome Back!', 'user_name': user_name, "health": pet_health, "hunger": pet_hunger, "mood": pet_mood, "hunger_last_updated": hunger_last_updated, "mood_last_updated": mood_last_updated}), 201  # Log-in Success 

            # If wrong password (on the SIGN-UP page, then this user will be assumed to be a different entity,
            # meaning we don't allow duplicated user-names for different users)
            else:
                return jsonify({'error': 'Username is taken! Please enter a new username.'}), 409 # Error
                # return jsonify({'error': 'Invalid Password. Please Try Again!'}), 401  # Log-in Attempt #1 | Try Again
        
        # * ELSE: Unique user-name (no constraints violated) | create new user-entry in the table
        # * Random salt to prevent rainbow-table attacks,
        # * which map/backtrack common passwords from their STATIC encrypted-text (cipher-text)
        random_salt = bcrypt.gensalt()
        
        # Generate cipher-text, w/ unique salt sprinkled on top for randomness...
        password_hash = bcrypt.hashpw(password.encode('utf-8'), random_salt)

        # Create NEW, UNIQUE user – all other attributes are defaultly initialized (no need to manually specify)
        # i.e., insert new-user entry into my database
        # -- non-serial, non-default values are explicitly inserted
        cursor.execute( 
            """
                INSERT into users (user_name, password_hash)
                VALUES (%s, %s);
            """,
            (user_name, password_hash)
        )
        conn.commit()

        # Don't return password_hash (sensitive info)
        return jsonify({'message': 'Congratulations! You\'ve succesfully made an account!', 'user_name': user_name, "health": 100, "hunger": 0, "mood": 100}), 201  # Sign-Up-Creation-Success  

    except Exception as e:
        return jsonify({'error': f'{user_name} {password}'}), 500

# User Log-in endpoint (for pre-existing accounts ONLY)
@app.post("/api/auth/login")
def userLogIn():
    request_header_data = request.get_json()
    
    # Get all MANUALLY-required data-fields (columns) to create the user in my table
    # backend for intercepted, modified requests)
    user_name =  request_header_data.get("user_name")
    password = request_header_data.get("password")
    # password = request_header_data.get("password") # For security, store hash of password (not password explicitly) in my database
    # or not password 

    # id_pattern = r'^\d{4}$' # 9 digits == librarianID
    # if not re.match(id_pattern, user_id):

    # No user name provided
    if not user_name:
        return jsonify({'error': 'Please provide a username'}), 400

    try: 

        # * Check if this user already exists — if so, return 'Welcome Back' (account already exists),
        # * instead of duplicating the entry in the table
        cursor.execute("SELECT * FROM users WHERE user_name = %s", (user_name,))
        user_exists = cursor.fetchone() 

        # * FIRST: Check If this user already exists (to avoid unnecessary computations if the user doesn't) [i.e., as below]
        if user_exists:

            # * Get/Fetch password-hash (password CIPHERTEXT w/ un-enc salt sprinkled on top)
            # * for this existing user_account
            cursor.execute("SELECT password_hash FROM users WHERE user_name = %s", (user_name,))
            stored_password_hash = cursor.fetchone()[0] # Tuple of 1 element/column_field | * === tuple of all column_fields for this entry
            stored_password_hash = bytes(stored_password_hash) # Convert from memory-view format back to bytes-format :)

            # Check if correct password
            correct_password = (stored_password_hash == bcrypt.hashpw(password.encode('utf-8'), stored_password_hash))
            if correct_password:
                cursor.execute("SELECT pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated from users WHERE user_name=%s", (user_name,)) 
                pet_health, pet_hunger, pet_mood, hunger_last_updated, mood_last_updated = cursor.fetchone()
                return jsonify({'message': 'Welcome Back!', 'user_name': user_name, "health": pet_health, "hunger": pet_hunger, "mood": pet_mood, "hunger_last_updated": hunger_last_updated, "mood_last_updated": mood_last_updated}), 201  # Log-in Success 

            # Wrong password when logging in
            else:
                return jsonify({'error': 'Invalid Password. Please Try Again!'}), 401  # Log-in Attempt #1 | Try Again
        
        # Error: Cannot log-in to a NON-existing account        
        else:
            return jsonify({'error': 'This account does not exist. Please create an account to proceed.'}), 409 

    except Exception as e:
        return jsonify({'error': str(e)}), 500
