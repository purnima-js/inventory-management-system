"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRegister } from "../hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

const registerSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const register = useRegister()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: RegisterFormValues) => {
    register.mutate(data)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                className="form-input"
                {...registerField("username")}
              />
              {errors.username && <p className="form-error">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input id="email" type="email" autoComplete="email" className="form-input" {...registerField("email")} />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="form-input pr-10"
                  {...registerField("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit" className="btn btn-primary w-full" disabled={register.isPending}>
              {register.isPending ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
