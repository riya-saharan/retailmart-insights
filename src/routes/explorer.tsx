import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import {
  orders, products, customers, monthlySales, pipelineRuns, qualityRules, rejectedRecords,
  revenueByCategory, salesByRegion,
} from "@/data";
import { exportCsv } from "@/lib/format";

export const Route = createFileRoute("/explorer")({ component: DataExplorer });

type Layer = "bronze" | "silver" | "gold";
const datasets: Record<Layer, { key: string; label: string; rows: Record<string, unknown>[] }[]> = {
  bronze: [
    { key: "orders_raw", label: "orders_raw", rows: orders as unknown as Record<string, unknown>[] },
    { key: "products_raw", label: "products_raw", rows: products as unknown as Record<string, unknown>[] },
    { key: "customers_raw", label: "customers_raw", rows: customers as unknown as Record<string, unknown>[] },
    { key: "rejected_raw", label: "rejected_raw", rows: rejectedRecords as unknown as Record<string, unknown>[] },
  ],
  silver: [
    { key: "orders_clean", label: "orders_clean", rows: orders as unknown as Record<string, unknown>[] },
    { key: "products_clean", label: "products_clean", rows: products as unknown as Record<string, unknown>[] },
    { key: "customers_clean", label: "customers_clean", rows: customers as unknown as Record<string, unknown>[] },
    { key: "quality_rules", label: "quality_rules", rows: qualityRules as unknown as Record<string, unknown>[] },
  ],
  gold: [
    { key: "monthly_sales", label: "monthly_sales", rows: monthlySales as unknown as Record<string, unknown>[] },
    { key: "revenue_by_category", label: "revenue_by_category", rows: revenueByCategory() as unknown as Record<string, unknown>[] },
    { key: "sales_by_region", label: "sales_by_region", rows: salesByRegion() as unknown as Record<string, unknown>[] },
    { key: "pipeline_runs", label: "pipeline_runs", rows: pipelineRuns as unknown as Record<string, unknown>[] },
  ],
};

function DataExplorer() {
  const [layer, setLayer] = useState<Layer>("gold");
  const [dsKey, setDsKey] = useState(datasets.gold[0].key);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const ds = datasets[layer].find((d) => d.key === dsKey) ?? datasets[layer][0];
  const rows = ds.rows;

  const filtered = useMemo(() => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
  }, [rows, search]);

  const columns = filtered[0] ? Object.keys(filtered[0]) : rows[0] ? Object.keys(rows[0]) : [];
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);

  const onLayer = (l: Layer) => { setLayer(l); setDsKey(datasets[l][0].key); setPage(1); };

  return (
    <div>
      <PageHeader
        title="Data Explorer"
        description="Query raw, cleaned and aggregated datasets across the medallion layers."
        actions={<Button onClick={() => exportCsv(`${ds.key}.csv`, filtered)}><Download className="mr-2 h-4 w-4" />Export CSV</Button>}
      />

      <Card className="mb-4">
        <CardContent className="grid gap-3 p-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Layer</label>
            <Select value={layer} onValueChange={(v) => onLayer(v as Layer)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">🥉 Bronze (Raw)</SelectItem>
                <SelectItem value="silver">🥈 Silver (Cleaned)</SelectItem>
                <SelectItem value="gold">🥇 Gold (Aggregated)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Dataset</label>
            <Select value={dsKey} onValueChange={(v) => { setDsKey(v); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {datasets[layer].map((d) => <SelectItem key={d.key} value={d.key}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Search</label>
            <Input placeholder="Search any field..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Rows per page</label>
            <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" />{layer}.{ds.key}</CardTitle>
            <Badge variant="secondary">{filtered.length} records</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((r, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c} className="max-w-[220px] truncate text-xs">{String(r[c])}</TableCell>
                  ))}
                </TableRow>
              ))}
              {!pageRows.length && <TableRow><TableCell colSpan={columns.length || 1} className="py-8 text-center text-muted-foreground">No records.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between p-4 text-sm">
          <span className="text-muted-foreground">Page {page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
