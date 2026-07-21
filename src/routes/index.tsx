import { createFileRoute } from "@tanstack/react-router";
import {
  IndianRupee, ShoppingCart, Users, TrendingUp, Percent,
  Wallet, Activity, ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from "@/components/KpiCard";
import { PageHeader } from "@/components/PageHeader";
import {
  monthlySales, products, orders, revenueByCategory, salesByRegion,
  customersBySegment, pipelineRuns,
} from "@/data";
import { inr, num, pct } from "@/lib/format";

export const Route = createFileRoute("/")({ component: ExecutiveDashboard });

const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ef4444"];

function ExecutiveDashboard() {
  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const recentOrders = [...orders].slice(-6).reverse();
  const lastRun = pipelineRuns[0];

  return (
    <div>
      <PageHeader title="Executive Dashboard" description="Real-time snapshot of business performance across all channels." />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <KpiCard label="Total Revenue" value="₹24.8M" hint="FY 2026" icon={IndianRupee} tone="primary" />
        <KpiCard label="Total Orders" value="12,450" hint="+8.2% MoM" icon={ShoppingCart} tone="primary" />
        <KpiCard label="Total Customers" value="3,240" hint="248 new" icon={Users} tone="success" />
        <KpiCard label="Avg Order Value" value="₹1,992" hint="+3.4%" icon={Wallet} tone="primary" />
        <KpiCard label="Total Profit" value="₹4.6M" hint="+11% YoY" icon={TrendingUp} tone="success" />
        <KpiCard label="Profit Margin" value="18.5%" hint="Target 18%" icon={Percent} tone="success" />
        <KpiCard label="Revenue Growth" value="12.8%" hint="vs last year" icon={Activity} tone="warning" />
        <KpiCard label="Data Quality" value="96.4%" hint="Gold layer" icon={ShieldCheck} tone="success" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Monthly Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Customer Segments</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={customersBySegment()} dataKey="count" nameKey="segment"
                  cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {customersBySegment().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue vs Profit</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueByCategory()} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <YAxis type="category" dataKey="category" fontSize={11} width={90} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Sales by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesByRegion()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="region" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pipeline Health</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Last Run" value={lastRun.startedAt} />
            <Row label="Status" value={<Badge className="bg-success text-success-foreground">{lastRun.status}</Badge>} />
            <Row label="Bronze Records" value={num(lastRun.bronzeRecords)} />
            <Row label="Silver Records" value={num(lastRun.silverRecords)} />
            <Row label="Gold Datasets" value={String(lastRun.goldDatasets)} />
            <Row label="Duration" value={`${lastRun.durationSec}s`} />
            <Row label="Quality Score" value={pct(96.4)} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell><Badge variant="secondary">{p.category}</Badge></TableCell>
                    <TableCell className="text-right">{num(p.unitsSold)}</TableCell>
                    <TableCell className="text-right font-medium">{inr(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Orders</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell className="max-w-[140px] truncate">{o.customerName}</TableCell>
                    <TableCell className="text-right">{inr(o.revenue)}</TableCell>
                    <TableCell>
                      <Badge variant={o.status === "Cancelled" ? "destructive" : "secondary"}>{o.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-b-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
