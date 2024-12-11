

Admin Registration
curl -X POST http://localhost:3000/api/admin/koujinaAdminCreate/register -H "Content-Type: application/json" -d "{\"name\":\"Admin User\",\"email\":\"admin@example.com\",\"password\":\"securepassword\",\"role\":\"admin\"}"


Admin Login
curl -X POST http://localhost:3000/api/admin/koujinaAdminProfile/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"securepassword\"}"


Dashboard Metrics
curl -X GET http://localhost:3000/api/admin/dashboard -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Create User
curl -X POST http://localhost:3000/api/admin/user/create -H "Content-Type: application/json" -d "{\"name\":\"New User\",\"email\":\"newuser@example.com\",\"password\":\"newpassword\",\"role\":\"customer\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Delete User
curl -X DELETE http://localhost:3000/api/admin/user/delete/6732ac80be5802fc00e699e7 -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Downgrade User to Employee
curl -X PUT http://localhost:3000/api/admin/user/downgrade/USER_ID -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Promote User to Admin
curl -X PUT http://localhost:3000/api/admin/user/promote/USER_ID -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Activate User
curl -X PUT http://localhost:3000/api/admin/user/activate/6732ac80be5802fc00e699e7 -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Deactivate User
curl -X PUT http://localhost:3000/api/admin/user/deactivate/6732ac80be5802fc00e699e7 -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - List Users
curl -X GET http://localhost:3000/api/admin/user/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Bulk Activate Users
curl -X PUT http://localhost:3000/api/admin/users/bulk-activate -H "Content-Type: application/json" -d "{\"userIds\":[\"USER_ID_1\",\"USER_ID_2\"]}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Admin User Management - Bulk Deactivate Users
curl -X PUT http://localhost:3000/api/admin/users/bulk-deactivate -H "Content-Type: application/json" -d "{\"userIds\":[\"USER_ID_1\",\"USER_ID_2\"]}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Plate Management - Add Plate
curl -X POST http://localhost:3000/api/admin/plates/add -H "Content-Type: application/json" -d "{\"name\":\"New Plate\",\"price\":12.99,\"ingredients\":[\"ingredient1\",\"ingredient2\"]}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Plate Management - Update Plate
curl -X PUT http://localhost:3000/api/admin/plates/update/PLATE_ID -H "Content-Type: application/json" -d "{\"price\":14.99}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Plate Management - Delete Plate
curl -X DELETE http://localhost:3000/api/admin/plates/delete/PLATE_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Plate Management - List Plates
curl -X GET http://localhost:3000/api/admin/plates/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Management - Get All Orders
curl -X GET http://localhost:3000/api/admin/orders/all -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Management - Get Order Details
curl -X GET http://localhost:3000/api/admin/orders/details/ORDER_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Management - Update Order Status
curl -X PUT http://localhost:3000/api/admin/orders/update-status/ORDER_ID -H "Content-Type: application/json" -d "{\"status\":\"completed\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Management - Delete Order
curl -X DELETE http://localhost:3000/api/admin/orders/delete/ORDER_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Cooker Management - Add Cooker
curl -X POST http://localhost:3000/api/admin/cookers/add -H "Content-Type: application/json" -d "{\"name\":\"Cooker Name\",\"specialty\":\"Dish Specialty\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Cooker Management - Update Cooker
curl -X PUT http://localhost:3000/api/admin/cookers/update/COOKER_ID -H "Content-Type: application/json" -d "{\"specialty\":\"Updated Specialty\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Cooker Management - Delete Cooker
curl -X DELETE http://localhost:3000/api/admin/cookers/delete/COOKER_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Cooker Management - List Cookers
curl -X GET http://localhost:3000/api/admin/cookers/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Personnel Management - Add Delivery Person
curl -X POST http://localhost:3000/api/admin/delivery/add -H "Content-Type: application/json" -d "{\"name\":\"Delivery Person Name\",\"vehicle\":\"Vehicle Details\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Personnel Management - Update Delivery Person
curl -X PUT http://localhost:3000/api/admin/delivery/update/DELIVERY_ID -H "Content-Type: application/json" -d "{\"vehicle\":\"Updated Vehicle\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Personnel Management - Delete Delivery Person
curl -X DELETE http://localhost:3000/api/admin/delivery/delete/DELIVERY_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Personnel Management - List Delivery Personnel
curl -X GET http://localhost:3000/api/admin/delivery/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Supplement Management - Add Supplement
curl -X POST http://localhost:3000/api/admin/supplements/add -H "Content-Type: application/json" -d "{\"name\":\"Supplement Name\",\"quantity\":100,\"price\":5.99}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Supplement Management - Update Supplement
curl -X PUT http://localhost:3000/api/admin/supplements/update/SUPPLEMENT_ID -H "Content-Type: application/json" -d "{\"quantity\":150}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Supplement Management - Delete Supplement
curl -X DELETE http://localhost:3000/api/admin/supplements/delete/SUPPLEMENT_ID -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Supplement Management - List Supplements
curl -X GET http://localhost:3000/api/admin/supplements/list -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Notification Management - Get All Notifications
curl -X GET http://localhost:3000/api/admin/notifications/all -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Notification Management - Send Notification
curl -X POST http://localhost:3000/api/admin/notifications/send -H "Content-Type: application/json" -d "{\"message\":\"New Notification\"}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Notification Management - Bulk Send Notifications
curl -X POST http://localhost:3000/api/admin/notifications/bulk-send -H "Content-Type: application/json" -d "{\"notifications\":[{\"message\":\"Notification 1\"}, {\"message\":\"Notification 2\"}]}" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Metrics
curl -X GET http://localhost:3000/api/admin/metrics/orders -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Metrics
curl -X GET http://localhost:3000/api/admin/metrics/delivery -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Revenue Metrics
curl -X GET http://localhost:3000/api/admin/metrics/revenue -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


User Metrics
curl -X GET http://localhost:3000/api/admin/metrics/users -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Efficiency
curl -X GET http://localhost:3000/api/admin/metrics/delivery-efficiency -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Top Plates
curl -X GET http://localhost:3000/api/admin/analytics/top-plates -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Busiest Order Times
curl -X GET http://localhost:3000/api/admin/analytics/busiest-order-times -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Top Customers
curl -X GET http://localhost:3000/api/admin/analytics/top-customers -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Customer Lifetime Value
curl -X GET http://localhost:3000/api/admin/analytics/customer-lifetime-value -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Frequency per User
curl -X GET http://localhost:3000/api/admin/analytics/order-frequency -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Average Order Value
curl -X GET http://localhost:3000/api/admin/analytics/average-order-value -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Average Preparation Time
curl -X GET http://localhost:3000/api/admin/analytics/average-preparation-time -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Customer Retention Rate
curl -X GET http://localhost:3000/api/admin/analytics/customer-retention-rate -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Order Growth Rate
curl -X GET http://localhost:3000/api/admin/analytics/order-growth-rate -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Success Rate
curl -X GET http://localhost:3000/api/admin/analytics/delivery-success-rate -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Most Used Supplements
curl -X GET http://localhost:3000/api/admin/analytics/most-used-supplements -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Time Performance
curl -X GET http://localhost:3000/api/admin/analytics/delivery-time-performance -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Most Profitable Plates
curl -X GET http://localhost:3000/api/admin/analytics/most-profitable-plates -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Return Customers
curl -X GET http://localhost:3000/api/admin/analytics/return-customers -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Average Items per Order
curl -X GET http://localhost:3000/api/admin/analytics/average-items-per-order -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Low Inventory Supplements
curl -X GET http://localhost:3000/api/admin/analytics/low-inventory-supplements -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Cook Efficiency
curl -X GET http://localhost:3000/api/admin/analytics/cook-efficiency -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Delivery Heatmap
curl -X GET http://localhost:3000/api/admin/analytics/delivery-heatmap -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


System Logs
curl -X GET http://localhost:3000/api/admin/system-logs -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


User Activity Logs
curl -X GET http://localhost:3000/api/admin/user-activity-logs -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjczMmFiYjViZTU4MDJmYzAwZTY5OWRjIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMxMzc0MDExLCJleHAiOjE3MzEzNzc2MTF9.drh-oOe2sx74wW00NESlWhsBGz2FTbkOUWm_Ua8yh68"


Error Logs
curl -X GET http://localhost:3000/api/admin/error-logs -H "Authorization: Bearer YOUR_JWT_TOKE