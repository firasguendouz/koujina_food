// src/context/BasketContext.js

import React, { createContext, useContext, useState } from 'react';

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const addToBasket = (plate) => {
        setItems((prevItems) => {
            // Check if an item with the same id and unique attributes already exists
            const existingItem = prevItems.find(
                (item) => item.id === plate.id && item.name === plate.name
            );
    
            if (existingItem) {
                // Update quantity if the exact item already exists
                return prevItems.map((item) =>
                    item.id === plate.id && item.name === plate.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // Add as new item if not found
            return [...prevItems, { ...plate, quantity: 1 }];
        });
    };
    
    const updateQuantity = (id, change) => {
        setItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + change } : item
                )
                .filter((item) => item.quantity > 0) // Remove items with zero quantity
        );
    };

    const removeItem = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearBasket = () => {
        setItems([]);
    };

    const totalCount = items.reduce((count, item) => count + item.quantity, 0);

    return (
        <BasketContext.Provider
            value={{ items, addToBasket, updateQuantity, removeItem, clearBasket, totalCount }}
        >
            {children}
        </BasketContext.Provider>
    );
};
