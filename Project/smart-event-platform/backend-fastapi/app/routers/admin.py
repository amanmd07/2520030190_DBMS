from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():
    return {"message": "Admin dashboard endpoint placeholder"}

@router.get("/users")
def get_admin_users():
    return {"message": "Admin users endpoint placeholder"}

@router.get("/reports")
def get_reports():
    return {"message": "Admin reports endpoint placeholder"}

@router.get("/revenue")
def get_revenue():
    return {"message": "Admin revenue endpoint placeholder"}