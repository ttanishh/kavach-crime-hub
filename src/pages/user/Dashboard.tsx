
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

// Define proper interface for report data
interface ReportData {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  category: string;
  createdAt: string;
  location: string;
  [key: string]: any; // For other properties that might exist
}

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500',
  'investigating': 'bg-blue-500',
  'resolved': 'bg-green-500',
  'closed': 'bg-gray-500'
};

const UserDashboard = () => {
  const { userData } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    closed: 0
  });
  
  useEffect(() => {
    const fetchReports = async () => {
      if (!userData?.uid) return;
      
      try {
        const q = query(
          collection(db, 'reports'),
          where('userId', '==', userData.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const reportData: ReportData[] = [];
        let pending = 0;
        let investigating = 0;
        let resolved = 0;
        let closed = 0;
        
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as ReportData;
          reportData.push(data);
          
          // Count by status
          if (data.status === 'pending') pending++;
          if (data.status === 'investigating') investigating++;
          if (data.status === 'resolved') resolved++;
          if (data.status === 'closed') closed++;
        });
        
        // Sort by date (newest first)
        reportData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setReports(reportData);
        setStats({
          total: reportData.length,
          pending,
          investigating,
          resolved,
          closed
        });
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [userData?.uid]);
  
  // For demo - create sample data if no reports exist
  useEffect(() => {
    if (!loading && reports.length === 0) {
      const sampleReports = [
        {
          id: 'sample-1',
          title: 'Vehicle Theft',
          description: 'My car was stolen from the parking lot',
          status: 'investigating',
          category: 'theft',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Central Mall Parking'
        },
        {
          id: 'sample-2',
          title: 'Phone Snatching',
          description: 'Someone snatched my phone while walking',
          status: 'pending', 
          category: 'robbery',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Main Street'
        }
      ];
      
      setReports(sampleReports);
      setStats({
        total: 2,
        pending: 1,
        investigating: 1,
        resolved: 0,
        closed: 0
      });
    }
  }, [loading, reports.length]);
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.displayName || userData?.email?.split('@')[0]}
          </p>
        </div>
        
        {/* Quick actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Reports filed by you</p>
              <Progress value={(stats.total > 0 ? 100 : 0)} className="h-1 mt-3" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
              <Progress value={(stats.pending / stats.total) * 100 || 0} className="h-1 mt-3 bg-yellow-100">
                <div className="h-full bg-yellow-500 transition-all" 
                  style={{ width: `${(stats.pending / stats.total) * 100 || 0}%` }} />
              </Progress>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Investigating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.investigating}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
              <Progress value={(stats.investigating / stats.total) * 100 || 0} className="h-1 mt-3 bg-blue-100">
                <div className="h-full bg-blue-500 transition-all" 
                  style={{ width: `${(stats.investigating / stats.total) * 100 || 0}%` }} />
              </Progress>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground">Case closed</p>
              <Progress value={(stats.resolved / stats.total) * 100 || 0} className="h-1 mt-3 bg-green-100">
                <div className="h-full bg-green-500 transition-all" 
                  style={{ width: `${(stats.resolved / stats.total) * 100 || 0}%` }} />
              </Progress>
            </CardContent>
          </Card>
        </div>
        
        {/* New report CTA */}
        <Card className="bg-kavach-50">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-kavach-900">Need to report a crime?</h3>
              <p className="text-kavach-700">File a new report to notify authorities</p>
            </div>
            <Button asChild className="font-semibold">
              <Link to="/u/report">
                File a Report <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Recent reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <Button variant="ghost" asChild>
              <Link to="/u/reports" className="flex items-center gap-1">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-md animate-pulse-slow"></div>
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-2">
              {reports.slice(0, 3).map((report) => (
                <Link to={`/u/reports/${report.id}`} key={report.id}>
                  <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${statusColors[report.status] || 'bg-gray-500'} text-white`}>
                          {report.status === 'pending' && <Clock className="h-5 w-5" />}
                          {report.status === 'investigating' && <AlertTriangle className="h-5 w-5" />}
                          {report.status === 'resolved' && <CheckCircle className="h-5 w-5" />}
                          {report.status === 'closed' && <FileText className="h-5 w-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium line-clamp-1">{report.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="capitalize">{report.category}</span>
                            <span>•</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize" 
                          style={{ 
                            backgroundColor: `var(--${report.status === 'pending' ? 'yellow' : report.status === 'investigating' ? 'blue' : report.status === 'resolved' ? 'green' : 'gray'}-100)`,
                            color: `var(--${report.status === 'pending' ? 'yellow' : report.status === 'investigating' ? 'blue' : report.status === 'resolved' ? 'green' : 'gray'}-700)`
                          }}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>No reports found</AlertTitle>
              <AlertDescription>
                You haven't filed any reports yet. Create a new report to get started.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
