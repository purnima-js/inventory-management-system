import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { Package, Tag, AlertTriangle } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard = () => {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  if (isLoadingProducts || isLoadingCategories) {
    return <LoadingSpinner />;
  }

  // Calculate low stock items (less than 5 in stock)
  const lowStockItems = products?.filter((product) => product.stock < 50) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="card bg-white flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Total Products
            </h3>
            <p className="text-3xl font-bold">{products?.length || 0}</p>
          </div>
        </div>

        {/* Total Categories */}
        <div className="card bg-white flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <Tag className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Total Categories
            </h3>
            <p className="text-3xl font-bold">{categories?.length || 0}</p>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="card bg-white flex items-center">
          <div className="rounded-full bg-amber-100 p-3 mr-4">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Low Stock Items
            </h3>
            <p className="text-3xl font-bold">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="table-header-cell">Name</th>
                <th className="table-header-cell">Category</th>
                <th className="table-header-cell">Price</th>
                <th className="table-header-cell">Stock</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {products && products.length > 0 ? (
                products.slice(0, 5).map((product) => (
                  <tr key={product._id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="table-cell">
                      {typeof product.category === "object"
                        ? product.category.name
                        : product.category}
                    </td>
                    <td className="table-cell">${product.price.toFixed(2)}</td>
                    <td className="table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock < 5
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="table-cell text-center py-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="card bg-amber-50 border border-amber-200">
          <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Low Stock Alert (products with less than 50 in stock)
          </h2>
          <div className="table-container bg-white">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Name</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Stock</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {lowStockItems.map((product) => (
                  <tr key={product._id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="table-cell">
                      {typeof product.category === "object"
                        ? product.category.name
                        : product.category}
                    </td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
