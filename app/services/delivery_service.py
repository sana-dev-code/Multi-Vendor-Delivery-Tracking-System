from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.delivery import Delivery, DeliveryStatus
from app.models.order import Order, OrderStatus
from app.models.driver import Driver


def assign_driver_to_order(db: Session, order_id: int, driver_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be assigned"
        )

    driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )

    if not driver.is_available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Driver is not available"
        )

    delivery = Delivery(
        order_id=order.id,
        driver_id=driver.id,
        current_status=DeliveryStatus.ASSIGNED
    )

    order.status = OrderStatus.ASSIGNED
    driver.is_available = False
    driver.current_status = "BUSY"

    db.add(delivery)
    db.commit()
    db.refresh(delivery)

    return delivery
def auto_assign_driver_to_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending orders can be assigned"
        )

    driver = db.query(Driver).filter(
        Driver.is_available == True
    ).first()

    if not driver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No available driver found"
        )

    return assign_driver_to_order(
        db=db,
        order_id=order_id,
        driver_id=driver.id
    )