import Services from "./Components/Services"
import FootNav from "./Components/FootNav"
import Navbar from "./Components/Navbar"

function AdminDashboard() {
  return (
    <div className="page">
        <Navbar />
        <div className="bg-white rounded-3xl mt-7">
          <Services />
        </div>
        <FootNav />
    </div>
  )
}

export default AdminDashboard