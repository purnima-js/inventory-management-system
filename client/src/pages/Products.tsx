"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useProducts, useDeleteProduct } from "../hooks/useProducts"
import { Plus, Edit, Trash2, Search, Grid, List } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import ProductCard from "../components/ProductCard"

const Products = () => {
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredProducts =
    products?.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/add" className="btn btn-primary inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="form-input pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchTerm ? "No products found matching your search" : "No products found"}
              </div>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Image</th>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">Stock</th>
                  <th className="table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="table-row">
                      <td className="table-cell">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="table-cell font-medium text-gray-900">{product.name}</td>
                      <td className="table-cell">
                        {typeof product.category === "object" ? product.category.name : product.category}
                      </td>
                      <td className="table-cell">${product.price.toFixed(2)}</td>
                      <td className="table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock < 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center space-x-2">
                          <Link to={`/products/edit/${product._id}`} className="text-blue-600 hover:text-blue-800">
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-800"
                            disabled={deleteProduct.isPending}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="table-cell text-center py-4">
                      {searchTerm ? "No products found matching your search" : "No products found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
