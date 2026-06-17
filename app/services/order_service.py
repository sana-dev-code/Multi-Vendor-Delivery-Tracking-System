from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.order import Order
from app.schemas.order import OrderCreate


def create_order(
    db: Session,
    request: OrderCreate,
    vendor_id: int
):
    order = Order(
        customer_id=request.customer_id,
        vendor_id=vendor_id,
        total_amount=request.total_amount,
        pickup_address=request.pickup_address,
        delivery_address=request.delivery_address,
        order_number=f"ORD-{uuid4().hex[:8].upper()}"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order