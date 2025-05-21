"use client"

import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCreateDiscount } from "../hooks/useDiscounts"
import { ArrowLeft, Percent } from "lucide-react"

const discountSchema = z.object({
  code: z.string().min(3, "Discount code must be at least 3 characters").toUpperCase(),
  percentage: z.coerce.number().min(1, "Percentage must be at least 1%").max(100, "Percentage cannot exceed 100%"),
  isActive: z.boolean({
    required_error: "isActive is required",
  }),
  expiresAt: z.string().min(1, "Expiration date is required"),
})

type DiscountFormValues = z.infer<typeof discountSchema>

const AddDiscount = () => {
  const createDiscount = useCreateDiscount()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      percentage: 10,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days from now
    },
  })

  const onSubmit = (data: DiscountFormValues) => {
    console.log(data)
    createDiscount.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/discounts" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Add Discount</h1>
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
            <button type="submit" className="btn btn-primary" disabled={createDiscount.isPending}>
              {createDiscount.isPending ? "Creating..." : "Create Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDiscount
