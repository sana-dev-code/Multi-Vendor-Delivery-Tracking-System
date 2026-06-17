from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.vendor import Vendor
from app.models.driver import Driver
from app.schemas.vendor import VendorCreate
from app.schemas.driver import DriverCreate
from app.models.order import Order

from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.post("/vendors")
def create_vendor(
    request: VendorCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendor = Vendor(**request.model_dump())

    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    return vendor
@router.get("/vendors")
def get_vendors(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendors = db.query(Vendor).all()
    return vendors
@router.get("/vendors/{vendor_id}")
def get_vendor(vendor_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return db.query(Vendor).filter(Vendor.id == vendor_id).first()


@router.put("/vendors/{vendor_id}")
def update_vendor(vendor_id: int, request: VendorCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    vendor.company_name = request.company_name
    vendor.phone = request.phone
    vendor.address = request.address
    vendor.status = request.status

    db.commit()
    db.refresh(vendor)
    return vendor


@router.delete("/vendors/{vendor_id}")
def delete_vendor(vendor_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted"}

@router.post("/drivers")
def create_driver(
    request: DriverCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = Driver(**request.model_dump())

    db.add(driver)
    db.commit()
    db.refresh(driver)

    return driver
@router.get("/drivers")
def get_drivers(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Driver).all()
@router.get("/drivers/{driver_id}")
def get_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Driver).filter(
        Driver.id == driver_id
    ).first()
@router.put("/drivers/{driver_id}")
def update_driver(
    driver_id: int,
    request: DriverCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    driver.user_id = request.user_id
    driver.license_number = request.license_number
    driver.vehicle_type = request.vehicle_type

    db.commit()
    db.refresh(driver)

    return driver
@router.delete("/drivers/{driver_id}")
def suspend_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = db.query(Driver).filter(
        Driver.id == driver_id
    ).first()

    driver.current_status = "SUSPENDED"

    db.commit()

    return {
        "message": "Driver suspended"
    }
@router.get("/orders")
def get_all_orders(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Order).all()