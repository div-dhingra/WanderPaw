# NOTE: INCREMENTAL COMMITS: Code out entire thing, then delete portions to build up incremental commits (doing so AFTER I'm already done with the entire thing :)

# Import regex module for backend input-validation from request-headers (for non-frontend-called (i.e. frontend validation won't be present then), 
# intercepted/'direct' API-requests)
import re
import json # Module to read JSON objects, and convert them to usable JS-objects

import random # Module to generate random values

import datetime

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
            pet_hunger INT NOT NULL DEFAULT 10, -- pet's current hunger level | 0 - 100
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
        cursor.execute("SELECT pet_hunger from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_hunger = cursor.fetchone()[0]
        print(pet_hunger)

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"hunger": pet_hunger, "message": "Fetched pet hunger!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      

# Get UP-TO-DATE mood-attribute of pet, SPECIFICALLY
# .../pet-mood?user_name=andrews_covalent_bond" [no request-body for get-requests] (url-query params instead)
@app.get("/api/users/pet-mood")
def getPetMood():
    try:
        user_name = request.args.get("user_name") # from url-path query params
        cursor.execute("SELECT pet_mood from users WHERE user_name=%s", (user_name,)) 

        # Unpack tuple of values
        pet_mood = cursor.fetchone()[0]

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"mood": pet_mood, "message": "Fetched pet mood!"}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500      
        
# Update health of pet (from playing with it / feeding it)
# Health = f(Hunger, Mood)
@app.patch("/api/users/<user_name>/update-pet-health") # user_id is pulled from the query-param-path, hence its in the function-arg directly
def updatePetHealth(user_name : str):

    request_header_data = request.get_json()
    new_health = request_header_data.get("newHealth")
    print(new_health)

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

# TODO: Add new users? Create login page in frontend and use bcrypt for hashing passwords.
# Else, dummy user for now is 'andrews_covalent_bond'
@app.post("/api/users")
def processUser(): # Log-in or Create New User-account, depending on if it already exists.
   
    request_header_data = request.get_json()
    
    # Get all MANUALLY-required data-fields (columns) to create the user in my table
    # backend for intercepted, modified requests)
    user_name =  request_header_data.get("user_name")
    # password = request_header_data.get("password") # For security, store hash of password (not password explicitly) in my database
    # or not password 

    # id_pattern = r'^\d{4}$' # 9 digits == librarianID
    # if not re.match(id_pattern, user_id):

    # No user name provided
    if not user_name:
        return jsonify({'error': 'Please provide a username'}), 400

    try: 

        # Check if this user already exists — if so, return 'Welcome Back' (account already exists),
        # instead of duplicating the entry in the table
        cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
        user_exists = cursor.fetchone() 

        # * FIRST: Check If this user already exists (to avoid unnecessary computations if the user doesn't) [i.e., as below]
        if user_exists:

            cursor.execute("SELECT pet_health, pet_hunger, pet_mood from users WHERE user_name=%s", (user_name,)) 
            pet_health, pet_hunger, pet_mood = cursor.fetchall()
            return jsonify({'message': 'Welcome Back!', 'user_name': user_name, "health": pet_health, "hunger": pet_hunger, "mood": pet_mood}), 201  # Log-in Success 

            # # * Get/Fetch password-hash (password CIPHERTEXT w/ un-enc salt sprinkled on top)
            # # * for this existing user_account
            # cursor.execute("SELECT password_hash FROM users WHERE user_id = %s", (user_id,))
            # stored_password_hash = cursor.fetchone()[0] # Tuple of 1 element/column_field | * === tuple of all column_fields for this entry
            # stored_password_hash = bytes(stored_password_hash) # Convert from memory-view format back to bytes-format :)

            # correct_password = (stored_password_hash == bcrypt.hashpw(password.encode('utf-8'), stored_password_hash))
            # if correct_password:
            #     is_active_account = user_exists[5] # Get Active Status, i.e. 5th element in returned tuple of row-entry values (i.e. column_field values)
            #     if not is_active_account:
            #         num_books_overdue = len(user_exists[6])
            #         if num_books_overdue == 0: # New account
            #             return jsonify({'error': 'A librarian will activate your newly created account shortly.'}), 403
                    
            #         return jsonify({'error': """You're account has been deactivated for >3 overdue books. Please return them to access your account."""}), 403
                
            #     cursor.execute("SELECT * FROM user_book_checkouts WHERE user_id = %s", (user_id,))
            #     book_checkouts = [book_isbn_id for x, book_isbn_id, z in cursor.fetchall()]
            #     return jsonify({'message': 'Welcome Back!', 'user_id': user_id, 'is_active_account': is_active_account, 'book_checkouts': book_checkouts}), 201  # Log-in Success 
            # else:
            #     return jsonify({'error': 'Invalid Password. Please Try Again!'}), 401  # Log-in Attempt #1 | Try Again

        else:
            cursor.execute("SELECT * FROM users WHERE user_name = %s", (user_name,))
            is_duplicate_user_name = cursor.fetchone()
            if is_duplicate_user_name:
                return jsonify({'error': 'Username is taken! Please enter a new username.'}), 409 # Error
        
        # Random salt to prevent rainbow-table attacks,
        # # which map/backtrack common passwords from their STATIC encrypted-text (cipher-text)
        # random_salt = bcrypt.gensalt()
        
        # # Generate cipher-text, w/ unique salt sprinkled on top for randomness...
        # password_hash = bcrypt.hashpw(password.encode('utf-8'), random_salt)

        # Insert new-user entry into my database
        # -- non-serial, non-default values are explicitly inserted
        # cursor.execute(
        #     """
        #         INSERT INTO users (role_id, user_id, user_name, password_hash, is_active_account, books_overdue, string_password_hash)
        #         VALUES ( 
        #             %s, %s, %s, %s, %s, %s, %s
        #         );
        #     """,
        #     (role_id, user_id, user_name, password_hash, 'TRUE' if role_id == 1 else 'FALSE', [], password_hash)       
        # )

        # Create NEW, UNIQUE user – all other attributes are defaultly initialized (no need to manually specify)
        cursor.execute( 
            """
                INSERT into users (user_name)
                VALUES (%s);
            """,
            (user_name,)
        )
        conn.commit()

        return jsonify({'message': 'Welcome Back!', 'user_name': user_name, "health": 100, "hunger": 0, "mood": 10}), 201  # Sign-Up-Creation-Success Success 

    except Exception as e:
        return jsonify({'error': str(e)}), 500