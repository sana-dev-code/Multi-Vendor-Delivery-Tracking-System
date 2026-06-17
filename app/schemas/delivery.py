from pydantic import BaseModel


class DeliveryAssignRequest(BaseModel):
    order_id: int
    driver_id: int


class DeliveryResponse(BaseModel):
    id: int
    order_id: int
    driver_id: int
    current_status: str
    notes: str | None = None

    class Config:
        from_attributes = True
class AutoAssignRequest(BaseModel):
    order_id: int