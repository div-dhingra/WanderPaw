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

# Module for hashing passwords
# import bcrypt

# So my frontend can make API-calls to my backend
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