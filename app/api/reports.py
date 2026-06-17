from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.database import get_db
from app.core.dependencies import get_current_admin
from app.models.order import Order, OrderStatus
from app.models.delivery import Delivery, DeliveryStatus
from app.models.vendor import Vendor
from app.models.driver import Driver
from app.models.customer import Customer


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/dashboard")
def dashboard_report(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    total_orders = db.query(Order).count()

    completed_orders = db.query(Order).filter(
        Order.status == OrderStatus.DELIVERED
    ).count()

    cancelled_orders = db.query(Order).filter(
        Order.status == OrderStatus.CANCELLED
    ).count()

    active_deliveries = db.query(Delivery).filter(
        Delivery.current_status != DeliveryStatus.DELIVERED
    ).count()

    completed_deliveries = db.query(Delivery).filter(
        Delivery.current_status == DeliveryStatus.DELIVERED
    ).count()

    total_vendors = db.query(Vendor).count()
    total_drivers = db.query(Driver).count()
    total_customers = db.query(Customer).count()

    return {
        "total_orders": total_orders,
        "completed_orders": completed_orders,
        "cancelled_orders": cancelled_orders,
        "active_deliveries": active_deliveries,
        "completed_deliveries": completed_deliveries,
        "total_vendors": total_vendors,
        "total_drivers": total_drivers,
        "total_customers": total_customers
    }


@router.get("/vendor-performance")
def vendor_performance(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = db.query(
        Vendor.id.label("vendor_id"),
        Vendor.company_name,
        func.count(Order.id).label("total_orders")
    ).join(
        Order,
        Order.vendor_id == Vendor.id
    ).group_by(
        Vendor.id,
        Vendor.company_name
    ).all()

    return [
        {
            "vendor_id": row.vendor_id,
            "company_name": row.company_name,
            "total_orders": row.total_orders
        }
        for row in result
    ]


@router.get("/driver-performance")
def driver_performance(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = db.query(
        Driver.id.label("driver_id"),
        Driver.vehicle_type,
        func.count(Delivery.id).label("total_deliveries")
    ).join(
        Delivery,
        Delivery.driver_id == Driver.id
    ).group_by(
        Driver.id,
        Driver.vehicle_type
    ).all()

    return [
        {
            "driver_id": row.driver_id,
            "vehicle_type": row.vehicle_type,
            "total_deliveries": row.total_deliveries
        }
        for row in result
    ]