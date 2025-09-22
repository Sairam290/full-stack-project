import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return "/login";
    
    switch (user.role) {
      case "farmer":
        return "/farmer/dashboard";
      case "admin":
        return "/admin/dashboard";
      case "user":
        return "/user/dashboard";
      default:
        return "/login";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img 
              src="/agrioasis.jpg" 
              alt="AgriOasis" 
              className="w-8 h-8" 
            />
            <h1 className="text-xl font-poppins text-agri-green-dark font-semibold">
              AgriOasis Market
            </h1>
          </div>
          <div>
            {isAuthenticated ? (
              <Link to={getDashboardLink()}>
                <Button className="bg-agri-green hover:bg-agri-green-dark">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex gap-4">
                <Link to="/login">
                  <Button variant="outline" className="border-agri-green text-agri-green hover:bg-agri-green hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-agri-green hover:bg-agri-green-dark">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="flex-grow flex flex-col md:flex-row">
        <div className="flex-1 bg-gradient-to-br from-agri-green-light/20 to-agri-yellow/30 p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-agri-brown-dark font-poppins mb-4">
            From Farm to Table, <br />
            <span className="text-agri-green-dark">Simply & Fresh</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
            Connect directly with local farmers, access fresh produce, and support sustainable agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link to="/signup?role=user">
              <Button className="bg-agri-green hover:bg-agri-green-dark btn-hover text-lg h-12 px-8">
                Shop as Customer
              </Button>
            </Link>
            <Link to="/signup?role=farmer">
              <Button variant="outline" className="border-agri-green text-agri-green hover:bg-agri-green/10 btn-hover text-lg h-12 px-8">
                Join as Farmer
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              Fresh Products
            </div>
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              Direct Sourcing
            </div>
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              Support Local
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="w-full h-full bg-black bg-opacity-10"></div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-agri-brown-dark font-poppins">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-agri-green-light/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                👨‍🌾
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agri-brown-dark">For Farmers</h3>
              <p className="text-gray-600">
                List your products, manage orders, and connect with customers who value quality.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-agri-yellow/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🛒
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agri-brown-dark">For Customers</h3>
              <p className="text-gray-600">
                Browse farm-fresh products, place orders, and enjoy direct-from-farm quality.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="w-16 h-16 bg-agri-brown-light/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                🌱
              </div>
              <h3 className="text-xl font-semibold mb-2 text-agri-brown-dark">For Community</h3>
              <p className="text-gray-600">
                Support sustainable farming practices and strengthen your local economy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-agri-brown-dark font-poppins">
            Featured Products
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all card-hover">
              <img 
                src="https://imgs.search.brave.com/XHG3vHSUXLSfi8HSbXVbxhMIoSSshBJnirKNF3mNADc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA1LzE2LzE4Lzgw/LzM2MF9GXzUxNjE4/ODA4MF92cGRXRUJl/ZnkyMjJiVFFSb1Ex/RkJTRWNDbEVSVG5C/Sy5qcGc" 
                alt="Organic Carrots" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">Organic Carrots</h3>
                <p className="text-sm text-gray-600 mb-2">John Farmer</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-agri-green-dark">$2.99</span>
                  <Link to="/login">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all card-hover">
              <img 
                src="https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=2070&auto=format&fit=crop" 
                alt="Fresh Apples" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">Fresh Apples</h3>
                <p className="text-sm text-gray-600 mb-2">Jane Farmer</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-agri-green-dark">$3.49</span>
                  <Link to="/login">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all card-hover">
              <img 
                src="https://imgs.search.brave.com/WJYQ4Scp3QVTpd679AroNlQgZc_ZeN55-Bi646Dn3mQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcx/NTg5NDE1L3Bob3Rv/L3RvbWF0b2VzLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1t/ZUxKUkZBeUdFTTZ6/dDZka3BXN3VNMHgy/V3Z3cjNUSEN6VEE1/bUZRZ0ZJPQ" 
                alt="Organic Tomatoes" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">Organic Tomatoes</h3>
                <p className="text-sm text-gray-600 mb-2">Sam Farmer</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-agri-green-dark">$2.29</span>
                  <Link to="/login">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all card-hover">
              <img 
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=1974&auto=format&fit=crop" 
                alt="Fresh Milk" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-1">Fresh Milk</h3>
                <p className="text-sm text-gray-600 mb-2">John Farmer</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-agri-green-dark">$4.99</span>
                  <Link to="/login">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/login">
              <Button className="bg-agri-green hover:bg-agri-green-dark btn-hover">
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-agri-brown-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/agrioasis.jpg" 
                  alt="AgriOasis" 
                  className="w-8 h-8 bg-white rounded-full p-1" 
                />
                <h2 className="text-xl font-poppins font-semibold">
                  AgriOasis Market
                </h2>
              </div>
              <p className="text-sm text-gray-300 max-w-md">
                Connecting farmers and consumers directly, promoting sustainable agriculture and supporting local communities.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">For Farmers</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link to="/signup?role=farmer" className="hover:text-white">Join as Farmer</Link></li>
                  <li><Link to="/login" className="hover:text-white">Farmer Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">For Customers</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link to="/signup?role=user" className="hover:text-white">Customer Sign Up</Link></li>
                  <li><Link to="/login" className="hover:text-white">Customer Login</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 AgriOasis Market. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;