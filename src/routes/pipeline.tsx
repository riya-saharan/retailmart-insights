import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Play, RotateCcw, FileSpreadsheet, Database, Sparkles, LayoutDashboard, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/PageHeader";
import { pipelineRuns } from "@/data";
import { num } from "@/lib/format";

export const Route = createFileRoute("/pipeline")({ component: DataPipeline });

type Stage = "idle" | "processing" | "completed";
interface LayerState { progress: number; status: Stage }

const initialLayers: Record<"bronze" | "silver" | "gold", LayerState> = {
  bronze: { progress: 100, status: "completed" },
  silver: { progress: 100, status: "completed" },
  gold: { progress: 100, status: "completed" },
};

function DataPipeline() {
  const [layers, setLayers] = useState(initialLayers);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearTimers = () => { timers.current.forEach(clearInterval); timers.current = []; };

  const runLayer = (key: "bronze" | "silver" | "gold") =>
    new Promise<void>((resolve) => {
      setLayers((prev) => ({ ...prev, [key]: { progress: 0, status: "processing" } }));
      const t = setInterval(() => {
        setLayers((prev) => {
          const cur = prev[key];
          const next = Math.min(100, cur.progress + 10);
          if (next >= 100) {
            clearInterval(t);
            resolve();
            return { ...prev, [key]: { progress: 100, status: "completed" } };
          }
          return { ...prev, [key]: { progress: next, status: "processing" } };
        });
      }, 120);
      timers.current.push(t);
    });

  const runPipeline = async () => {
    if (running) return;
    setRunning(true);
    setLayers({
      bronze: { progress: 0, status: "idle" },
      silver: { progress: 0, status: "idle" },
      gold: { progress: 0, status: "idle" },
    });
    await runLayer("bronze");
    await runLayer("silver");
    await runLayer("gold");
    setRunning(false);
    toast.success("Pipeline completed successfully", {
      description: "Bronze → Silver → Gold layers processed.",
    });
  };

  const resetPipeline = () => {
    clearTimers();
    setRunning(false);
    setLayers({
      bronze: { progress: 0, status: "idle" },
      silver: { progress: 0, status: "idle" },
      gold: { progress: 0, status: "idle" },
    });
    toast("Pipeline reset");
  };

  return (
    <div>
      <PageHeader
        title="Data Pipeline"
        description="Medallion architecture: Raw → Bronze → Silver → Gold → Analytics."
        actions={
          <>
            <Button variant="outline" onClick={resetPipeline}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
            <Button onClick={runPipeline} disabled={running}>
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
              Run Pipeline
            </Button>
          </>
        }
      />

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-9">
            <FlowNode icon={FileSpreadsheet} title="CSV / JSON / Excel" subtitle="Raw sources" tone="muted" />
            <FlowArrow />
            <FlowNode icon={Database} title="Bronze" subtitle="Raw ingested" progress={layers.bronze.progress} status={layers.bronze.status} tone="warning" />
            <FlowArrow />
            <FlowNode icon={Sparkles} title="Silver" subtitle="Cleaned" progress={layers.silver.progress} status={layers.silver.status} tone="primary" />
            <FlowArrow />
            <FlowNode icon={Sparkles} title="Gold" subtitle="Aggregated" progress={layers.gold.progress} status={layers.gold.status} tone="success" />
            <FlowArrow />
            <FlowNode icon={LayoutDashboard} title="Dashboard" subtitle="Analytics" tone="muted" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <LayerCard title="Bronze Layer" tone="warning" state={layers.bronze} rows={[
          ["Input records", "15,000"], ["Format", "Raw preserved"], ["Storage", "bronze.orders_raw"],
        ]} />
        <LayerCard title="Silver Layer" tone="primary" state={layers.silver} rows={[
          ["Valid records", "14,620"], ["Duplicates removed", "210"], ["Rejected", "170"],
        ]} />
        <LayerCard title="Gold Layer" tone="success" state={layers.gold} rows={[
          ["Analytical datasets", "8"], ["Business KPIs", "12"], ["Serves", "Dashboards"],
        ]} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Pipeline Execution History</CardTitle></CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Bronze</TableHead>
                <TableHead className="text-right">Silver</TableHead>
                <TableHead className="text-right">Gold</TableHead>
                <TableHead>Triggered By</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pipelineRuns.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.startedAt}</TableCell>
                  <TableCell>{r.durationSec}s</TableCell>
                  <TableCell className="text-right">{num(r.bronzeRecords)}</TableCell>
                  <TableCell className="text-right">{num(r.silverRecords)}</TableCell>
                  <TableCell className="text-right">{r.goldDatasets}</TableCell>
                  <TableCell className="capitalize">{r.triggeredBy}</TableCell>
                  <TableCell>
                    <Badge className={
                      r.status === "Success" ? "bg-success text-success-foreground"
                        : r.status === "Failed" ? "bg-destructive text-destructive-foreground"
                        : "bg-warning text-warning-foreground"
                    }>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function FlowArrow() {
  return <div className="hidden items-center justify-center md:flex"><ArrowRight className="h-5 w-5 text-muted-foreground" /></div>;
}

function FlowNode({ icon: Icon, title, subtitle, progress, status, tone }: {
  icon: React.ElementType; title: string; subtitle: string; progress?: number; status?: Stage;
  tone: "primary" | "warning" | "success" | "muted";
}) {
  const toneCls = {
    primary: "border-primary/40 bg-primary/5 text-primary",
    warning: "border-warning/40 bg-warning/5 text-warning",
    success: "border-success/40 bg-success/5 text-success",
    muted: "border-border bg-muted/40 text-muted-foreground",
  }[tone];
  return (
    <div className={`rounded-lg border-2 ${toneCls} p-3 text-center`}>
      <Icon className="mx-auto h-6 w-6" />
      <div className="mt-1 text-sm font-semibold text-foreground">{title}</div>
      <div className="text-xs text-muted-foreground">{subtitle}</div>
      {typeof progress === "number" && (
        <div className="mt-2">
          <Progress value={progress} className="h-1.5" />
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
            {status === "completed" ? <><CheckCircle2 className="h-3 w-3 text-success" />Completed</>
              : status === "processing" ? <><Loader2 className="h-3 w-3 animate-spin" />{progress}%</>
              : <>Idle</>}
          </div>
        </div>
      )}
    </div>
  );
}

function LayerCard({ title, state, rows, tone }: {
  title: string; state: LayerState; rows: [string, string][];
  tone: "primary" | "warning" | "success";
}) {
  const toneBadge = { primary: "bg-primary text-primary-foreground", warning: "bg-warning text-warning-foreground", success: "bg-success text-success-foreground" }[tone];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge className={toneBadge}>
            {state.status === "completed" ? "Completed" : state.status === "processing" ? `${state.progress}%` : "Idle"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={state.progress} />
        <div className="space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border pb-1.5 last:border-b-0">
              <span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
