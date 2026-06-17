from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from sqlalchemy.sql import func

from app.db.database import Base


class DeliveryHistory(Base):
    __tablename__ = "delivery_status_history"

    id = Column(Integer, primary_key=True, index=True)

    delivery_id = Column(
        Integer,
        ForeignKey("deliveries.id"),
        nullable=False
    )

    old_status = Column(String(50))

    new_status = Column(
        String(50),
        nullable=False
    )

    updated_by = Column(String(100))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )