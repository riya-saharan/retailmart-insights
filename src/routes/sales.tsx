import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, BarChart, Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { monthlySales, orders, CATEGORIES, REGIONS, SEGMENTS, MONTHS } from "@/data";
import { exportCsv, inr, num } from "@/lib/format";

export const Route = createFileRoute("/sales")({ component: SalesAnalytics });

function SalesAnalytics() {
  const [month, setMonth] = useState("all");
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState("all");
  const [segment, setSegment] = useState("all");

  const filtered = useMemo(() => orders.filter((o) => {
    const m = MONTHS[new Date(o.date).getMonth()];
    return (month === "all" || m === month)
      && (category === "all" || o.category === category)
      && (region === "all" || o.region === region)
      && (segment === "all" || o.segment === segment);
  }), [month, category, region, segment]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => map.set(o.category, (map.get(o.category) ?? 0) + o.revenue));
    return Array.from(map, ([category, revenue]) => ({ category, revenue }));
  }, [filtered]);
  const byRegion = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => map.set(o.region, (map.get(o.region) ?? 0) + o.revenue));
    return Array.from(map, ([region, revenue]) => ({ region, revenue }));
  }, [filtered]);
  const bySegment = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((o) => map.set(o.segment, (map.get(o.segment) ?? 0) + o.revenue));
    return Array.from(map, ([segment, revenue]) => ({ segment, revenue }));
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Sales Analytics"
        description="Revenue, profit and orders across dimensions."
        actions={
          <Button onClick={() => exportCsv("sales.csv", filtered)}>
            <Download className="mr-2 h-4 w-4" />Export CSV
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 md:grid-cols-4">
          <Filter label="Month" value={month} onChange={setMonth} options={["all", ...MONTHS]} />
          <Filter label="Category" value={category} onChange={setCategory} options={["all", ...CATEGORIES]} />
          <Filter label="Region" value={region} onChange={setRegion} options={["all", ...REGIONS]} />
          <Filter label="Segment" value={segment} onChange={setSegment} options={["all", ...SEGMENTS]} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Revenue & Profit Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} />
                <Line type="monotone" dataKey="profit" stroke="#f97316" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Monthly Orders</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="category" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sales by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="region" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Sales by Segment</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bySegment} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <YAxis type="category" dataKey="segment" fontSize={11} width={110} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#22c55e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Recent Sales ({filtered.length})</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Profit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.id}</TableCell>
                  <TableCell>{o.date}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{o.productName}</TableCell>
                  <TableCell>{o.region}</TableCell>
                  <TableCell className="text-right">{num(o.quantity)}</TableCell>
                  <TableCell className="text-right">{inr(o.revenue)}</TableCell>
                  <TableCell className="text-right">{inr(o.profit)}</TableCell>
                  <TableCell><Badge variant={o.status === "Cancelled" ? "destructive" : "secondary"}>{o.status}</Badge></TableCell>
                </TableRow>
              ))}
              {!filtered.length && (
                <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No orders match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o === "all" ? "All" : o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
