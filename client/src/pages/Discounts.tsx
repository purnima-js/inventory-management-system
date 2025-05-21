"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useDiscounts, useDeleteDiscount } from "../hooks/useDiscounts"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const Discounts = () => {
  const { data: discounts, isLoading } = useDiscounts()
  const deleteDiscount = useDeleteDiscount()
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredDiscounts =
    discounts?.filter((discount) => discount.code?.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      deleteDiscount.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Discounts</h1>
        <Link to="/discounts/add" className="btn btn-primary inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Discount
        </Link>
      </div>

      <div className="card">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search discounts..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">code</th>
                <th className="table-header-cell">Percentage</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Expires At</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredDiscounts.length > 0 ? (
                filteredDiscounts.map((discount) => (
                  <tr key={discount._id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">{discount.code}</td>
                    <td className="table-cell">{discount.percentage}%</td>
                    <td className="table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          discount.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {discount.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="table-cell">{new Date(discount.expiresAt).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link to={`/discounts/edit/${discount._id}`} className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(discount._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={deleteDiscount.isPending}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-cell text-center py-4">
                    {searchTerm ? "No discounts found matching your search" : "No discounts found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Discounts
