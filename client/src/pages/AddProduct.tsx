"use client"

import type React from "react"

import { useState } from "react"

import { useRef } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateProduct } from "../hooks/useProducts"
import { useCategories } from "../hooks/useCategories"
import { ArrowLeft, Upload } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock must be a non-negative integer"),
})

type ProductFormValues = z.infer<typeof productSchema>

const AddProduct = () => {
  const { data: categories, isLoading: isLoadingCategories } = useCategories()
  const createProduct = useCreateProduct()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stock: 0,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const onSubmit = (data: ProductFormValues) => {
    if (!selectedFile) {
      alert("Please select an image")
      return
    }

    createProduct.mutate({
      ...data,
      image: selectedFile,
    })
  }

  if (isLoadingCategories) {
    return <LoadingSpinner />
  }

  return (
    
    <div className="min-h-screen flex  justify-center bg-gray-50 px-4">
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/products" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Add Product</h1>
      </div>

      <div className="card w-[800px] h-[600px] p-6 bg-white shadow-lg rounded-lg">
       

       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">
              Product Name
            </label>
            <input id="name" type="text" className="form-input" {...register("name")} />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select id="category" className="form-input" {...register("category")}>
              <option value="">Select a category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="form-error">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input id="price" type="number" step="0.01" className="form-input" {...register("price")} />
            {errors.price && <p className="form-error">{errors.price.message}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input id="stock" type="number" className="form-input" {...register("stock")} />
            {errors.stock && <p className="form-error">{errors.stock.message}</p>}
          </div>

          <div>
            <label className="form-label">Product Image</label>
            <div className="mt-1 flex items-center">
              {selectedFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1"
                    onClick={() => setSelectedFile(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary flex items-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={createProduct.isPending}>
              {createProduct.isPending ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
           </div>
      </div>
      </div>
   
  )
}

export default AddProduct
