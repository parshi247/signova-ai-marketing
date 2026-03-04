import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Server, Zap, CheckCircle } from 'lucide-react';

export default function DatabaseTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Overview</h2>
          <p className="text-muted-foreground">Monitor database health and statistics</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">Across all tables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 GB</div>
            <p className="text-xs text-muted-foreground">of 20 GB allocated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12ms</div>
            <p className="text-xs text-green-600">Avg response time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99%+</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Table Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">users</p>
                <p className="text-sm text-muted-foreground">User accounts and profiles</p>
              </div>
              <div className="text-right">
                <p className="font-medium">2,847 rows</p>
                <p className="text-sm text-muted-foreground">12.4 MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">documents</p>
                <p className="text-sm text-muted-foreground">Uploaded documents</p>
              </div>
              <div className="text-right">
                <p className="font-medium">45,231 rows</p>
                <p className="text-sm text-muted-foreground">2.1 GB</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">signatures</p>
                <p className="text-sm text-muted-foreground">Signature records</p>
              </div>
              <div className="text-right">
                <p className="font-medium">128,456 rows</p>
                <p className="text-sm text-muted-foreground">890 MB</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">audit_logs</p>
                <p className="text-sm text-muted-foreground">Activity audit trail</p>
              </div>
              <div className="text-right">
                <p className="font-medium">1,024,892 rows</p>
                <p className="text-sm text-muted-foreground">1.8 GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
