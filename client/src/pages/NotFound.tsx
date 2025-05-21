import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you are looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
