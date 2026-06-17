from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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