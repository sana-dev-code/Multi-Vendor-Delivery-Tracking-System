from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.core.dependencies import get_current_admin
from app.models.vendor import Vendor
from app.core.dependencies import get_current_admin, get_current_user

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"]
)


@router.patch("/{vendor_id}/suspend")
def suspend_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    vendor.status = "SUSPENDED"

    db.commit()
    db.refresh(vendor)

    return {
        "message": "Vendor suspended successfully",
        "vendor_id": vendor.id,
        "status": vendor.status
    }
@router.get("/me")
def get_my_vendor_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    vendor = db.query(Vendor).filter(Vendor.user_id == current_user.id).first()

    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor profile not found")

    return vendor