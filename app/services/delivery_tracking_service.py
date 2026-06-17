from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.delivery import Delivery, DeliveryStatus
from app.models.order import Order, OrderStatus
from app.models.driver import Driver
from app.models.delivery_history import DeliveryHistory


VALID_TRANSITIONS = {
    "ASSIGNED": ["PICKED_UP"],
    "PICKED_UP": ["IN_TRANSIT"],
    "IN_TRANSIT": ["DELIVERED"]
}


def update_delivery_status(
    db: Session,
    delivery_id: int,
    new_status: str,
    notes: str | None = None
):
    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery not found"
        )

    current_status = delivery.current_status.value
    allowed_statuses = VALID_TRANSITIONS.get(current_status, [])

    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {current_status} to {new_status}"
        )

    history = DeliveryHistory(
        delivery_id=delivery.id,
        old_status=current_status,
        new_status=new_status,
        updated_by="DRIVER"
    )

    delivery.current_status = DeliveryStatus(new_status)

    order = db.query(Order).filter(
        Order.id == delivery.order_id
    ).first()

    if new_status == "PICKED_UP":
        order.status = OrderStatus.PICKED_UP

    elif new_status == "IN_TRANSIT":
        order.status = OrderStatus.IN_TRANSIT

    elif new_status == "DELIVERED":
        order.status = OrderStatus.DELIVERED
        delivery.delivered_at = datetime.now(timezone.utc)

        driver = db.query(Driver).filter(
            Driver.id == delivery.driver_id
        ).first()

        if driver:
            driver.is_available = True
            driver.current_status = "AVAILABLE"

    db.add(history)
    db.commit()
    db.refresh(delivery)

    return delivery