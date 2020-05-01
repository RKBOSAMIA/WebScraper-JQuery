from flask import Flask,render_template
import json
from datetime import date
import sqlite3

app = Flask(__name__)

with open('../ScrapedData.json') as f:
    data = json.load(f)

conn = sqlite3.connect('CoronaCases.db',check_same_thread=False)
print('Connection Established')
c = conn.cursor()

@app.route('/',methods=['GET','POST'])
def CoronaCases():

    c.execute('DROP TABLE IF EXISTS Corona_Cases')
    print('Old Table Dropped')

    create_table = """CREATE TABLE IF NOT EXISTS Corona_Cases(date text,region text,cases text,deaths text,recovered text)"""
    c.execute(create_table)
    print("New Table Created")

    for d in data:
        today = str(date.today())
        region = d['Region']
        cases = d['Cases']
        deaths = d['Deaths']
        recovered = d['Recovered']
        c.execute("INSERT INTO Corona_Cases (date,region,cases,deaths,recovered) VALUES (?,?,?,?,?)",
        (today,region,cases,deaths,recovered))
    print("Data Inserted")

    conn.row_factory = sqlite3.Row
    c.execute("select * from Corona_Cases")
    columns = [column[0]for column in c.description]
    result = []
    for row in c.fetchall():
        result.append(dict(zip(columns,row)))  
    return render_template('index.html',result=result)

if __name__ == "__main__":
    app.run()

