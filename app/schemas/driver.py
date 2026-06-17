from pydantic import BaseModel


class DriverCreate(BaseModel):
    license_number: str
    vehicle_type: str
    user_id: int