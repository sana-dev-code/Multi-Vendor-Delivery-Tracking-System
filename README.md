# API Usage Examples

## Register User

POST /auth/register

Request

{
"full_name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456",
"role": "CUSTOMER"
}

Response

{
"id": 1,
"full_name": "John Doe",
"email": "[john@example.com](mailto:john@example.com)",
"role": "CUSTOMER",
"is_active": true
}

---

## Login

POST /auth/login

Request

{
"email": "[john@example.com](mailto:john@example.com)",
"password": "123456"
}

Response

{
"access_token": "jwt_token_here",
"token_type": "bearer"
}

---

## Create Order

POST /orders

Authorization: Bearer Token Required

{
"customer_name": "Ali",
"pickup_address": "Multan",
"delivery_address": "Lahore",
"total_amount": 2500
}

---

## Auto Assign Driver

POST /deliveries/auto-assign

Authorization: Admin

{
"order_id": 1
}

---

## Update Delivery Status

PUT /deliveries/{delivery_id}/status

{
"status": "IN_TRANSIT",
"notes": "Package picked up"
}

---

## Dashboard Report

GET /reports/dashboard

Response

{
"total_orders": 20,
"active_deliveries": 5,
"completed_deliveries": 10,
"cancelled_deliveries": 2
}
