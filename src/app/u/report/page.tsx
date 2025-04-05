
import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateReportPage() {
  // This is a placeholder. We'll import the actual component once it's created
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Report</h1>
          <p className="text-muted-foreground">File a new incident report</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Form</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Report form will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
