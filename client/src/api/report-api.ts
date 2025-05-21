import type { ApiResponse, ReportData } from "../types"
import axiosPrivate from "./axios"

export const getReportData = async (): Promise<ApiResponse<ReportData>> => {
  const response = await axiosPrivate.get("/reports")
  return response.data
}

// Since we don't have a real reports API endpoint, we'll create mock data
// This would normally be replaced with actual API calls
export const getMockReportData = async (): Promise<ReportData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    totalProducts: 24,
    totalOrders: 18,
    totalRevenue: 4250,
    totalCustomers: 12,
    recentOrders: [],
    productsByCategory: [
      { category: "Hardware", count: 12 },
      { category: "Software", count: 8 },
      { category: "Electronics", count: 4 },
    ],
    ordersByStatus: [
      { status: "CONFIRMED", count: 8 },
      { status: "SHIPPED", count: 5 },
      { status: "DELIVERED", count: 3 },
      { status: "CANCELLED", count: 2 },
    ],
    ordersByPaymentType: [
      { paymentType: "CASH", count: 10 },
      { paymentType: "CARD", count: 8 },
    ],
    monthlySales: [
      { month: "Jan", sales: 320 },
      { month: "Feb", sales: 450 },
      { month: "Mar", sales: 380 },
      { month: "Apr", sales: 520 },
      { month: "May", sales: 650 },
      { month: "Jun", sales: 580 },
      { month: "Jul", sales: 420 },
      { month: "Aug", sales: 390 },
      { month: "Sep", sales: 540 },
    ],
  }
}
