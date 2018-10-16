from gpiozero import CPUTemperature
from time import sleep, strftime, time

import MySQLdb
db = MySQLdb.connect("localhost", "administrator", "password", "benny")
curs = db.cursor()

def log_data(data, sensorName, units):
    curs.execute("""INSERT INTO datalog4 values(CURRENT_TIMESTAMP, %s, %s, %s)""", (sensorName, data, units))
    db.commit()

cpu = CPUTemperature()

while True:
    temp = cpu.temperature
    log_data(temp, "cpu_temperature", "degC")
    sleep(1)
