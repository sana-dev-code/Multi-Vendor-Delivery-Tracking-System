from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.core.dependencies import get_current_admin, get_current_driver
from app.models.user import User
from app.models.driver import Driver
from app.models.delivery import Delivery
from app.schemas.delivery import DeliveryAssignRequest, DeliveryResponse
from app.schemas.delivery_tracking import DeliveryStatusUpdate
from app.services.delivery_service import assign_driver_to_order
from app.services.delivery_tracking_service import update_delivery_status
from app.models.delivery_history import DeliveryHistory
from app.schemas.delivery import DeliveryAssignRequest, DeliveryResponse, AutoAssignRequest
from app.services.delivery_service import assign_driver_to_order, auto_assign_driver_to_order
from app.models.order import Order
router = APIRouter(
    prefix="/deliveries",
    tags=["Deliveries"]
)


@router.post("/assign", response_model=DeliveryResponse)
def assign_delivery(
    request: DeliveryAssignRequest,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return assign_driver_to_order(
        db=db,
        order_id=request.order_id,
        driver_id=request.driver_id
    )
@router.put("/{delivery_id}/status")
def update_status(
    delivery_id: int,
    request: DeliveryStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_driver)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    delivery = db.query(Delivery).filter(
        Delivery.id == delivery_id,
        Delivery.driver_id == driver.id
    ).first()

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not assigned to you"
        )

    return update_delivery_status(
        db=db,
        delivery_id=delivery_id,
        new_status=request.status,
        notes=request.notes
    )
@router.get("/{delivery_id}/history")
def get_delivery_history(
    delivery_id: int,
    db: Session = Depends(get_db)
):
    history = db.query(DeliveryHistory).filter(
        DeliveryHistory.delivery_id == delivery_id
    ).order_by(
        DeliveryHistory.created_at.asc()
    ).all()

    return history
@router.get("/my-deliveries")
def my_deliveries(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_driver)
):
    driver = db.query(Driver).filter(
        Driver.user_id == current_user.id
    ).first()

    if not driver:
        raise HTTPException(status_code=404, detail="Driver profile not found")

    deliveries = db.query(Delivery).filter(
        Delivery.driver_id == driver.id
    ).all()

    result = []

    for delivery in deliveries:
        order = db.query(Order).filter(
            Order.id == delivery.order_id
        ).first()

        result.append({
            "id": delivery.id,
            "order_id": delivery.order_id,
            "driver_id": delivery.driver_id,
            "status": delivery.current_status,
            "current_status": delivery.current_status,
            "notes": delivery.notes,
            "assigned_at": delivery.assigned_at,
            "delivered_at": delivery.delivered_at,

            "pickup_address": order.pickup_address if order else None,
            "delivery_address": order.delivery_address if order else None,
            "total_amount": order.total_amount if order else None,
            "customer_id": order.customer_id if order else None,
            "vendor_id": order.vendor_id if order else None,
        })

    return result

@router.post("/auto-assign", response_model=DeliveryResponse)
def auto_assign_delivery(
    request: AutoAssignRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "VENDOR"]:
        raise HTTPException(
            status_code=403,
            detail="Only admin or vendor can assign deliveries"
        )

    return auto_assign_driver_to_order(
        db=db,
        order_id=request.order_id
    )