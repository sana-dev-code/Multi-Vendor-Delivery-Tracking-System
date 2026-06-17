import enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.models.vendor import Vendor
from app.models.customer import Customer
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Numeric,
    Enum
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    ASSIGNED = "ASSIGNED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id"),
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    order_number = Column(
        String(100),
        unique=True,
        nullable=False
    )

    total_amount = Column(
        Numeric(10, 2),
        default=0
    )

    pickup_address = Column(String(255))
    delivery_address = Column(String(255))

    status = Column(
        Enum(OrderStatus),
        default=OrderStatus.PENDING
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    vendor = relationship("Vendor")
    customer = relationship("Customer")