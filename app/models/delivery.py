import enum

from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Enum
)

from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class DeliveryStatus(str, enum.Enum):
    ASSIGNED = "ASSIGNED"
    PICKED_UP = "PICKED_UP"
    IN_TRANSIT = "IN_TRANSIT"
    DELIVERED = "DELIVERED"


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    driver_id = Column(
        Integer,
        ForeignKey("drivers.id"),
        nullable=False
    )

    current_status = Column(
        Enum(DeliveryStatus),
        default=DeliveryStatus.ASSIGNED
    )

    notes = Column(String(255))

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    delivered_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    order = relationship("Order")
    driver = relationship("Driver")