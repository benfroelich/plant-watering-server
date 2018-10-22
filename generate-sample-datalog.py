from gpiozero import CPUTemperature
from logData import log_data
from time import sleep

cpu = CPUTemperature()

while True:
    temp = cpu.temperature
    log_data(temp, "cpu_temperature", "degC")
    sleep(1)
