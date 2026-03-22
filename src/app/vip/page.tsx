"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Crown,
  Shield,
  Zap,
  Star,
  Headphones,
  BarChart3,
  Rocket,
  ArrowLeft,
  Sparkles,
  Clock,
  Gift,
  CheckCircle,
  X,
  ChevronRight,
  AlertCircle
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "免费版",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: "🆓",
    color: "bg-gray-100",
    textColor: "text-gray-600",
    features: {
      notarize: "5次/月",
      monitor: "3个作品",
      frequency: "每日扫描",
      lawyerLetter: false,
      litigation: false,
      legalAdvisor: false,
      commission: "15%",
      priority: false,
      storage: "1GB",
      support: "社区支持",
    },
  },
  {
    id: "silver",
    name: "白银会员",
    monthlyPrice: 99,
    yearlyPrice: 990,
    yearlyDiscount: 198,
    icon: "🥈",
    color: "bg-blue-100",
    textColor: "text-blue-600",
    features: {
      notarize: "不限次数",
      monitor: "20个作品",
      frequency: "每6小时",
      lawyerLetter: "1次/季度",
      litigation: false,
      legalAdvisor: false,
      commission: "12%",
      priority: true,
      storage: "10GB",
      support: "在线客服",
    },
  },
  {
    id: "gold",
    name: "黄金会员",
    monthlyPrice: 299,
    yearlyPrice: 1999,
    yearlyDiscount: 1589,
    popular: true,
    icon: "🥇",
    color: "bg-amber-100",
    textColor: "text-amber-600",
    features: {
      notarize: "不限次数",
      monitor: "不限数量",
      frequency: "实时监测",
      lawyerLetter: "3次/月",
      litigation: true,
      legalAdvisor: true,
      commission: "10%",
      priority: true,
      storage: "100GB",
      support: "专属顾问",
    },
  },
];

const goldBenefits = [
  { icon: <Shield className="w-5 h-5" />, title: "全年免费律师函", desc: "每月3次，价值¥900/月" },
  { icon: <Zap className="w-5 h-5" />, title: "诉讼费用垫付", desc: "平台先行垫付，胜诉后返还" },
  { icon: <Headphones className="w-5 h-5" />, title: "1对1法务顾问", desc: "专属律师，随时咨询" },
  { icon: <Rocket className="w-5 h-5" />, title: "AI推广流量加持", desc: "作品曝光量提升300%" },
  { icon: <Star className="w-5 h-5" />, title: "VIP专属客服", desc: "7×24小时优先响应" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "高级数据分析", desc: "深度洞察作品表现" },
  { icon: <Crown className="w-5 h-5" />, title: "创意变现绿色通道", desc: "快速对接企业需求" },
  { icon: <Gift className="w-5 h-5" />, title: "每月专属福利", desc: "平台活动优先参与" },
];

const comparisonFeatures = [
  { key: "notarize", label: "确权次数", free: "5次/月", silver: "不限", gold: "不限" },
  { key: "monitor", label: "监测作品数", free: "3个", silver: "20个", gold: "不限" },
  { key: "frequency", label: "监测频率", free: "每日", silver: "每6小时", gold: "实时" },
  { key: "lawyerLetter", label: "律师函服务", free: "—", silver: "1次/季度", gold: "3次/月" },
  { key: "litigation", label: "诉讼垫付", free: "—", silver: "—", gold: "✓" },
  { key: "legalAdvisor", label: "专属法务", free: "—", silver: "—", gold: "✓" },
  { key: "commission", label: "交易抽成", free: "15%", silver: "12%", gold: "10%" },
  { key: "priority", label: "优先推荐", free: "—", silver: "✓", gold: "高优" },
  { key: "storage", label: "云存储空间", free: "1GB", silver: "10GB", gold: "100GB" },
  { key: "support", label: "客服支持", free: "社区", silver: "在线客服", gold: "专属顾问" },
];

export default function VIPPage() {
  const router = useRouter();
  const [currentPlan] = useState("gold");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState("gold");

  const currentPlanData = plans.find(p => p.id === currentPlan);
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

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
              <h1 className="font-semibold text-gray-900">VIP会员中心</h1>
              <p className="text-xs text-gray-500">解锁更多权益</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700">
              <Crown className="w-3 h-3 mr-1" />
              当前：{currentPlanData?.name}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 当前会员状态 */}
        <Card className="mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Crown className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{currentPlanData?.name}</span>
                    <Badge className="bg-white/20 text-white border-0">
                      生效中
                    </Badge>
                  </div>
                  <p className="text-white/80 mt-1">有效期至：2026年12月31日</p>
                  <p className="text-white/60 text-sm mt-0.5">剩余 284 天</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-white/80 text-sm">已节省费用</p>
                <p className="text-2xl font-bold">¥3,580</p>
                <p className="text-white/60 text-sm mt-1">累计维权成功 5 次</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 计费周期切换 */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              月付
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              年付
              <Badge className="bg-green-100 text-green-700 text-xs">省更多</Badge>
            </button>
          </div>
        </div>

        {/* 套餐卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id 
                  ? "ring-2 ring-indigo-600 shadow-lg" 
                  : ""
              } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    最受欢迎
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ¥{billingCycle === "monthly" ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
                    </span>
                    <span className="text-gray-500">/月</span>
                  </div>
                  {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
                    <div className="mt-1">
                      <span className="text-sm text-gray-500">年付 ¥{plan.yearlyPrice}</span>
                      <span className="text-sm text-green-600 ml-2">
                        省¥{plan.yearlyDiscount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{plan.features.notarize}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>监测 {plan.features.monitor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{plan.features.frequency}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {plan.features.lawyerLetter ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={plan.features.lawyerLetter ? "" : "text-gray-400"}>
                      {plan.features.lawyerLetter || "无律师函"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {plan.features.litigation ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={plan.features.litigation ? "" : "text-gray-400"}>
                      {plan.features.litigation ? "诉讼垫付" : "无诉讼垫付"}
                    </span>
                  </div>
                </div>

                <Button 
                  className={`w-full ${
                    plan.id === currentPlan
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : plan.popular
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={plan.id === currentPlan}
                >
                  {plan.id === currentPlan ? "当前套餐" : plan.id === "free" ? "降级为免费" : "选择此套餐"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 详细对比表格 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">功能详细对比</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">功能</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-900">免费版</th>
                    <th className="text-center py-3 px-2 font-medium text-blue-600">白银</th>
                    <th className="text-center py-3 px-2 font-medium text-amber-600 bg-amber-50">黄金</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.key} className="hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-700">{feature.label}</td>
                      <td className="text-center py-3 px-2 text-gray-600">{feature.free}</td>
                      <td className="text-center py-3 px-2 text-blue-600 font-medium">{feature.silver}</td>
                      <td className="text-center py-3 px-2 text-amber-600 font-medium bg-amber-50/50">{feature.gold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 黄金会员专享权益 */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              黄金会员专享权益
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goldBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{benefit.title}</p>
                    <p className="text-sm text-gray-500">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 常见问题 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">常见问题</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="border-b pb-4">
              <p className="font-medium text-gray-900 mb-1">如何升级会员？</p>
              <p className="text-sm text-gray-500">选择您想要的套餐，点击&quot;选择此套餐&quot;按钮，完成支付后即可立即生效。</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium text-gray-900 mb-1">可以随时取消吗？</p>
              <p className="text-sm text-gray-500">可以随时取消自动续费，已购买的会员权益在有效期内仍可继续使用。</p>
            </div>
            <div className="border-b pb-4">
              <p className="font-medium text-gray-900 mb-1">升级后权益何时生效？</p>
              <p className="text-sm text-gray-500">支付成功后立即生效，您可以立即享受新套餐的所有权益。</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">如何联系专属法务顾问？</p>
              <p className="text-sm text-gray-500">成为黄金会员后，可在&quot;维权中心&quot;页面看到专属顾问的联系方式，或通过在线客服转接。</p>
            </div>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            7天无理由退款保障 · 安全支付 · 发票支持
          </p>
        </div>
      </main>
    </div>
  );
}
