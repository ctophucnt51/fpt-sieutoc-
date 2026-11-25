"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminHeaders } from "@/lib/clientAdminAuth";
import {
  Brain,
  RefreshCw,
  Send,
  Globe,
  KeyRound,
  Swords,
  Wrench,
  FileText,
  Bot,
  ListTodo,
  CheckSquare,
  History,
  TrendingUp,
  Target,
  Gauge,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface SeoIntelligenceCenterProps {
  showToast: (msg: string, type?: "success" | "error") => void;
}

type SubModule =
  | "overview"
  | "inventory"
  | "keywords"
  | "competitors"
  | "technical"
  | "content"
  | "agents"
  | "tasks"
  | "approvals"
  | "changes"
  | "performance"
  | "conversions"
  | "api_usage";

const MODULES: { id: SubModule; label: string; icon: any }[] = [
  { id: "overview", label: "SEO Overview", icon: Brain },
  { id: "inventory", label: "Website Inventory", icon: Globe },
  { id: "keywords", label: "Keyword Management", icon: KeyRound },
  { id: "competitors", label: "Competitor Research", icon: Swords },
  { id: "technical", label: "Technical Issues", icon: Wrench },
  { id: "content", label: "Content Management", icon: FileText },
  { id: "agents", label: "Agent Management", icon: Bot },
  { id: "tasks", label: "Task Queue", icon: ListTodo },
  { id: "approvals", label: "Approval Center", icon: CheckSquare },
  { id: "changes", label: "Change History", icon: History },
  { id: "performance", label: "Performance Reports", icon: TrendingUp },
  { id: "conversions", label: "Conversion Reports", icon: Target },
  { id: "api_usage", label: "API Usage", icon: Gauge },
];

export default function SeoIntelligenceCenter({ showToast }: SeoIntelligenceCenterProps) {
  const [activeModule, setActiveModule] = useState<SubModule>("overview");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [runningCycle, setRunningCycle] = useState(false);

  // Add Keyword Mapping form
  const [newKw, setNewKw] = useState("");
  const [newUrl, setNewUrl] = useState("/lap-mang-fpt");
  const [newIntent, setNewIntent] = useState<"local" | "transactional" | "informational">("local");
  const [newPriority, setNewPriority] = useState<"P0" | "P1" | "P2">("P1");

  // Propose Meta Override form (for Approval Center)
  const [metaRoute, setMetaRoute] = useState("/lap-mang-fpt");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");

  const fetchIntelligence = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo/intelligence", {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.intelligence);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntelligence();
  }, [fetchIntelligence]);

  const callAction = async (payload: Record<string, any>, successFallback?: string) => {
    setRunningCycle(true);
    try {
      const res = await fetch("/api/admin/seo/intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAdminHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.intelligence) setData(json.intelligence);
      if (res.ok && json.success) {
        showToast(json.message || successFallback || "Thành công!");
      } else {
        showToast(json.message || "Có lỗi xảy ra.", "error");
      }
    } catch {
      showToast("Không thể kết nối máy chủ.", "error");
    } finally {
      setRunningCycle(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-fpt-orange" />
        <span>Đang tải SEO Intelligence Memory...</span>
      </div>
    );
  }

  if (!data) return null;

  const pendingTasksCount = (data.tasks || []).filter((t: any) => t.status === "pending").length;
  const pendingApprovalsCount = (data.approvals || []).filter((a: any) => a.status === "pending").length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-orange-50/60 via-white to-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-fpt-orange" />
            <span>GOFPT SEO Intelligence Center (13 Phân Hệ • 8 AI Agents)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bộ nhớ bền vững <code className="text-slate-700">data/seo-memory/</code> • QA &amp; Google Ads Safety Gate
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={runningCycle}
            onClick={() => callAction({ action: "run_orchestrator" })}
            className="px-3.5 py-2 rounded-xl bg-fpt-orange hover:bg-fpt-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${runningCycle ? "animate-spin" : ""}`} />
            <span>Chạy Chu Trình Master Agent</span>
          </button>
          <button
            type="button"
            disabled={runningCycle}
            onClick={() => callAction({ action: "send_telegram_report" })}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi Báo Cáo Telegram</span>
          </button>
        </div>
      </div>

      {/* 13 Module Navigation Pills */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70 flex flex-wrap gap-1.5">
        {MODULES.map((m) => {
          const Icon = m.icon;
          const active = activeModule === m.id;
          const badge =
            m.id === "tasks" && pendingTasksCount > 0
              ? pendingTasksCount
              : m.id === "approvals" && pendingApprovalsCount > 0
              ? pendingApprovalsCount
              : null;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveModule(m.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                active
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
              {badge !== null && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9.5px] font-black">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Module Content Area */}
      <div className="p-4 sm:p-5 text-xs">
        {activeModule === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">URL Indexable</div>
                <div className="text-xl font-black text-slate-900 mt-1">{data.inventory.length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Keyword Mapping</div>
                <div className="text-xl font-black text-fpt-orange mt-1">{data.keywords.length}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Lead Organic / Tổng</div>
                <div className="text-xl font-black text-emerald-700 mt-1">
                  {data.conversions.organicLeads} / {data.conversions.totalLeads}
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] text-slate-500 font-semibold">Nhiệm vụ chờ xử lý</div>
                <div className="text-xl font-black text-red-600 mt-1">{pendingTasksCount}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2">
              <div className="font-bold text-slate-900">Trạng thái kết nối dữ liệu thực (Không dùng dữ liệu giả):</div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${data.connections.gscConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  GSC API: {data.connections.gscConnected ? "Đã kết nối" : "Chưa kết nối"}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${data.connections.serperConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  Serper.dev SERP: {data.connections.serperConnected ? "Đã kết nối" : "Chưa kết nối"}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${data.connections.ga4Configured ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                  GA4 Property: {data.connections.ga4Configured ? "Đã gắn ID" : "Chưa cấu hình"}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeModule === "inventory" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2 pr-3">Route</th>
                  <th className="py-2 px-3">Loại</th>
                  <th className="py-2 px-3">Canonical</th>
                  <th className="py-2 pl-3">Tiêu đề</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.inventory.map((item: any) => (
                  <tr key={item.route}>
                    <td className="py-2 pr-3 font-mono font-bold text-slate-800">{item.route}</td>
                    <td className="py-2 px-3 uppercase text-[10px] font-bold text-slate-500">{item.type}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {item.hasCanonical ? "Có" : "Thiếu"}
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-slate-700">{item.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeModule === "keywords" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <input
                type="text"
                value={newKw}
                onChange={(e) => setNewKw(e.target.value)}
                placeholder="Từ khóa (VD: lắp mạng fpt ninh kiều)"
                className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              />
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="/url-dich"
                className="w-44 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono"
              />
              <select
                value={newIntent}
                onChange={(e) => setNewIntent(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="local">Local</option>
                <option value="transactional">Transactional</option>
                <option value="informational">Informational</option>
              </select>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  callAction({
                    action: "add_keyword_map",
                    keyword: newKw,
                    targetUrl: newUrl,
                    intent: newIntent,
                    priority: newPriority,
                  });
                  setNewKw("");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                    <th className="py-2 pr-3">Từ khóa</th>
                    <th className="py-2 px-3">URL Đích (1:1)</th>
                    <th className="py-2 px-3">Intent</th>
                    <th className="py-2 px-3">Ưu tiên</th>
                    <th className="py-2 pl-3 text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.keywords.map((k: any) => (
                    <tr key={k.id}>
                      <td className="py-2 pr-3 font-bold text-slate-900">{k.keyword}</td>
                      <td className="py-2 px-3 font-mono text-blue-700">{k.targetUrl}</td>
                      <td className="py-2 px-3 uppercase text-[10px] font-bold">{k.intent}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded bg-orange-50 text-fpt-orange font-black text-[10px]">
                          {k.priority}
                        </span>
                      </td>
                      <td className="py-2 pl-3 text-right">
                        <button
                          type="button"
                          onClick={() => callAction({ action: "delete_keyword_map", id: k.id })}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeModule === "competitors" && (
          <div>
            {data.competitors.length === 0 ? (
              <p className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-slate-600">
                Chưa có dữ liệu đối thủ. Hãy kết nối Serper.dev API bên dưới và bấm &ldquo;Kiểm tra thứ hạng&rdquo; để soi Top 3 đối thủ thực tế tại Cần Thơ.
              </p>
            ) : (
              <div className="space-y-3">
                {data.competitors.map((c: any) => (
                  <div key={c.keyword} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="font-bold text-slate-900 mb-2">Từ khóa: {c.keyword}</div>
                    <div className="space-y-1">
                      {c.topDomains.map((d: any) => (
                        <div key={d.position} className="flex items-center gap-2 text-[11px]">
                          <span className="font-black text-fpt-orange">#{d.position}</span>
                          <span className="font-bold text-slate-800">{d.domain}</span>
                          <span className="text-slate-500 truncate">— {d.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeModule === "technical" && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900">Tình trạng Technical SEO &amp; Bảo vệ Chính sách Google Ads:</div>
            <ul className="space-y-1 text-slate-700 list-disc pl-5">
              <li>Canonical Tags: Đã bật chuẩn `https://gofpt.vn` trên tất cả 14 route public.</li>
              <li>Robots &amp; Noindex: Đã chặn `/admin` và `/cam-on` khỏi Google Index.</li>
              <li>Schema JSON-LD: Đã kích hoạt `LocalBusiness`, `WebSite`, `FAQPage`, `NewsArticle`.</li>
              <li>QA Guard: Đang bảo vệ không dùng từ cấm (`tuyệt đối`, `trọn đời`, `giảm 99%`). Bấm &ldquo;Quét Toàn Bộ Website&rdquo; bên dưới để kiểm tra live HTML.</li>
            </ul>
          </div>
        )}

        {activeModule === "content" && (
          <div className="space-y-3">
            <div className="font-bold text-slate-900">
              Nguồn tri thức chuẩn (`fpt_knowledge.json`): Địa chỉ {data.fptKnowledge?.address} • Hotline {data.fptKnowledge?.hotline}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.inventory
                .filter((i: any) => i.route.startsWith("/tin-tuc/"))
                .map((art: any) => (
                  <div key={art.route} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="font-bold text-slate-900">{art.title}</div>
                    <div className="font-mono text-[11px] text-slate-500 mt-1">{art.route}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeModule === "agents" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.agents.map((ag: any) => (
              <div key={ag.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">{ag.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ag.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : ag.status === "ready"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ag.status === "active" ? "Hoạt động" : ag.status === "ready" ? "Sẵn sàng" : "Chờ API Key"}
                  </span>
                </div>
                <div className="text-slate-700">{ag.role}</div>
                <div className="text-[11px] text-slate-500">Quyền: {ag.permissions}</div>
              </div>
            ))}
          </div>
        )}

        {activeModule === "tasks" && (
          <div className="space-y-2.5">
            {data.tasks.length === 0 ? (
              <p className="text-slate-500">Chưa có nhiệm vụ nào. Bấm &ldquo;Chạy Chu Trình Master Agent&rdquo; ở trên.</p>
            ) : (
              data.tasks.map((t: any) => (
                <div key={t.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-orange-100 text-fpt-orange font-black text-[10px]">{t.priority}</span>
                      <span className="font-bold text-slate-900">{t.title}</span>
                      <span className="text-[10.5px] font-semibold text-slate-500">({t.ownerAgent})</span>
                    </div>
                    <div className="text-[11px] text-slate-600">Bằng chứng: {t.evidence} • Chi phí: {t.estimatedCost}</div>
                    <div className="text-[11px] text-emerald-700">Tiêu chí: {t.acceptanceCriteria}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.status !== "completed" ? (
                      <button
                        type="button"
                        onClick={() => callAction({ action: "update_task_status", id: t.id, status: "completed" })}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] cursor-pointer"
                      >
                        Hoàn tất
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                        Đã xong
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeModule === "approvals" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900">Tạo đề xuất tối ưu Meta Title / Description (Đi qua QA Gate trước khi duyệt):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={metaRoute}
                  onChange={(e) => setMetaRoute(e.target.value)}
                  placeholder="/lap-mang-fpt"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono"
                />
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Title mới (55-65 ký tự)"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
                <input
                  type="text"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  placeholder="Description mới (150-160 ký tự)"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  callAction({
                    action: "propose_meta_approval",
                    route: metaRoute,
                    title: metaTitle,
                    description: metaDesc,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold cursor-pointer"
              >
                Gửi vào Approval Center
              </button>
            </div>

            {data.approvals.length === 0 ? (
              <p className="text-slate-500">Chưa có đề xuất nào đang chờ duyệt.</p>
            ) : (
              data.approvals.map((a: any) => (
                <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{a.summary}</span>
                      {a.qaPassed ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">QA Đạt</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> QA Cảnh báo
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{a.qaNotes} • Trạng thái: <strong>{a.status}</strong></div>
                  </div>
                  {a.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => callAction({ action: "decide_approval", id: a.id, decision: "approve" })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Duyệt
                      </button>
                      <button
                        type="button"
                        onClick={() => callAction({ action: "decide_approval", id: a.id, decision: "reject" })}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeModule === "changes" && (
          <div className="space-y-2.5">
            {data.changes.length === 0 ? (
              <p className="text-slate-500">Chưa có thay đổi nào được áp dụng qua Approval Center.</p>
            ) : (
              data.changes.map((c: any) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-900">{c.changeType} → {c.target}</div>
                    <div className="text-[11px] text-slate-500">Áp dụng bởi {c.appliedBy} lúc {new Date(c.appliedAt).toLocaleString("vi-VN")}</div>
                  </div>
                  {!c.rolledBack ? (
                    <button
                      type="button"
                      onClick={() => callAction({ action: "rollback_change", id: c.id })}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Rollback
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-bold">Đã Rollback</span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeModule === "performance" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                  <th className="py-2 pr-3">Ngày</th>
                  <th className="py-2 px-3">GSC Clicks</th>
                  <th className="py-2 px-3">Impressions</th>
                  <th className="py-2 px-3">Organic Sessions</th>
                  <th className="py-2 pl-3">Organic Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.performance.map((p: any) => (
                  <tr key={p.date}>
                    <td className="py-2 pr-3 font-mono font-bold">{p.date}</td>
                    <td className="py-2 px-3">{p.clicks}</td>
                    <td className="py-2 px-3">{p.impressions}</td>
                    <td className="py-2 px-3 font-bold text-blue-700">{p.organicSessions}</td>
                    <td className="py-2 pl-3 font-bold text-emerald-700">{p.organicLeads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeModule === "conversions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-2">Chuyển đổi theo Trang đích (Ẩn danh PII)</div>
              {data.conversions.byLandingPage.length === 0 ? (
                <p className="text-slate-500">Chưa có dữ liệu đơn.</p>
              ) : (
                <div className="space-y-1.5">
                  {data.conversions.byLandingPage.map((row: any) => (
                    <div key={row.path} className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-800">{row.path}</span>
                      <span className="font-bold text-emerald-700">{row.organicLeads} organic / {row.totalLeads} tổng</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-900 mb-2">Từ khóa mang lại đơn đăng ký</div>
              {data.conversions.topKeywords.length === 0 ? (
                <p className="text-slate-500">Chưa có từ khóa chuyển đổi.</p>
              ) : (
                <div className="space-y-1.5">
                  {data.conversions.topKeywords.map((kw: any) => (
                    <div key={kw.keyword} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{kw.keyword}</span>
                      <span className="font-bold text-fpt-orange">{kw.count} đơn</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeModule === "api_usage" && (
          <div className="space-y-2">
            <div className="font-bold text-slate-900">
              Hạn mức API ngày {data.apiUsage?.dayKey} (Tháng {data.apiUsage?.monthKey})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(data.apiUsage?.dailyLimits || {}).map(([k, limit]: any) => {
                const used = data.apiUsage?.dailyCounts?.[k] || 0;
                return (
                  <div key={k} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="uppercase font-bold text-[10.5px] text-slate-500">{k}</div>
                    <div className="text-base font-black text-slate-900 mt-1">
                      {used} / {limit} <span className="text-[11px] font-normal text-slate-500">lượt/ngày</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
