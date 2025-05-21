import { ShoppingCart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { Link } from "react-router-dom"

const CartIcon = () => {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link to="/order-items" className="relative">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  )
}

export default CartIcon
