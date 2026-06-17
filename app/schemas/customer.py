from pydantic import BaseModel


class CustomerProfileCreate(BaseModel):
    phone: str
    address: str


class CustomerProfileResponse(BaseModel):
    id: int
    user_id: int
    phone: str
    address: str

    class Config:
        from_attributes = True