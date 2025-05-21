"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useCategories, useDeleteCategory } from "../hooks/useCategories"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const Categories = () => {
  const { data: categories, isLoading } = useCategories()
  const deleteCategory = useDeleteCategory()
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) {
    return <LoadingSpinner />
  }

  const filteredCategories =
    categories?.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link to="/categories/add" className="btn btn-primary inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Link>
      </div>

      <div className="card">
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Created At</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">{category.name}</td>
                    <td className="table-cell">{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link to={`/categories/edit/${category._id}`} className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="table-cell text-center py-4">
                    {searchTerm ? "No categories found matching your search" : "No categories found"}
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

export default Categories
