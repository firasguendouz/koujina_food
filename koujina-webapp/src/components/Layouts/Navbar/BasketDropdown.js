// BasketDropdown.js

import "./Basket.css";

import { FiShoppingCart, FiX } from "react-icons/fi";

import Basket from "./Basket";
import React from "react";

function BasketDropdown({ showDropdown, toggleDropdown, basketItems, onQuantityChange, onCheckout }) {
  return (
    <div className="navbar-basket">
      {/* Shopping cart icon to toggle dropdown */}
      <button
        className="basket-icon"
        onClick={toggleDropdown}
        aria-expanded={showDropdown}
        aria-label="View basket"
      >
        <FiShoppingCart />
      </button>

      {/* Dropdown menu for basket */}
      {showDropdown && (
        <div className="basket-dropdown" role="menu">
          {/* Close button in the upper left corner */}
          <button
            className="close-basket-button"
            onClick={toggleDropdown}
            aria-label="Close basket"
          >
            <FiX />
          </button>

          {/* Render the Basket component with passed items and quantity handler */}
          <Basket items={basketItems} onQuantityChange={onQuantityChange} />

         
        </div>
      )}
    </div>
  );
}

export default BasketDropdown;
