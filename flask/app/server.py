#!/usr/bin/env python
import os
from os.path import join, dirname
from flask import Flask, render_template, redirect, url_for, request
#best use mysql-connector-python for mysql 8.0
import mysql.connector 


app = Flask(__name__)

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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get("FLASK_SERVER_PORT", 9090), debug=True)

