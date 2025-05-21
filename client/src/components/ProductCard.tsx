

import { Link } from "react-router-dom"

import { ShoppingCart } from "lucide-react"
import type { Product } from "../types"
import { useCart } from "../context/CartContext"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart()

  const handleAddToOrder = () => {
    addItem(product, 1)
  }

  return (
    <div className="card h-full flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {typeof product.category === "object" ? product.category.name : product.category}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              product.stock < 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {product.stock} in stock
          </span>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link to={`/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-800 text-sm">
            View Details
          </Link>
         <button onClick={handleAddToOrder} className="btn btn-primary btn-sm flex items-center">
           <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Order
         </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
