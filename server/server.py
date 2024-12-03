# NOTE: INCREMENTAL COMMITS: Code out entire thing, then delete portions to build up incremental commits (doing so AFTER I'm already done with the entire thing :)

# Import regex module for backend input-validation from request-headers (for non-frontend-called (i.e. frontend validation won't be present then), 
# intercepted/'direct' API-requests)
import re
import json # Module to read JSON objects, and convert them to usable JS-objects
import requests # To match fetch-requests to some API with Python :)

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

connection_string = f"""gssencmode=disable user={os.getenv("SUPABASE_USER")} password={os.getenv("SUPABASE_PASSWORD")} 
                        host={os.getenv("SUPABASE_HOST")} port={os.getenv("SUPABASE_PORT")} 
                        dbname={os.getenv("SUPABASE_DB_NAME")}"""

conn = psycopg2.connect(connection_string)
cursor = conn.cursor()

# Users (non-serial attributes): UNIQUE username | is_activated_account | books_checked_out | books_overdue |
# password_hash BYTEA NOT NULL, -- password for the user (hashed for security) [bytea-format]
# Dummy to single user for now (just update / read from this user's specific endpoint [check discord for api-endpoitns])
CREATE_USERS_TABLE = (
    """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, -- Unique user identifier for the table (hence SERIAL | unrelated to input)
            user_name TEXT NOT NULL UNIQUE, -- username
            pet_health INT NOT NULL DEFAULT 100, -- pet's current health level | 0 - 100
            pet_hunger INT NOT NULL DEFAULT 0, -- pet's current hunger level | 0 - 10
            pet_mood INT NOT NULL DEFAULT 10 -- pet's current mood level | 0 - 10
            creation_time DATETIME DEFAULT NOW() -- time account was created
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

        # returns tuple of values
        pet_health = cursor.fetchone()[0] 
        pet_hunger = cursor.fetchone()[1]
        pet_mood = cursor.fetchone()[2]

        # '%s' parameterized query (psycopg2) to prevent SQL-string-injections attacks (i.e. sanitized via ` '/ ` escape before execution)
        return jsonify({"petDetails": {"Health": pet_health, "Hunger": pet_hunger, "Mood": pet_mood}}), 200
    
    except Exception as e: # Handle database errors
        return jsonify({"error": str(e)}), 500       




