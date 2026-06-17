from pydantic import BaseModel


class VendorCreate(BaseModel):
    company_name: str
    phone: str
    address: str
    user_id: int