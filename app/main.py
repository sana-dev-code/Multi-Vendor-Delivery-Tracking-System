from fastapi import FastAPI
import app.models
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.orders import router as orders_router
from app.api.customers import router as customers_router
from app.api.deliveries import router as deliveries_router
from app.api.reports import router as reports_router
from app.api.vendors import router as vendors_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app = FastAPI(
    title="Multi-Vendor Delivery Tracking System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Multi-Vendor Delivery Tracking API is running"
    }


app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(orders_router)
app.include_router(customers_router)
app.include_router(deliveries_router)
app.include_router(reports_router)
app.include_router(vendors_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)