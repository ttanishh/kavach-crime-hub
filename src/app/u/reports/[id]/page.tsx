
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportDetailPage() {
  // In React Router, we use useParams to get dynamic route parameters
  const { id } = useParams<{ id: string }>();

  // This is a placeholder. We'll implement the actual report fetching logic later
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Report Details</h1>
          <p className="text-muted-foreground">Viewing report ID: {id}</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Report details will be displayed here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
