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
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
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

  // Add item to cart
  const addItem = (product: Product, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity } })
    toast.success(`${product.name} added to cart`)
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  // Clear cart
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  // Calculate subtotal
  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price, 0)
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
