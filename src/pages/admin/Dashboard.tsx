
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, CircleAlert, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    closed: 0
  });
  
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData?.uid) return;
      
      try {
        // Get station ID from user data
        const stationId = userData.stationId || 'demo-station';
        
        // Query reports assigned to this station
        const q = query(
          collection(db, 'reports'),
          where('assignedStationId', '==', stationId)
        );
        
        const querySnapshot = await getDocs(q);
        const reportData: any[] = [];
        let pending = 0;
        let investigating = 0;
        let resolved = 0;
        let closed = 0;
        
        // Category tracking
        const categoryCount: Record<string, number> = {};
        
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() };
          reportData.push(data);
          
          // Count by status
          if (data.status === 'pending') pending++;
          if (data.status === 'investigating') investigating++;
          if (data.status === 'resolved') resolved++;
          if (data.status === 'closed') closed++;
          
          // Count by category
          const category = data.category || 'other';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        // Sort by date (newest first)
        reportData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setRecentReports(reportData.slice(0, 5));
        setStats({
          total: reportData.length,
          pending,
          investigating,
          resolved,
          closed
        });
        
        // Format category data for chart
        const formattedCategoryData = Object.keys(categoryCount).map(category => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          count: categoryCount[category]
        }));
        
        setCategoryData(formattedCategoryData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [userData?.uid, userData?.stationId]);
  
  // Generate sample data if no reports exist
  useEffect(() => {
    if (!loading && recentReports.length === 0) {
      const sampleReports = [
        {
          id: 'sample-1',
          title: 'Motorcycle Theft',
          description: 'Motorcycle stolen from residential area',
          status: 'investigating',
          category: 'theft',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Green Park, Block C',
          reporterName: 'Rahul Kumar'
        },
        {
          id: 'sample-2',
          title: 'Assault Complaint',
          description: 'Physical assault near metro station',
          status: 'pending', 
          category: 'assault',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Metro Station, Exit 4',
          reporterName: 'Priya Singh'
        },
        {
          id: 'sample-3',
          title: 'Cyber Fraud',
          description: 'Online banking fraud report',
          status: 'resolved',
          category: 'fraud',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Online',
          reporterName: 'Vikram Patel'
        },
        {
          id: 'sample-4',
          title: 'Trespassing',
          description: 'Unknown person entering private property',
          status: 'investigating',
          category: 'trespassing',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Sunshine Apartments, Flat 302',
          reporterName: 'Ananya Sharma'
        }
      ];
      
      setRecentReports(sampleReports);
      setStats({
        total: 4,
        pending: 1,
        investigating: 2,
        resolved: 1,
        closed: 0
      });
      
      const sampleCategoryData = [
        { name: 'Theft', count: 1 },
        { name: 'Assault', count: 1 },
        { name: 'Fraud', count: 1 },
        { name: 'Trespassing', count: 1 }
      ];
      
      setCategoryData(sampleCategoryData);
    }
  }, [loading, recentReports.length]);

  // Weekly report data for chart
  const weeklyData = [
    { name: 'Mon', reports: 4 },
    { name: 'Tue', reports: 7 },
    { name: 'Wed', reports: 5 },
    { name: 'Thu', reports: 6 },
    { name: 'Fri', reports: 9 },
    { name: 'Sat', reports: 3 },
    { name: 'Sun', reports: 2 },
  ];
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Police Station Dashboard</h1>
          <p className="text-muted-foreground">
            Station: {userData?.stationName || 'Demo Station'}
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time cases</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Investigating</CardTitle>
              <CircleAlert className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.investigating}</div>
              <p className="text-xs text-muted-foreground">Active investigations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Cases resolved</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Weekly Report Trend */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Weekly Report Trend</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} reports`, 'Count']}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    />
                    <Bar 
                      dataKey="reports" 
                      fill="hsl(var(--kavach-700))" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Report Categories */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} reports`, 'Count']}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--police-700))" 
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <Link 
              to="/a/reports"
              className="text-sm text-kavach-700 hover:text-kavach-900 font-medium"
            >
              View all reports
            </Link>
          </div>
          
          <div className="rounded-md border">
            <div className="p-4 grid grid-cols-12 font-medium text-sm">
              <div className="col-span-4">Case</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date Filed</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2 text-right">Status</div>
            </div>
            
            {loading ? (
              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4 animate-pulse-slow">
                    <div className="h-5 bg-muted rounded w-4/5"></div>
                  </div>
                ))}
              </div>
            ) : recentReports.length > 0 ? (
              <div className="divide-y">
                {recentReports.map((report) => (
                  <Link 
                    to={`/a/reports/${report.id}`} 
                    key={report.id} 
                    className="p-4 grid grid-cols-12 hover:bg-muted/50 transition-colors text-sm"
                  >
                    <div className="col-span-4 font-medium">{report.title}</div>
                    <div className="col-span-2 capitalize">{report.category}</div>
                    <div className="col-span-2">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 truncate" title={report.location}>
                      {report.location}
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize" 
                        style={{ 
                          backgroundColor: `var(--${report.status === 'pending' ? 'yellow' : report.status === 'investigating' ? 'blue' : report.status === 'resolved' ? 'green' : 'gray'}-100)`,
                          color: `var(--${report.status === 'pending' ? 'yellow' : report.status === 'investigating' ? 'blue' : report.status === 'resolved' ? 'green' : 'gray'}-700)`
                        }}
                      >
                        {report.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="font-medium text-muted-foreground mb-2">No reports found</h3>
                <p className="text-sm text-muted-foreground">
                  No reports have been assigned to your station yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
