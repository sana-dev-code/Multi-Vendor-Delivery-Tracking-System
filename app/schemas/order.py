from pydantic import BaseModel
from decimal import Decimal


class OrderCreate(BaseModel):
    customer_id: int
    total_amount: Decimal
    pickup_address: str
    delivery_address: str


class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_id: int
    vendor_id: int
    total_amount: Decimal
    pickup_address: str
    delivery_address: str
    status: str

    class Config:
        from_attributes = True