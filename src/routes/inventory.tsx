import { createFileRoute } from "@tanstack/react-router";
import { Boxes, AlertTriangle, XCircle, RefreshCw, IndianRupee } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { products, CATEGORIES } from "@/data";
import { inr, num } from "@/lib/format";

export const Route = createFileRoute("/inventory")({ component: InventoryAnalytics });

function InventoryAnalytics() {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.reorderLevel);
  const outOfStock = products.filter((p) => p.stock === 0);
  const reorder = [...lowStock, ...outOfStock];

  const byCategory = CATEGORIES.map((c) => {
    const list = products.filter((p) => p.category === c);
    return {
      category: c,
      units: list.reduce((s, p) => s + p.stock, 0),
      value: list.reduce((s, p) => s + p.stock * p.price, 0),
    };
  });

  return (
    <div>
      <PageHeader title="Inventory Analytics" description="Stock health, category exposure and reorder recommendations." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <KpiCard label="Total Units" value={num(totalUnits)} icon={Boxes} />
        <KpiCard label="Inventory Value" value={inr(totalValue)} icon={IndianRupee} tone="success" />
        <KpiCard label="Low Stock" value={num(lowStock.length)} icon={AlertTriangle} tone="warning" />
        <KpiCard label="Out of Stock" value={num(outOfStock.length)} icon={XCircle} tone="muted" />
        <KpiCard label="Needs Reorder" value={num(reorder.length)} icon={RefreshCw} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Stock Units by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="category" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip /><Legend />
                <Bar dataKey="units" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Inventory Value by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="category" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Low Stock Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Reorder At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStock.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-right"><Badge className="bg-warning text-warning-foreground">{p.stock}</Badge></TableCell>
                    <TableCell className="text-right">{p.reorderLevel}</TableCell>
                  </TableRow>
                ))}
                {!lowStock.length && <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">No low-stock items.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Reorder Recommendations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Suggested Qty</TableHead>
                  <TableHead className="text-right">Est. Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reorder.map((p) => {
                  const qty = p.reorderLevel * 2 - p.stock;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell className="text-right">{num(qty)}</TableCell>
                      <TableCell className="text-right">{inr(qty * p.price * 0.7)}</TableCell>
                    </TableRow>
                  );
                })}
                {!reorder.length && <TableRow><TableCell colSpan={4} className="py-6 text-center text-muted-foreground">All good!</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
