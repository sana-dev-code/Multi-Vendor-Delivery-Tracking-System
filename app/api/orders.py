from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.customer import Customer
from app.db.database import get_db
from app.schemas.order import OrderCreate, OrderResponse
from app.services.order_service import create_order
from app.core.dependencies import get_current_vendor, get_current_user
from app.models.user import User
from app.models.vendor import Vendor
from app.models.order import Order, OrderStatus
from app.models.delivery import Delivery
from app.schemas.order import (
    OrderCreate,
    OrderResponse
)

from app.services.order_service import create_order

from app.core.dependencies import (
    get_current_vendor
)

from app.models.user import User
from app.models.vendor import Vendor


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post(
    "",
    response_model=OrderResponse
)
def create_new_order(
    request: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_vendor)
):
    vendor = db.query(Vendor).filter(
        Vendor.user_id == current_user.id
    ).first()

    order = create_order(
        db=db,
        request=request,
        vendor_id=vendor.id
    )

    return order
@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role == "VENDOR":
        vendor = db.query(Vendor).filter(
            Vendor.user_id == current_user.id
        ).first()

        if not vendor:
            raise HTTPException(status_code=404, detail="Vendor profile not found")

        return db.query(Order).filter(
            Order.vendor_id == vendor.id
        ).all()

    if current_user.role == "CUSTOMER":
        customer = db.query(Customer).filter(
            Customer.user_id == current_user.id
        ).first()

        if not customer:
            raise HTTPException(status_code=404, detail="Customer profile not found")

        return db.query(Order).filter(
            Order.customer_id == customer.id
        ).all()

    raise HTTPException(status_code=403, detail="Access denied")
@router.get("/{order_id}/tracking")
def track_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    delivery = db.query(Delivery).filter(
        Delivery.order_id == order.id
    ).first()

    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "order_status": order.status,
        "delivery_status": (
            delivery.current_status if delivery else None
        )
    }
@router.patch("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_vendor)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.status == OrderStatus.DELIVERED:
        raise HTTPException(
            status_code=400,
            detail="Delivered order cannot be cancelled"
        )

    order.status = OrderStatus.CANCELLED

    db.commit()
    db.refresh(order)

    return order