import MySQLdb
db = MySQLdb.connect("localhost", "administrator", "password", "benny")
curs = db.cursor()

def log_data(data, sensorName, units):
    curs.execute("""INSERT INTO datalog4 values(CURRENT_TIMESTAMP, %s, %s, %s)""", (sensorName, data, units))
    db.commit()

