import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Users, UserPlus, Repeat, Wallet, Percent } from "lucide-react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { customers, customersBySegment, customersByRegion, REGIONS, SEGMENTS } from "@/data";
import { exportCsv, inr, num } from "@/lib/format";

export const Route = createFileRoute("/customers")({ component: CustomerAnalytics });
const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#a855f7", "#ef4444"];

function CustomerAnalytics() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [segment, setSegment] = useState("all");

  const filtered = useMemo(() => customers.filter((c) =>
    (region === "all" || c.region === region) &&
    (segment === "all" || c.segment === segment) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  ), [search, region, segment]);

  const total = customers.length;
  const newC = customers.filter((c) => c.status === "New").length;
  const ret = customers.filter((c) => c.status !== "New").length;
  const avgLtv = customers.reduce((s, c) => s + c.lifetimeValue, 0) / customers.length;
  const retention = (ret / total) * 100;

  return (
    <div>
      <PageHeader
        title="Customer Analytics"
        description="Understand customer segments, lifetime value and retention."
        actions={<Button onClick={() => exportCsv("customers.csv", filtered)}><Download className="mr-2 h-4 w-4" />Export CSV</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Total Customers" value={num(total)} icon={Users} />
        <KpiCard label="New Customers" value={num(newC)} icon={UserPlus} tone="warning" />
        <KpiCard label="Returning" value={num(ret)} icon={Repeat} tone="success" />
        <KpiCard label="Avg Lifetime Value" value={inr(avgLtv)} icon={Wallet} tone="primary" />
        <KpiCard label="Retention Rate" value={`${retention.toFixed(1)}%`} icon={Percent} tone="success" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Customer Segments</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={customersBySegment()} dataKey="count" nameKey="segment"
                  cx="50%" cy="50%" outerRadius={100}>
                  {customersBySegment().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend /><Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Customers by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={customersByRegion()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="region" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center sm:justify-between">
            <CardTitle>Top Customers</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Input placeholder="Search customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-56" />
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All regions</SelectItem>
                  {REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All segments</SelectItem>
                  {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">LTV</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...filtered].sort((a, b) => b.lifetimeValue - a.lifetimeValue).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell>{c.region}</TableCell>
                  <TableCell>{c.segment}</TableCell>
                  <TableCell className="text-right">{num(c.totalOrders)}</TableCell>
                  <TableCell className="text-right">{inr(c.totalSpent)}</TableCell>
                  <TableCell className="text-right font-medium">{inr(c.lifetimeValue)}</TableCell>
                  <TableCell><Badge variant={c.status === "VIP" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
              {!filtered.length && <TableRow><TableCell colSpan={9} className="py-8 text-center text-muted-foreground">No customers found.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
