from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
import re
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.vendor import Vendor
from app.models.driver import Driver
from app.models.user import User
from app.schemas.vendor import VendorCreate
from app.schemas.driver import DriverCreate
from app.models.order import Order
from app.core.dependencies import get_current_admin
from app.core.security import hash_password
from app.services.auth_service import validate_strong_password


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


class AdminVendorCreate(BaseModel):
    full_name: str
    email: str
    password: str
    company_name: str
    phone: str | None = None
    address: str | None = None
    status: str = "ACTIVE"


class AdminDriverCreate(BaseModel):
    full_name: str
    email: str
    password: str
    license_number: str
    vehicle_type: str
    status: str = "AVAILABLE"


def set_user_password(user: User, plain_password: str):
    hashed = hash_password(plain_password)

    if hasattr(user, "password"):
        user.password = hashed
    elif hasattr(user, "hashed_password"):
        user.hashed_password = hashed
    elif hasattr(user, "password_hash"):
        user.password_hash = hashed
    else:
        raise HTTPException(status_code=500, detail="Password field not found in User model")


def validate_phone_number(phone: str | None):
    if not phone or not re.fullmatch(r"03\d{9}", phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number must be exactly 11 digits and start with 03, e.g. 03001234567"
        )


def validate_person_name(name: str, field_name: str = "Name"):
    if not re.fullmatch(r"[A-Za-z ]{3,50}", name.strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{field_name} must contain only alphabets and spaces, 3-50 characters"
        )


def validate_license_number(license_number: str):
    if not re.fullmatch(r"[A-Za-z0-9-]{4,20}", license_number):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="License number must be 4-20 characters and only letters, numbers or hyphen"
        )


def create_user_account(db: Session, full_name: str, email: str, password: str, role: str):
    validate_strong_password(password)

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(full_name=full_name, email=email, role=role)
    set_user_password(user, password)

    db.add(user)
    db.flush()

    return user

@router.post("/vendors")
def create_vendor(
    request: AdminVendorCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    validate_person_name(request.full_name, "Vendor full name")
    validate_phone_number(request.phone)

    if not request.company_name.strip():
        raise HTTPException(status_code=400, detail="Company name is required")

    if not request.address.strip():
        raise HTTPException(status_code=400, detail="Address is required")

    user = create_user_account(
        db=db,
        full_name=request.full_name,
        email=request.email,
        password=request.password,
        role="VENDOR"
    )

    vendor = Vendor(
        user_id=user.id,
        company_name=request.company_name,
        phone=request.phone,
        address=request.address,
        status=request.status
    )

    db.add(vendor)
    db.commit()
    db.refresh(vendor)

    return {
        "message": "Vendor account created successfully",
        "user_id": user.id,
        "vendor_id": vendor.id,
        "company_name": vendor.company_name,
        "email": user.email,
        "status": vendor.status
    }
@router.get("/vendors")
def get_vendors(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Vendor).all()


@router.get("/vendors/{vendor_id}")
def get_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor


@router.put("/vendors/{vendor_id}")
def update_vendor(
    vendor_id: int,
    request: VendorCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    validate_phone_number(request.phone)

    vendor.company_name = request.company_name
    vendor.phone = request.phone
    vendor.address = request.address
    vendor.status = request.status

    db.commit()
    db.refresh(vendor)
    return vendor


@router.delete("/vendors/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted"}


@router.post("/drivers")
def create_driver(
    request: AdminDriverCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    user = create_user_account(
        db=db,
        full_name=request.full_name,
        email=request.email,
        password=request.password,
        role="DRIVER"
    )

    driver = Driver(
        user_id=user.id,
        license_number=request.license_number,
        vehicle_type=request.vehicle_type,
        current_status=request.status
    )

    db.add(driver)
    db.commit()
    db.refresh(driver)

    return {
        "message": "Driver account created successfully",
        "user_id": user.id,
        "driver_id": driver.id,
        "email": user.email,
        "status": driver.current_status
    }


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
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver


@router.put("/drivers/{driver_id}")
def update_driver(
    driver_id: int,
    request: DriverCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    validate_license_number(request.license_number)

    driver.user_id = request.user_id
    driver.license_number = request.license_number
    driver.vehicle_type = request.vehicle_type

    db.commit()
    db.refresh(driver)

    return driver


@router.patch("/drivers/{driver_id}/suspend")
def suspend_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    driver.current_status = "SUSPENDED"

    db.commit()
    db.refresh(driver)

    return {
        "message": "Driver suspended",
        "driver_id": driver.id,
        "status": driver.current_status
    }


@router.delete("/drivers/{driver_id}")
def delete_driver(
    driver_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    db.delete(driver)
    db.commit()

    return {"message": "Driver deleted"}


@router.get("/orders")
def get_all_orders(
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    return db.query(Order).all()
