"use client"

import type React from "react"

import { useState } from "react"
import { useAddToOrder } from "../hooks/useOrderItems"
import { useApplyDiscount } from "../hooks/useDiscounts"
import { useUser } from "../hooks/useAuth"

import { Trash2, ShoppingCart, Tag, Plus, Minus, CreditCard, Banknote } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useCreateOrder } from "../hooks/useOrder"

const OrderItems = () => {
  const navigate = useNavigate()
  const { data: user } = useUser()
  const { items: cartItems, removeItem, updateQuantity, getSubtotal, clearCart, validateCart } = useCart()
  const addToOrder = useAddToOrder()
  const applyDiscount = useApplyDiscount()
  const createOrder = useCreateOrder()

  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null)
  const [paymentType, setPaymentType] = useState<"CASH" | "CARD">("CASH")
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRemoveItem = (id: string) => {
    if (window.confirm("Are you sure you want to remove this item from your order?")) {
      removeItem(id)
    }
  }

  const handleUpdateQuantity = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault()
    if (discountCode.trim()) {
      applyDiscount.mutate(discountCode, {
        onSuccess: (data) => {
          setAppliedDiscount({
            code: discountCode,
            percentage: data.data.percentage || 0,
          })
          toast.success(`Discount code ${discountCode} applied successfully!`)
        },
      })
    }
  }

  const handleCheckout = async () => {
    // Validate the cart first
    const validation = validateCart()
    if (!validation.valid) {
      toast.error(validation.message || "Your cart is invalid")
      return
    }

    if (!user) {
      toast.error("You must be logged in to checkout")
      return
    }

    setIsCheckingOut(true)
    setIsSubmitting(true)

    try {
      // First, add all cart items to the server
      const orderItemIds = []

      for (const item of cartItems) {
        const response = await addToOrder.mutateAsync({
          product: item.product._id,
          quantity: item.quantity,
        })

        if (response && response.data && response.data._id) {
          orderItemIds.push(response.data._id)
        }
      }

      if (orderItemIds.length === 0) {
        throw new Error("Failed to create order items")
      }

      // Then create the order with the order item IDs
      const orderData = {
        customer: user._id,
        orderItems: orderItemIds,
        total: getSubtotal(),
        discountCode: appliedDiscount?.code,
        paymentType,
      }

      await createOrder.mutateAsync(orderData)

      // Clear the cart after successful checkout
      clearCart()

      // Navigate to orders page
      navigate("/orders")
      toast.success("Order placed successfully!")
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to complete checkout. Please try again.")
    } finally {
      setIsCheckingOut(false)
      setIsSubmitting(false)
    }
  }

  // Calculate total
  const subtotal = getSubtotal()
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percentage) / 100 : 0
  const total = subtotal - discountAmount

  if (isSubmitting) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Order Items</h1>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Your Items
              </h2>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.product.name}</h3>
                        <p className="ml-4">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {typeof item.product.category === "object" ? item.product.category.name : item.product.category}
                      </p>

                      <div className="flex items-center justify-between text-sm mt-2">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-2 py-1 border-x">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between border-b border-gray-200 pb-4">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {/* Discount Form */}
                <form onSubmit={handleApplyDiscount} className="border-b border-gray-200 pb-4">
                  <label htmlFor="discount-code" className="form-label flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Discount Code
                  </label>
                  <div className="flex mt-1">
                    <input
                      type="text"
                      id="discount-code"
                      className="form-input rounded-r-none"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter code"
                      disabled={!!appliedDiscount}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary rounded-l-none"
                      disabled={applyDiscount.isPending || !discountCode.trim() || !!appliedDiscount}
                    >
                      Apply
                    </button>
                  </div>
                  {appliedDiscount && (
                    <div className="mt-2 text-sm text-green-600 flex items-center">
                      <span className="font-medium">{appliedDiscount.code}</span>
                      <span className="mx-1">-</span>
                      <span>{appliedDiscount.percentage}% discount applied</span>
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800"
                        onClick={() => setAppliedDiscount(null)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </form>

                {/* Payment Type Selection */}
                <div className="border-b border-gray-200 pb-4">
                  <label className="form-label">Payment Method</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="CASH"
                        checked={paymentType === "CASH"}
                        onChange={() => setPaymentType("CASH")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <Banknote className="h-5 w-5 text-gray-500" />
                      <span>Cash</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentType"
                        value="CARD"
                        checked={paymentType === "CARD"}
                        onChange={() => setPaymentType("CARD")}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <span>Card</span>
                    </label>
                  </div>
                </div>

                {/* Total with discount */}
                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button
                  className="btn btn-primary w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut || !cartItems || cartItems.length === 0}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-8">
          <ShoppingCart className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your order is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding products to your order</p>
        </div>
      )}
    </div>
  )
}

export default OrderItems
