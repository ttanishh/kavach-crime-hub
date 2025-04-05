
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsListPage() {
  // This is a placeholder. We'll import the actual component once it's created
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-muted-foreground">View and manage your reports</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports List</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Reports list will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
