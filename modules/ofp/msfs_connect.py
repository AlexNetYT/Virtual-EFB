from SimConnect import *
# Create SimConnect link
from time import sleep
def get_location():
        sm = SimConnect()
        aq = AircraftRequests(sm, _time=2000)
        LATITUDE = aq.get("PLANE_LATITUDE")
        LONGITUDE = aq.get("PLANE_LONGITUDE")
        HEADING = aq.get("PLANE_HEADING_DEGREES_GYRO")
        sm.exit()

        return {
            "lat": LATITUDE,
            "long": LONGITUDE,
            "hdg": HEADING
        }