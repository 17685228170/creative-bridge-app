"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  PiggyBank,
  Gift,
  Zap,
  Shield
} from "lucide-react";

// 资产数据
const assetData = {
  totalAssets: 25850.00,
  availableBalance: 15230.50,
  pendingSettlement: 5620.00,
  frozenAmount: 4999.50,
  totalIncome: 45680.00,
  totalWithdraw: 19830.00,
  monthlyIncome: 8540.00,
  monthlyChange: 23.5,
};

// 收支明细
const transactions = [
  {
    id: 1,
    type: "income",
    title: "作品授权费 - 智能水杯设计",
    amount: 5000.00,
    status: "completed",
    date: "2026-03-21",
    time: "14:30",
    source: "小米生态链",
    orderNo: "ORD20260321001",
  },
  {
    id: 2,
    type: "income",
    title: "侵权赔偿 - 某宝侵权案",
    amount: 8000.00,
    status: "completed",
    date: "2026-03-20",
    time: "10:15",
    source: "维权中心",
    orderNo: "CASE20260228003",
  },
  {
    id: 3,
    type: "expense",
    title: "提现至银行卡",
    amount: -10000.00,
    status: "completed",
    date: "2026-03-18",
    time: "09:00",
    source: "工商银行(尾号8888)",
    orderNo: "WD20260318001",
  },
  {
    id: 4,
    type: "income",
    title: "作品销售分成 - 极简台灯",
    amount: 1200.00,
    status: "pending",
    date: "2026-03-15",
    time: "16:45",
    source: "创意集市",
    orderNo: "ORD20260315002",
  },
  {
    id: 5,
    type: "income",
    title: "VIP会员返利",
    amount: 150.00,
    status: "completed",
    date: "2026-03-10",
    time: "00:00",
    source: "平台活动",
    orderNo: "RBT20260310001",
  },
  {
    id: 6,
    type: "expense",
    title: "购买VIP会员 - 黄金套餐",
    amount: -299.00,
    status: "completed",
    date: "2026-03-01",
    time: "11:20",
    source: "会员中心",
    orderNo: "VIP20260301001",
  },
];

// 提现记录
const withdrawRecords = [
  {
    id: 1,
    amount: 10000.00,
    status: "completed",
    date: "2026-03-18",
    time: "09:00",
    bank: "工商银行",
    cardNo: "****8888",
    fee: 0,
    arrivalTime: "2026-03-18 11:30",
  },
  {
    id: 2,
    amount: 5000.00,
    status: "completed",
    date: "2026-02-20",
    time: "14:00",
    bank: "工商银行",
    cardNo: "****8888",
    fee: 0,
    arrivalTime: "2026-02-20 16:30",
  },
  {
    id: 3,
    amount: 8000.00,
    status: "completed",
    date: "2026-01-15",
    time: "10:30",
    bank: "招商银行",
    cardNo: "****6666",
    fee: 0,
    arrivalTime: "2026-01-15 13:00",
  },
];

// 收入统计（按月）
const monthlyStats = [
  { month: "2025-10", income: 3200, expense: 299 },
  { month: "2025-11", income: 5600, expense: 0 },
  { month: "2025-12", income: 4800, expense: 5000 },
  { month: "2026-01", income: 7200, expense: 8000 },
  { month: "2026-02", income: 6900, expense: 5000 },
  { month: "2026-03", income: 8540, expense: 10299 },
];

export default function AssetCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [filterType, setFilterType] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700">已完成</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">处理中</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700">失败</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredTransactions = filterType 
    ? transactions.filter(t => t.type === filterType)
    : transactions;

  const totalIncome = transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

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
              <h1 className="font-semibold text-gray-900">资产中心</h1>
              <p className="text-xs text-gray-500">管理您的创意收益</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 总资产卡片 */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-indigo-100 text-sm">总资产</p>
                  <p className="text-3xl font-bold">¥{assetData.totalAssets.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-indigo-100 text-sm">本月收入</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">¥{assetData.monthlyIncome.toLocaleString()}</span>
                  <span className="flex items-center text-green-300 text-sm">
                    <TrendingUp className="w-4 h-4 mr-0.5" />
                    {assetData.monthlyChange}%
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
              <div>
                <p className="text-indigo-100 text-sm">可用余额</p>
                <p className="text-xl font-bold">¥{assetData.availableBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">待结算</p>
                <p className="text-xl font-bold">¥{assetData.pendingSettlement.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-indigo-100 text-sm">冻结金额</p>
                <p className="text-xl font-bold">¥{assetData.frozenAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-white text-indigo-600 hover:bg-white/90 h-12">
                <ArrowDownRight className="w-5 h-5 mr-2" />
                提现
              </Button>
              <Button variant="outline" className="flex-1 border-white/30 text-white hover:bg-white/10 h-12">
                <CreditCard className="w-5 h-5 mr-2" />
                银行卡管理
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 快捷入口 */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">立即提现</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <PiggyBank className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">收益分析</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-medium">邀请返利</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium">安全设置</p>
            </CardContent>
          </Card>
        </div>

        {/* 收入统计图表 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                收支趋势
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                  收入
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                  支出
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48 flex items-end gap-4">
              {monthlyStats.map((stat, idx) => {
                const max = Math.max(...monthlyStats.map(s => Math.max(s.income, s.expense)));
                const incomeHeight = (stat.income / max) * 100;
                const expenseHeight = (stat.expense / max) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end gap-1 h-32">
                      <div 
                        className="flex-1 bg-indigo-500 rounded-t-sm transition-all hover:bg-indigo-600"
                        style={{ height: `${incomeHeight}%` }}
                      />
                      <div 
                        className="flex-1 bg-gray-300 rounded-t-sm transition-all hover:bg-gray-400"
                        style={{ height: `${expenseHeight}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{stat.month.slice(5)}月</span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">累计收入</p>
                <p className="text-xl font-bold text-indigo-600">¥{assetData.totalIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">累计提现</p>
                <p className="text-xl font-bold text-gray-600">¥{assetData.totalWithdraw.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">收支明细</TabsTrigger>
            <TabsTrigger value="withdraw">提现记录</TabsTrigger>
            <TabsTrigger value="analysis">收益分析</TabsTrigger>
          </TabsList>

          {/* 收支明细 Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* 筛选 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">筛选：</span>
                <Button 
                  variant={filterType === null ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType(null)}
                >
                  全部
                </Button>
                <Button 
                  variant={filterType === "income" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType("income")}
                  className={filterType === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  收入
                </Button>
                <Button 
                  variant={filterType === "expense" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setFilterType("expense")}
                  className={filterType === "expense" ? "bg-gray-600 hover:bg-gray-700" : ""}
                >
                  支出
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                收入 <span className="text-green-600 font-medium">¥{totalIncome.toLocaleString()}</span>
                <span className="mx-2">|</span>
                支出 <span className="text-gray-600 font-medium">¥{totalExpense.toLocaleString()}</span>
              </div>
            </div>

            {/* 交易列表 */}
            <div className="space-y-3">
              {filteredTransactions.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          t.type === "income" ? "bg-green-100" : "bg-gray-100"
                        }`}>
                          {t.type === "income" ? (
                            <ArrowDownRight className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{t.title}</p>
                          <p className="text-sm text-gray-500">{t.source}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>{t.date} {t.time}</span>
                            <span>•</span>
                            <span>订单号：{t.orderNo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          t.type === "income" ? "text-green-600" : "text-gray-900"
                        }`}>
                          {t.type === "income" ? "+" : ""}¥{Math.abs(t.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {getStatusIcon(t.status)}
                          {getStatusBadge(t.status)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button variant="outline" className="w-full">
              加载更多 <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </TabsContent>

          {/* 提现记录 Tab */}
          <TabsContent value="withdraw" className="space-y-4 mt-4">
            <div className="space-y-3">
              {withdrawRecords.map((w) => (
                <Card key={w.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">提现至{w.bank}</p>
                          <p className="text-sm text-gray-500">{w.cardNo}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                            <span>{w.date} {w.time}</span>
                            {w.fee > 0 && <span>• 手续费 ¥{w.fee}</span>}
                          </div>
                          {w.status === "completed" && (
                            <p className="text-xs text-green-600 mt-1">
                              到账时间：{w.arrivalTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          -¥{w.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {getStatusIcon(w.status)}
                          {getStatusBadge(w.status)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>VIP会员享受每月3次免费提现，普通用户每笔收取0.1%手续费</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 收益分析 Tab */}
          <TabsContent value="analysis" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">作品授权收入</p>
                      <p className="text-xl font-bold text-gray-900">¥32,500</p>
                      <p className="text-xs text-green-600">占比 71%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">侵权赔偿收入</p>
                      <p className="text-xl font-bold text-gray-900">¥8,000</p>
                      <p className="text-xs text-green-600">占比 18%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Gift className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">平台奖励</p>
                      <p className="text-xl font-bold text-gray-900">¥3,180</p>
                      <p className="text-xs text-green-600">占比 7%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">其他收入</p>
                      <p className="text-xl font-bold text-gray-900">¥2,000</p>
                      <p className="text-xs text-green-600">占比 4%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">收益来源分布</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">作品授权</span>
                      <span className="text-sm font-medium">71%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '71%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">侵权赔偿</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">平台奖励</span>
                      <span className="text-sm font-medium">7%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '7%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">其他</span>
                      <span className="text-sm font-medium">4%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '4%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
