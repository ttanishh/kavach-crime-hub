
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, Tooltip, Legend, 
  XAxis, YAxis 
} from 'recharts';
import { Building2, Map, User, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapComponent from '@/components/map/MapComponent';

const SuperAdminDashboard = () => {
  const { userData } = useAuth();
  const [timeframe, setTimeframe] = useState("week");
  
  // Placeholder data for demonstration
  const stationData = [
    { name: 'Central', reports: 156, resolved: 124 },
    { name: 'North West', reports: 134, resolved: 98 },
    { name: 'South', reports: 121, resolved: 89 },
    { name: 'East', reports: 87, resolved: 56 },
    { name: 'West', reports: 95, resolved: 72 },
  ];

  const crimeData = [
    { name: 'Theft', value: 378 },
    { name: 'Assault', value: 167 },
    { name: 'Fraud', value: 243 },
    { name: 'Cybercrime', value: 185 },
    { name: 'Other', value: 132 },
  ];

  // Sample data for heatmap
  const incidentLocations = [
    { id: 1, lat: 22.5726, lng: 88.3639, intensity: 50, title: "Theft" }, // Kolkata
    { id: 2, lat: 28.7041, lng: 77.1025, intensity: 70, title: "Assault" }, // Delhi
    { id: 3, lat: 19.0760, lng: 72.8777, intensity: 65, title: "Fraud" }, // Mumbai
    { id: 4, lat: 13.0827, lng: 80.2707, intensity: 45, title: "Cybercrime" }, // Chennai
    { id: 5, lat: 17.3850, lng: 78.4867, intensity: 55, title: "Theft" }, // Hyderabad
    { id: 6, lat: 12.9716, lng: 77.5946, intensity: 60, title: "Robbery" }, // Bangalore
  ];
  
  // Stats summary
  const stats = {
    totalStations: 26,
    activeReports: 1105,
    resolvedCases: 876,
    totalUsers: 5432
  };
  
  // Colors for pie chart
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1'];
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Command Center</h1>
          <p className="text-muted-foreground">
            National Crime Management Overview
          </p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Police Stations</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStations}</div>
              <p className="text-xs text-muted-foreground">Registered stations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
              <FileText className="h-4 w-4 text-kavach-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReports}</div>
              <p className="text-xs text-muted-foreground">Open cases nationwide</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedCases}</div>
              <p className="text-xs text-muted-foreground">Successfully closed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Citizen users</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Time-based filtering */}
        <div className="flex items-center space-x-4">
          <Tabs defaultValue="week" value={timeframe} onValueChange={setTimeframe} className="w-full">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Analytics</h2>
              <TabsList>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
        
        {/* Analytics */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Station Performance */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Station Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar name="Total Reports" dataKey="reports" fill="hsl(var(--kavach-600))" />
                    <Bar name="Resolved" dataKey="resolved" fill="hsl(var(--police-600))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Crime Distribution */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Crime Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={crimeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {crimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} reports`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Crime Heatmap */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Crime Heatmap</CardTitle>
            <Link 
              to="/sa/heatmap"
              className="text-sm text-kavach-700 hover:underline flex items-center"
            >
              <Map className="mr-1 h-4 w-4" />
              View Full Map
            </Link>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <MapComponent locations={incidentLocations} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
