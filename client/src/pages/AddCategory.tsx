"use client"

import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateCategory } from "../hooks/useCategories"
import { ArrowLeft } from "lucide-react"

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

const AddCategory = () => {
  const createCategory = useCreateCategory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = (data: CategoryFormValues) => {
    createCategory.mutate(data)
  }

  return (
    <div className="min-h-screen flex  justify-center bg-gray-50 px-4 pt-10">
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center  gap-4">
        <Link to="/categories" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Add Category</h1>
      </div>




      <div className="card max-w-2xl ">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="form-label">
              Category Name
            </label>
            <input id="name" type="text" className="form-input" {...register("name")} />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/categories" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={createCategory.isPending}>
              {createCategory.isPending ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
      </div>
      </div>
   
  )
}

export default AddCategory
