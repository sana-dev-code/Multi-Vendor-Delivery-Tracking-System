from fastapi import APIRouter, Depends, HTTPException, status
import re
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.customer import Customer
from app.schemas.customer import CustomerProfileCreate, CustomerProfileResponse
from app.core.dependencies import get_current_customer


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


@router.post("/profile", response_model=CustomerProfileResponse)
def create_customer_profile(
    request: CustomerProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    if not re.fullmatch(r"03\d{9}", request.phone):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number must be exactly 11 digits and start with 03, e.g. 03001234567"
        )

    existing_profile = db.query(Customer).filter(
        Customer.user_id == current_user.id
    ).first()

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer profile already exists"
        )

    customer = Customer(
        user_id=current_user.id,
        phone=request.phone,
        address=request.address
    )

    db.add(customer)
    db.commit()
    db.refresh(customer)

    return customer


@router.get("/me", response_model=CustomerProfileResponse)
def get_my_customer_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer)
):
    customer = db.query(Customer).filter(
        Customer.user_id == current_user.id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer profile not found"
        )

    return customer
@router.get("")
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["ADMIN", "VENDOR"]:
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Customer).all()