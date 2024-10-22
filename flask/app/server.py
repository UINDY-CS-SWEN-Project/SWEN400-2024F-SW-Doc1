#!/usr/bin/env python
import os
from os.path import join, dirname
from flask import Flask, render_template, redirect, url_for, request, jsonify
#best use mysql-connector-python for mysql 8.0
import mysql.connector 
from flask_cors import CORS


app = Flask(__name__)

CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        user='root',
        password='root123!',
        host='db',
        database='my_test_db'
    )

@app.route('/')
def hello():
    return "Flask - Hello World!!"

@app.route('/ex', methods=['POST', 'GET'])
def ex():
    user = ""
    if request.method == 'POST':
        if 'nm' in request.form:
            user = request.form('nm')
        return "Flask parameter: " + user
    else:
        if 'nm' in request.args:
            user = request.args.get('nm')
        return "Flask parameter: " + user
    
@app.route('/db', methods=['POST', 'GET'])
def db():
    cnx = mysql.connector.connect(user='root', password='root123!',
                              host='db',
                              database='my_test_db')
    db_str = ""
    if cnx and cnx.is_connected():
        with cnx.cursor() as cursor:
            result = cursor.execute("SELECT * from test_data")
            rows = cursor.fetchall()
            for rows in rows:
                print(rows)
                db_str = db_str + " NAME: " + rows[0] + "TITLE: " + rows[1]
        cnx.close()
    else:
        return "Cannot connect"
    return "Good MySQL connections!!! " + db_str

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    cnx = mysql.connector.connect(user='root', password='root123!',
                                  host='db',
                                  database='my_test_db')
    if cnx and cnx.is_connected():
        with cnx.cursor() as cursor:
            cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
            result = cursor.fetchone()
            if result and result[0] == password:
                return jsonify(success=True)
            else:
                return jsonify(success=False)
        cnx.close()
    else:
        return jsonify(success=False, error="Cannot connect to database")

@app.route('/documents', methods=['GET'])
def search_documents():
    search_query = request.args.get('q', '')  # Get the search query from the React frontend
    cnx = get_db_connection()
    db_str = []

    if cnx and cnx.is_connected():
        with cnx.cursor() as cursor:
            # Use a wildcard search for document name
            query = "SELECT name FROM documents WHERE name LIKE %s"
            cursor.execute(query, ('%' + search_query + '%',))
            rows = cursor.fetchall()
            db_str = [row[0] for row in rows]  # Collect all document names
        cnx.close()
    
    return jsonify(documents=db_str)  # Return the search results as JSON


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 8080), debug=True)

