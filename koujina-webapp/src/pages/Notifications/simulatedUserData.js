// simulatedUserData.js

export const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    contactNumber: "123-456-7890",
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "Anystate",
        postalCode: "12345",
        country: "Countryland"
    },
    role: "customer",
    status: "active",
    loyaltyPoints: 150,
    lastLogin: new Date("2023-11-01"),
    accountCreated: new Date("2021-05-15"),
    orderHistory: [
        {
            orderId: "1",
            date: new Date("2023-09-20"),
            totalAmount: 45.99
        },
        {
            orderId: "2",
            date: new Date("2023-07-11"),
            totalAmount: 24.50
        }
    ],
    notifications: [
        {
            message: "Your recent order has been shipped!",
            seen: false,
            date: new Date("2023-09-21")
        },
        {
            message: "Your loyalty points have been updated.",
            seen: true,
            date: new Date("2023-08-05")
        }
    ]
};
