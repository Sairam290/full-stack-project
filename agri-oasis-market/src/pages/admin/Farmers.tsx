import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getFarmers, updateUserStatus, User } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const AdminFarmers = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [farmers, setFarmers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFarmers, setFilteredFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      if (!isAuthenticated || !user || user.role !== "admin") {
        toast({
          title: "Error",
          description: "You must be logged in as an admin to view farmers.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await getFarmers();
        setFarmers(data);
        setFilteredFarmers(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to fetch farmers.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, [user, isAuthenticated, toast]);

  useEffect(() => {
    const filtered = farmers.filter(
      (farmer) =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFarmers(filtered);
  }, [farmers, searchTerm]);

  const handleStatusChange = async (farmerId: string, newStatus: User["status"]) => {
    try {
      const updatedFarmer = await updateUserStatus(farmerId, newStatus);
      const updatedFarmers = farmers.map((farmer) =>
        farmer.id === farmerId ? { ...farmer, status: updatedFarmer.status } : farmer
      );
      setFarmers(updatedFarmers);
      setFilteredFarmers(updatedFarmers);
      toast({
        title: "Status updated",
        description: `Farmer status has been updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update farmer status.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Layout title="Manage Farmers" role="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">View and manage all registered farmers</p>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Search farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button className="bg-agri-green hover:bg-agri-green-dark">
            Add Farmer
          </Button>
        </div>
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500">
            Try adjusting your search or add a new farmer.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Farmer ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFarmers.map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{farmer.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{farmer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{farmer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{farmer.products}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${farmer.sales.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(farmer.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            farmer.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : farmer.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          View
                        </Button>
                        {farmer.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-red-500 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleStatusChange(farmer.id, "suspended")}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs border-green-500 text-green-500 hover:bg-green-500/10"
                            onClick={() => handleStatusChange(farmer.id, "active")}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminFarmers;