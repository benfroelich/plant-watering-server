import MySQLdb, os, sys

if os.environ["PLANT_WATERING_ENVIRONMENT"] != "development":
    sys.exit("error, must use development configuration")

db = MySQLdb.connect( \
        os.environ["PLANT_WATERING_DB_HOST"], \
        os.environ["PLANT_WATERING_DB_USER"], \
        os.environ["PLANT_WATERING_DB_PW"], \
        os.environ["PLANT_WATERING_DB"])
curs = db.cursor()

# wipe out existing data
curs.execute("TRUNCATE TABLE {}".format(os.environ["PLANT_WATERING_DB_TABLE"]))

sqlstring = "INSERT INTO {} (time, id, measurement, units)".format(os.environ["PLANT_WATERING_DB_TABLE"]) + " VALUES(%s, %s, %s, %s)"
curs.executemany(sqlstring,
    [
    ("2018-10-16 20:00:37", "fern_moisture", 423, "counts"),    
    ("2018-10-16 20:15:37", "fern_moisture", 428, "counts"),    
    ("2018-10-16 20:15:37", "fern_watered",  50,  "mL"),    
    ("2018-10-16 20:15:37", "fern_watered",  50,  "mL"),    
    ("2018-10-18 20:15:37", "fern_watered",  50,  "mL"),    
    ("2018-10-20 20:15:37", "fern_watered",  50,  "mL"),    
    ("2018-10-16 20:30:37", "fern_moisture", 653, "counts"),    
    ("2018-10-16 20:45:37", "fern_moisture", 650, "counts"),   
    ("2018-10-16 20:00:36", "cactus_moisture", 123, "counts"), 
    ("2018-10-16 20:15:36", "cactus_moisture", 128, "counts"),   
    ("2018-10-16 20:30:36", "cactus_moisture", 113, "counts"),   
    ("2018-10-16 20:45:36", "cactus_moisture", 119, "counts") 
    ]
)
db.commit()

