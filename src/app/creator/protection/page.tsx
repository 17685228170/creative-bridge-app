"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Search,
  FileText,
  Zap,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Eye,
  Ban,
  Gavel,
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Globe,
  ShoppingCart,
  MessageSquare,
  Download,
  MoreHorizontal,
  Filter
} from "lucide-react";

// 统计数据
const stats = {
  monitoring: 12,
  processing: 3,
  completed: 28,
  successRate: 75,
  riskScore: 23,
  weeklyChange: -5,
  totalProtected: 156,
  estimatedSaved: 284000,
};

// 侵权线索
const violations = [
  {
    id: 1,
    level: "high",
    workName: "智能水杯概念设计",
    workImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200",
    platform: "某宝网",
    platformIcon: "🛒",
    link: "https://item.taobao.com/item.htm?id=123456",
    similarity: 89,
    foundTime: "2小时前",
    sales: 200,
    price: 158,
    estimatedLoss: 31600,
    status: "pending",
    evidence: [
      { type: "screenshot", url: "#" },
      { type: "comparison", url: "#" }
    ]
  },
  {
    id: 2,
    level: "high",
    workName: "模块化智能花盆设计",
    workImage: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200",
    platform: "拼XX",
    platformIcon: "📱",
    link: "https://mobile.yangkeduo.com/goods.html?goods_id=789",
    similarity: 82,
    foundTime: "5小时前",
    sales: 150,
    price: 89,
    estimatedLoss: 13350,
    status: "pending",
    evidence: [
      { type: "screenshot", url: "#" }
    ]
  },
  {
    id: 3,
    level: "medium",
    workName: "极简台灯设计",
    workImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200",
    platform: "某东",
    platformIcon: "📦",
    link: "https://item.jd.com/456.html",
    similarity: 67,
    foundTime: "1天前",
    sales: 50,
    price: 299,
    estimatedLoss: 14950,
    status: "monitoring",
    evidence: [
      { type: "screenshot", url: "#" }
    ]
  },
  {
    id: 4,
    level: "medium",
    workName: "无线充电器设计",
    workImage: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=200",
    platform: "抖店",
    platformIcon: "🎵",
    link: "https://www.douyin.com/shop/123",
    similarity: 71,
    foundTime: "2天前",
    sales: 80,
    price: 129,
    estimatedLoss: 10320,
    status: "monitoring",
    evidence: []
  },
];

// 进行中的案件
const cases = [
  {
    id: 1,
    title: "某宝网智能水杯侵权案",
    platform: "某宝网",
    product: "智能水杯同款设计",
    status: "lawyer_sent",
    progress: 2,
    totalSteps: 4,
    lastUpdate: "3天前",
    nextStep: "等待对方回应（预计2-7天）",
    compensation: null,
    lawyer: "张律师",
    caseNo: "CASE20260315001",
    startDate: "2026-03-10",
  },
  {
    id: 2,
    title: "某多多花盆设计侵权案",
    platform: "某多多",
    product: "模块化智能花盆",
    status: "platform_removed",
    progress: 3,
    totalSteps: 4,
    lastUpdate: "1天前",
    compensation: "¥15,000（协商中）",
    lawyer: "李律师",
    caseNo: "CASE20260308002",
    startDate: "2026-03-08",
  },
  {
    id: 3,
    title: "某东台灯设计侵权案",
    platform: "某东",
    product: "极简台灯",
    status: "completed",
    progress: 4,
    totalSteps: 4,
    lastUpdate: "已完成",
    compensation: "¥8,000（已到账）",
    lawyer: "王律师",
    caseNo: "CASE20260228003",
    startDate: "2026-02-28",
  },
];

// 维权步骤
const protectionSteps = [
  { id: 1, title: "智能监测", desc: "AI全网扫描侵权线索", icon: <Search className="w-5 h-5" /> },
  { id: 2, title: "证据固定", desc: "区块链存证侵权证据", icon: <FileText className="w-5 h-5" /> },
  { id: 3, title: "平台投诉", desc: "快速下架侵权商品", icon: <Zap className="w-5 h-5" /> },
  { id: 4, title: "律师函", desc: "正式法律警告", icon: <Gavel className="w-5 h-5" /> },
  { id: 5, title: "诉讼维权", desc: "法院起诉索赔", icon: <Shield className="w-5 h-5" /> },
];

export default function ProtectionCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [filterLevel, setFilterLevel] = useState<string | null>(null);

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-green-600";
    if (score < 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskBgColor = (score: number) => {
    if (score < 30) return "bg-green-500";
    if (score < 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getViolationBadge = (level: string) => {
    if (level === "high") {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          高风险
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        中风险
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-gray-600">未处理</Badge>;
      case "monitoring":
        return <Badge className="bg-blue-100 text-blue-700">监测中</Badge>;
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-700">处理中</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCaseStatusText = (status: string) => {
    switch (status) {
      case "lawyer_sent":
        return "律师函已发送";
      case "platform_removed":
        return "平台已下架";
      case "completed":
        return "案件已结案";
      default:
        return status;
    }
  };

  const filteredViolations = filterLevel 
    ? violations.filter(v => v.level === filterLevel)
    : violations;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/creator")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">维权中心</h1>
              <p className="text-xs text-gray-500">智能监测 · 快速维权</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <MessageSquare className="w-4 h-4 mr-1" />
              咨询法务
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 风险指数卡片 */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm">当前风险指数</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{stats.riskScore}</span>
                    <span className="text-indigo-200">/100</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-indigo-100">低风险</span>
                    <span className="flex items-center text-green-300 text-sm">
                      <TrendingDown className="w-4 h-4 mr-0.5" />
                      较上周下降 {Math.abs(stats.weeklyChange)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-indigo-100 text-sm">已保护作品</p>
                <p className="text-2xl font-bold">{stats.totalProtected}</p>
                <p className="text-indigo-100 text-sm mt-2">累计挽回损失</p>
                <p className="text-xl font-bold text-green-300">¥{(stats.estimatedSaved / 10000).toFixed(1)}万</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getRiskBgColor(stats.riskScore)} transition-all`}
                style={{ width: `${stats.riskScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.monitoring}</p>
                  <p className="text-xs text-gray-500">监测中</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                  <p className="text-xs text-gray-500">处理中</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                  <p className="text-xs text-gray-500">已完成</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                  <p className="text-xs text-gray-500">成功率</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 维权流程 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">维权流程</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              {protectionSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-2">
                      {step.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                  {idx < protectionSteps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="violations">
              侵权线索 ({violations.filter(v => v.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="cases">我的案件 ({cases.length})</TabsTrigger>
          </TabsList>

          {/* 概览 Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* 最新侵权线索 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    最新侵权线索
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {violations.slice(0, 2).map((v) => (
                    <div
                      key={v.id}
                      className="p-4 border rounded-xl hover:border-red-300 transition-colors cursor-pointer"
                      onClick={() => setActiveTab("violations")}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={v.workImage} 
                          alt={v.workName}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            {getViolationBadge(v.level)}
                            <span className="text-xs text-gray-400">{v.foundTime}</span>
                          </div>
                          <p className="font-medium text-gray-900 truncate">{v.workName}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>{v.platformIcon} {v.platform}</span>
                            <span>•</span>
                            <span>相似度 {v.similarity}%</span>
                          </div>
                          <p className="text-sm text-red-600 mt-1">
                            预估损失 ¥{v.estimatedLoss.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 进行中的案件 */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-indigo-600" />
                    进行中的案件
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {cases.filter(c => c.status !== "completed").map((c) => (
                    <div key={c.id} className="p-4 border rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{c.title}</p>
                          <p className="text-sm text-gray-500">案件编号：{c.caseNo}</p>
                        </div>
                        {getStatusBadge(c.status)}
                      </div>
                      <p className="text-sm text-indigo-600 mb-2">
                        当前状态：{getCaseStatusText(c.status)}
                      </p>
                      {c.nextStep && (
                        <p className="text-xs text-gray-500 mb-3">下一步：{c.nextStep}</p>
                      )}
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span className={c.progress >= 1 ? "text-indigo-600 font-medium" : ""}>取证</span>
                          <span className={c.progress >= 2 ? "text-indigo-600 font-medium" : ""}>投诉</span>
                          <span className={c.progress >= 3 ? "text-indigo-600 font-medium" : ""}>律师函</span>
                          <span className={c.progress >= 4 ? "text-indigo-600 font-medium" : ""}>完成</span>
                        </div>
                        <Progress value={(c.progress / c.totalSteps) * 100} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 侵权线索 Tab */}
          <TabsContent value="violations" className="space-y-4 mt-4">
            {/* 筛选 */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">筛选：</span>
              <Button 
                variant={filterLevel === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterLevel(null)}
              >
                全部
              </Button>
              <Button 
                variant={filterLevel === "high" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterLevel("high")}
                className={filterLevel === "high" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                高风险
              </Button>
              <Button 
                variant={filterLevel === "medium" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilterLevel("medium")}
                className={filterLevel === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                中风险
              </Button>
            </div>

            <div className="space-y-3">
              {filteredViolations.map((v) => (
                <Card key={v.id} className={v.level === "high" ? "border-red-200" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={v.workImage} 
                        alt={v.workName}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {getViolationBadge(v.level)}
                            <p className="font-medium text-gray-900 mt-1">{v.workName}</p>
                          </div>
                          {getStatusBadge(v.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="w-4 h-4" />
                            {v.platform}
                          </span>
                          <span>相似度：{v.similarity}%</span>
                          <span>销量：{v.sales}+</span>
                          <span>售价：¥{v.price}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-red-600 font-medium">
                            预估损失：¥{v.estimatedLoss.toLocaleString()}
                          </span>
                          <span className="text-gray-400">{v.foundTime}</span>
                        </div>

                        {v.evidence.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">已固定证据：</span>
                            {v.evidence.map((e, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {e.type === "screenshot" ? "截图" : "对比图"}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          {v.status === "pending" ? (
                            <>
                              <Button variant="outline" size="sm">
                                忽略
                              </Button>
                              <Button variant="outline" size="sm">
                                加入监测
                              </Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                立即处理
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                查看详情
                              </Button>
                              <Button variant="outline" size="sm">
                                <Ban className="w-4 h-4 mr-1" />
                                停止监测
                              </Button>
                              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                发起维权
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 我的案件 Tab */}
          <TabsContent value="cases" className="space-y-4 mt-4">
            <div className="space-y-3">
              {cases.map((c) => (
                <Card key={c.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{c.title}</p>
                        <p className="text-sm text-gray-500">案件编号：{c.caseNo}</p>
                        <p className="text-sm text-gray-500">承办律师：{c.lawyer}</p>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">立案时间：</span>
                        <span>{c.startDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">最后更新：</span>
                        <span>{c.lastUpdate}</span>
                      </div>
                    </div>

                    <p className="text-sm text-indigo-600 mb-2">
                      当前状态：{getCaseStatusText(c.status)}
                    </p>

                    {c.compensation && (
                      <p className="text-sm text-green-600 mb-2">
                        赔偿金额：{c.compensation}
                      </p>
                    )}

                    {c.nextStep && (
                      <p className="text-xs text-gray-500 mb-3">下一步：{c.nextStep}</p>
                    )}

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span className={c.progress >= 1 ? "text-indigo-600 font-medium" : ""}>已取证</span>
                        <span className={c.progress >= 2 ? "text-indigo-600 font-medium" : ""}>平台投诉</span>
                        <span className={c.progress >= 3 ? "text-indigo-600 font-medium" : ""}>律师函</span>
                        <span className={c.progress >= 4 ? "text-indigo-600 font-medium" : ""}>完成</span>
                      </div>
                      <Progress value={(c.progress / c.totalSteps) * 100} className="h-2" />
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        查看材料
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        联系律师
                      </Button>
                      {c.status === "completed" && (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          下载判决书
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
