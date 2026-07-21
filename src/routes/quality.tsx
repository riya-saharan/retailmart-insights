import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend,
} from "recharts";
import { ShieldCheck, CheckCircle2, Fingerprint, Ruler, Layers, Copy, CircleAlert, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { KpiCard } from "@/components/KpiCard";
import { qualityRules, rejectedRecords, qualityTrend } from "@/data";
import { num } from "@/lib/format";

export const Route = createFileRoute("/quality")({ component: DataQuality });

function DataQuality() {
  const dimensions = [
    { name: "Completeness", value: 97.8 },
    { name: "Uniqueness", value: 98.6 },
    { name: "Validity", value: 95.9 },
    { name: "Consistency", value: 93.4 },
  ];
  const issues = [
    { name: "Duplicates", count: 210 },
    { name: "Missing", count: 125 },
    { name: "Rejected", count: 170 },
    { name: "Invalid Email", count: 90 },
    { name: "Unknown Region", count: 70 },
  ];
  const scoreData = [{ name: "Quality", value: 96.4, fill: "#22c55e" }];

  return (
    <div>
      <PageHeader title="Data Quality" description="Monitoring completeness, uniqueness, validity and consistency across layers." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Overall Quality" value="96.4%" icon={ShieldCheck} tone="success" />
        <KpiCard label="Completeness" value="97.8%" icon={CheckCircle2} tone="primary" />
        <KpiCard label="Uniqueness" value="98.6%" icon={Fingerprint} tone="primary" />
        <KpiCard label="Validity" value="95.9%" icon={Ruler} tone="warning" />
        <KpiCard label="Consistency" value="93.4%" icon={Layers} tone="warning" />
        <KpiCard label="Duplicates" value="210" icon={Copy} tone="warning" />
        <KpiCard label="Missing Values" value="125" icon={CircleAlert} tone="warning" />
        <KpiCard label="Rejected Records" value="170" icon={XCircle} tone="muted" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Overall Quality Score</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={scoreData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} background />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-3xl font-bold">96.4%</text>
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quality Dimensions</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dimensions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} domain={[80, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Data Issues</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={issues}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quality Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={qualityTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} domain={[90, 100]} />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="quality" stroke="#22c55e" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Data Quality Rules</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule</TableHead>
                  <TableHead>Dimension</TableHead>
                  <TableHead className="text-right">Passed</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualityRules.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.dimension}</TableCell>
                    <TableCell className="text-right">{num(r.passed)}</TableCell>
                    <TableCell className="text-right">{num(r.failed)}</TableCell>
                    <TableCell>
                      <Badge className={
                        r.status === "Pass" ? "bg-success text-success-foreground"
                          : r.status === "Warn" ? "bg-warning text-warning-foreground"
                          : "bg-destructive text-destructive-foreground"
                      }>{r.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rejected Records</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedRecords.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id}</TableCell>
                    <TableCell>{r.sourceTable}</TableCell>
                    <TableCell>{r.rule}</TableCell>
                    <TableCell className="text-muted-foreground">{r.reason}</TableCell>
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
