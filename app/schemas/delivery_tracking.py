from pydantic import BaseModel


class DeliveryStatusUpdate(BaseModel):
    status: str
    notes: str | None = None