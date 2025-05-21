"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { Product } from "../types"
import toast from "react-hot-toast"

// Define cart item type
export interface CartItem {
  id: string
  product: Product
  quantity: number
  price: number
}

// Define cart state
interface CartState {
  items: CartItem[]
  isLoading: boolean
}

// Define cart actions
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SYNC_WITH_SERVER"; payload: CartItem[] }

// Define cart context
interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: Product, quantity: number) => boolean
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => boolean
  clearCart: () => void
  getSubtotal: () => number
  validateCart: () => { valid: boolean; message?: string }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload
      const existingItemIndex = state.items.findIndex((item) => item.product._id === product._id)

      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...state.items]
        const newQuantity = updatedItems[existingItemIndex].quantity + quantity
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: newQuantity,
          price: product.price * newQuantity,
        }
        return { ...state, items: updatedItems }
      } else {
        // Item doesn't exist, add new item
        return {
          ...state,
          items: [
            ...state.items,
            {
              id: product._id,
              product,
              quantity,
              price: product.price * quantity,
            },
          ],
        }
      }
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity,
                price: item.product.price * quantity,
              }
            : item,
        ),
      }
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "SYNC_WITH_SERVER":
      return {
        ...state,
        items: action.payload,
      }
    default:
      return state
  }
}

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
  })

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          dispatch({ type: "SYNC_WITH_SERVER", payload: parsedCart })
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Add item to cart with validation
  const addItem = (product: Product, quantity: number) => {
    // Validate quantity
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero")
      return false
    }

    // Validate stock
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`)
      return false
    }

    // Find existing item
    const existingItem = state.items.find((item) => item.product._id === product._id)
    const newQuantity = (existingItem?.quantity || 0) + quantity

    // Check if adding this quantity would exceed available stock
    if (newQuantity > product.stock) {
      toast.error(`Cannot add ${quantity} more. Only ${product.stock - (existingItem?.quantity || 0)} available.`)
      return false
    }

    dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
    toast.success(`${product.name} added to cart`)
    return true
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  // Update item quantity with validation
  const updateQuantity = (id: string, quantity: number) => {
    // Validate quantity
    if (quantity <= 0) {
      toast.error("Quantity must be greater than zero")
      return false
    }

    // Find the item
    const item = state.items.find((item) => item.id === id)
    if (!item) {
      toast.error("Item not found in cart")
      return false
    }

    // Check if the new quantity exceeds available stock
    if (quantity > item.product.stock) {
      toast.error(`Cannot set quantity to ${quantity}. Only ${item.product.stock} available.`)
      return false
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    return true
  }

  // Clear cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  // Calculate subtotal
  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price, 0)
  }

  // Validate the entire cart
  const validateCart = (): { valid: boolean; message?: string } => {
    // Check if cart is empty
    if (state.items.length === 0) {
      return { valid: false, message: "Your cart is empty" }
    }

    // Check each item for stock availability
    for (const item of state.items) {
      if (item.quantity <= 0) {
        return {
          valid: false,
          message: `Invalid quantity for ${item.product.name}`,
        }
      }

      if (item.quantity > item.product.stock) {
        return {
          valid: false,
          message: `Not enough stock for ${item.product.name}. Only ${item.product.stock} available.`,
        }
      }

      if (item.product.stock <= 0) {
        return {
          valid: false,
          message: `${item.product.name} is out of stock`,
        }
      }
    }

    return { valid: true }
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isLoading: state.isLoading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        validateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
