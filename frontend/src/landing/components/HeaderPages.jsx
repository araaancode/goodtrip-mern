import React, { useState } from 'react';
import { RiTentLine, RiMenuLine, RiCloseLine, RiHome5Line, RiBusLine, RiRestaurantLine, RiShoppingCartLine } from "@remixicon/react";
import { SlUser } from "react-icons/sl";
import { Link } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";

const HeaderPages = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Logo - Hidden on mobile */}
          <div className="logo">
            <Link to="/">
              <RiTentLine className="logo-icon text-blue-900" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <Link to="/booking-house" className="nav-link">
              رزرو اقامتگاه
            </Link>
            <Link to="/booking-bus" className="nav-link">
              رزرو اتوبوس
            </Link>
            <Link to="/order-food" className="nav-link">
              سفارش غذا
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="منو"
          >
            {isMenuOpen ? <RiCloseLine /> : <RiMenuLine />}
          </button>

          {/* Icons - Only user icon visible on mobile */}
          <div className="header-icons">
            {/* Shopping Cart Icon - Hidden on mobile */}
            <Link to="/cart" className="cart-icon">
              <CiShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* User Icon */}
            <Link to="/profile" className="user-icon">
              <div className="user-container">
                <SlUser className="user-avatar" />
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className={`mobile-nav ${isMenuOpen ? 'mobile-nav-open' : ''}`}>
          <Link 
            to="/booking-house" 
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            رزرو اقامتگاه
          </Link>
          <Link 
            to="/booking-bus" 
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            رزرو اتوبوس
          </Link>
          <Link 
            to="/order-food" 
            className="mobile-nav-link"
            onClick={() => setIsMenuOpen(false)}
          >
            سفارش غذا
          </Link>
          <Link 
            to="/cart" 
            className="mobile-nav-link cart-link"
            onClick={() => setIsMenuOpen(false)}
          >
            سبد خرید
            {cartCount > 0 && <span className="mobile-cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </header>
      <div className="header-divider"></div>

      <style jsx>{`
        .header {
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .logo {
          display: flex;
          align-items: center;
        }
        
        .logo a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        
        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
        }
        
        .logo-text {
          font-weight: bold;
          margin-left: 0.75rem;
          font-size: 1.25rem;
          color: #1e293b;
        }
        
        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          gap: 2rem;
        }
        
        .nav-link {
          font-weight: bold;
          position: relative;
          color: #374151;
          text-decoration: none;
          transition: color 0.3s;
          padding: 0.5rem 0;
        }
        
        .nav-link:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          transform: translateY(0.3rem);
          width: 0;
          height: 2px;
          background-color: #4f46e5;
          transition: width 0.3s;
        }
        
        .nav-link:hover {
          color: #4f46e5;
        }
        
        .nav-link:hover:after {
          width: 100%;
        }
        
        /* Mobile Menu Button */
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #374151;
          padding: 0.5rem;
          z-index: 1001;
        }
        
        /* Header Icons */
        .header-icons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .cart-icon {
          position: relative;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          color: #374151;
          font-size: 2rem;
          transition: color 0.3s;
          text-decoration: none;
        }
        
        .cart-icon:hover {
          color: #4f46e5;
        }
        
        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ef4444;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          border-radius: 50%;
          width: 1.2rem;
          height: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .user-icon {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .user-container {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s;
          border: 1px solid transparent;
        }
        
        .user-container:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .user-avatar {
          font-size: 1.5rem;
          color: #374151;
          transition: color 0.3s;
        }
        
        .user-container:hover .user-avatar {
          color: #4f46e5;
        }
        
        /* Mobile Navigation */
        .mobile-nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
        }
        
        .mobile-nav-open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .mobile-nav-link {
          padding: 1.2rem 1.5rem;
          text-decoration: none;
          color: #374151;
          font-weight: bold;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.3s;
          display: block;
          position: relative;
          text-align: center;
          font-size: 1.1rem;
        }
        
        .mobile-nav-link:hover {
          background-color: #f8fafc;
          color: #4f46e5;
        }
        
        .mobile-cart-badge {
          background-color: #ef4444;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          border-radius: 50%;
          width: 1.4rem;
          height: 1.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
        }
        
        .cart-link {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .header-divider {
          height: 1px;
          background-color: #f3f4f6;
        }
        
        /* Media Queries */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
          
          .logo, .cart-icon {
            display: none;
          }
          
          .header-container {
            justify-content: space-between;
            padding: 0.75rem 1rem;
          }
          
          .header-icons {
            gap: 0.5rem;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-nav {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderPages;