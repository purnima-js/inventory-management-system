"use client"

import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCategory, useUpdateCategory } from "../hooks/useCategories"
import { ArrowLeft } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
})

type CategoryFormValues = z.infer<typeof categorySchema>

const EditCategory = () => {
  const { id } = useParams<{ id: string }>()
  const { data: category, isLoading } = useCategory(id!)
  const updateCategory = useUpdateCategory()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
      })
    }
  }, [category, reset])

  const onSubmit = (data: CategoryFormValues) => {
    if (id) {
      updateCategory.mutate({ id, data })
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
   <div className="min-h-screen flex  justify-center bg-gray-50 px-4">
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/categories" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Category</h1>
      </div>

      <div className="card max-w-2xl">
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
            <button type="submit" className="btn btn-primary" disabled={updateCategory.isPending}>
              {updateCategory.isPending ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default EditCategory
