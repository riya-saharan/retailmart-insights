import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, ArrowUpDown, Package, TrendingUp, IndianRupee, Boxes } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { products, revenueByCategory, CATEGORIES, type Product } from "@/data";
import { exportCsv, inr, num, pct } from "@/lib/format";

export const Route = createFileRoute("/products")({ component: ProductAnalytics });

type SortKey = keyof Pick<Product, "name" | "category" | "unitsSold" | "revenue" | "profit" | "stock">;

function ProductAnalytics() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
      return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [search, cat, sortKey, asc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
  const totalProfit = products.reduce((s, p) => s + p.profit, 0);
  const totalUnits = products.reduce((s, p) => s + p.unitsSold, 0);

  const topChart = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const sortBy = (key: SortKey) => { if (key === sortKey) setAsc(!asc); else { setSortKey(key); setAsc(false); } };

  const status = (p: Product) => {
    if (p.stock === 0) return { label: "Out of Stock", cls: "destructive" as const };
    if (p.revenue > 800000) return { label: "Star", cls: "default" as const };
    if (p.profit < 80000) return { label: "Underperforming", cls: "secondary" as const };
    return { label: "Healthy", cls: "secondary" as const };
  };

  return (
    <div>
      <PageHeader
        title="Product Analytics"
        description="Product performance, categories and inventory posture."
        actions={
          <Button onClick={() => exportCsv("products.csv", filtered.map((p) => ({
            ...p, profitMargin: ((p.profit / p.revenue) * 100).toFixed(2) + "%", status: status(p).label,
          })))}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Total Products" value={num(products.length)} icon={Package} />
        <KpiCard label="Total Revenue" value={inr(totalRevenue)} icon={IndianRupee} tone="success" />
        <KpiCard label="Total Profit" value={inr(totalProfit)} icon={TrendingUp} tone="success" />
        <KpiCard label="Units Sold" value={num(totalUnits)} icon={Boxes} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top Products by Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topChart} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <YAxis type="category" dataKey="name" fontSize={11} width={140} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCategory()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="category" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => inr(v as number)} />
                <Tooltip formatter={(v: number) => inr(v)} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:items-center sm:justify-between">
            <CardTitle>All Products</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Search product..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full sm:w-56" />
              <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <SortableHead label="Product Name" k="name" onSort={sortBy} />
                <SortableHead label="Category" k="category" onSort={sortBy} />
                <TableHead>Subcategory</TableHead>
                <SortableHead label="Units Sold" k="unitsSold" onSort={sortBy} right />
                <SortableHead label="Revenue" k="revenue" onSort={sortBy} right />
                <SortableHead label="Profit" k="profit" onSort={sortBy} right />
                <TableHead className="text-right">Margin</TableHead>
                <SortableHead label="Stock" k="stock" onSort={sortBy} right />
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((p) => {
                const st = status(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-muted-foreground">{p.subcategory}</TableCell>
                    <TableCell className="text-right">{num(p.unitsSold)}</TableCell>
                    <TableCell className="text-right font-medium">{inr(p.revenue)}</TableCell>
                    <TableCell className="text-right">{inr(p.profit)}</TableCell>
                    <TableCell className="text-right">{pct((p.profit / p.revenue) * 100)}</TableCell>
                    <TableCell className="text-right">{num(p.stock)}</TableCell>
                    <TableCell><Badge variant={st.cls}>{st.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
              {!pageData.length && (
                <TableRow><TableCell colSpan={10} className="py-8 text-center text-muted-foreground">No products found.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between p-4 text-sm">
          <span className="text-muted-foreground">Page {page} of {pageCount} · {filtered.length} products</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SortableHead({ label, k, onSort, right }: { label: string; k: SortKey; onSort: (k: SortKey) => void; right?: boolean }) {
  return (
    <TableHead className={right ? "text-right" : ""}>
      <button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => onSort(k)}>
        {label}<ArrowUpDown className="h-3 w-3" />
      </button>
    </TableHead>
  );
}
