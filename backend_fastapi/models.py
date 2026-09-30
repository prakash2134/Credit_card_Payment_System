import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, Numeric, String
from sqlalchemy.dialects.mysql import CHAR

from database import Base


def utcnow():
    # Django stores naive UTC datetimes (USE_TZ=True) in MySQL.
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Card(Base):
    """Mirrors Django's cards_card table (read-only from this service)."""

    __tablename__ = "cards_card"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    last4 = Column(String(4))
    masked_number = Column(String(25))


class Transaction(Base):
    """Mirrors Django's transactions_transaction table."""

    __tablename__ = "transactions_transaction"

    id = Column(Integer, primary_key=True)
    reference_id = Column(CHAR(32), default=lambda: uuid.uuid4().hex, unique=True)
    user_id = Column(Integer, nullable=False)
    card_id = Column(Integer, nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(10), default="PENDING")
    failure_reason = Column(String(255), default="")
    # Django creates these columns with no DB-level default, so the
    # value must be supplied from Python on insert/update.
    created_at = Column(DateTime, default=utcnow, nullable=False)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow, nullable=False)