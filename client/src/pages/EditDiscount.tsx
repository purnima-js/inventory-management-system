"use client"

import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useDiscount, useUpdateDiscount } from "../hooks/useDiscounts"
import { ArrowLeft, Percent } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"

const discountSchema = z.object({
  code: z.string().min(3, "Discount code must be at least 3 characters"),
  percentage: z.coerce.number().min(1, "Percentage must be at least 1%").max(100, "Percentage cannot exceed 100%"),
  isActive: z.boolean(),
  expiresAt: z.string().min(1, "Expiration date is required"),
})

type DiscountFormValues = z.infer<typeof discountSchema>

const EditDiscount = () => {
  const { id } = useParams<{ id: string }>()
  const { data: discount, isLoading } = useDiscount(id!)
  const updateDiscount = useUpdateDiscount()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      percentage: 10,
      isActive: true,
      expiresAt: new Date().toISOString().split("T")[0],
    },
  })

  useEffect(() => {
    if (discount) {
      reset({
        code: discount.code,
        percentage: discount.percentage,
        isActive: discount.isActive,
        expiresAt: new Date(discount.expiresAt).toISOString().split("T")[0],
      })
    }
  }, [discount, reset])

  const onSubmit = (data: DiscountFormValues) => {
    if (id) {
      updateDiscount.mutate({ id, data })
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
 <div className="min-h-screen flex  justify-center bg-gray-50 px-4">
    <div className="space-y-6 w-full max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/discounts" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Discount</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="code" className="form-label">
              Discount Code
            </label>
            <input id="code" type="text" className="form-input" {...register("code")} placeholder="e.g. SUMMER2025" />
            {errors.code && <p className="form-error">{errors.code.message}</p>}
          </div>

          <div>
            <label htmlFor="percentage" className="form-label">
              Discount Percentage
            </label>
            <div className="relative">
              <input
                id="percentage"
                type="number"
                className="form-input pr-10"
                {...register("percentage")}
                min="1"
                max="100"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Percent className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            {errors.percentage && <p className="form-error">{errors.percentage.message}</p>}
          </div>

          <div>
            <label htmlFor="expiresAt" className="form-label">
              Expiration Date
            </label>
            <input id="expiresAt" type="date" className="form-input" {...register("expiresAt")} />
            {errors.expiresAt && <p className="form-error">{errors.expiresAt.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              {...register("isActive")}
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link to="/discounts" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={updateDiscount.isPending}>
              {updateDiscount.isPending ? "Updating..." : "Update Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default EditDiscount
