"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Shield, 
  Handshake, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Bell,
  Settings,
  Crown,
  Award,
  FileCheck,
  AlertTriangle,
  ChevronRight,
  Eye,
  MessageSquare,
  DollarSign
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  vipLevel?: string;
  creditScore?: number;
}

interface StatItem {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  desc: string;
  href: string;
  color: string;
}

interface Demand {
  id: string;
  title: string;
  company: string;
  budget: string;
  category: string;
  deadline: string;
  status: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 统计数据
  const stats: StatItem[] = [
    { label: "创作数", value: 12, trend: 20, trendLabel: "较上月" },
    { label: "总收益", value: "¥8,500", trend: 35, trendLabel: "较上月" },
    { label: "成功率", value: "85%", trend: 5, trendLabel: "较上月" },
    { label: "信用分", value: 92, trend: 2, trendLabel: "较上月" },
  ];

  // 快捷入口
  const quickActions: QuickAction[] = [
    { 
      icon: <Upload className="w-6 h-6" />, 
      label: "一键确权", 
      desc: "快速上传创意作品",
      href: "/upload",
      color: "bg-blue-500"
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      label: "侵权监测", 
      desc: "监测全网侵权线索",
      href: "/creator/protection",
      color: "bg-red-500"
    },
    { 
      icon: <Handshake className="w-6 h-6" />, 
      label: "我的对接", 
      desc: "查看合作意向",
      href: "/creator/intents",
      color: "bg-green-500"
    },
    { 
      icon: <BarChart3 className="w-6 h-6" />, 
      label: "数据报告", 
      desc: "查看作品数据分析",
      href: "/creator/analytics",
      color: "bg-purple-500"
    },
  ];

  // 推荐需求
  const recommendedDemands: Demand[] = [
    {
      id: "1",
      title: "智能家居产品外观设计",
      company: "小米生态链企业",
      budget: "¥50,000-100,000",
      category: "工业设计",
      deadline: "2026-04-15",
      status: "进行中"
    },
    {
      id: "2",
      title: "文创IP形象设计",
      company: "故宫博物院文创",
      budget: "¥30,000-80,000",
      category: "IP形象",
      deadline: "2026-04-20",
      status: "进行中"
    },
    {
      id: "3",
      title: "新能源汽车UI界面设计",
      company: "蔚来汽车",
      budget: "¥80,000-150,000",
      category: "UI设计",
      deadline: "2026-04-10",
      status: "急招"
    },
  ];

  // 侵权线索
  const infringementAlerts = [
    { id: 1, level: "high", title: "发现3处高风险侵权", desc: "您的作品《智能手表设计》被疑似抄袭" },
    { id: 2, level: "medium", title: "发现1处中风险侵权", desc: "某电商平台出现相似产品" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== "CREATOR") {
      router.push("/enterprise");
      return;
    }

    // 添加模拟数据
    setUser({
      ...userData,
      avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + userData.name,
      vipLevel: "黄金会员",
      creditScore: 92
    });
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">创</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">创意桥</h1>
              <p className="text-xs text-gray-500">AI创意产业化平台</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 个人信息卡片 */}
        <Card className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white/30 bg-white"
                />
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  VIP
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <Badge className="bg-white/20 text-white border-0">
                    <Award className="w-3 h-3 mr-1" />
                    {user.vipLevel}
                  </Badge>
                </div>
                <p className="text-indigo-100 text-sm mb-3">{user.email}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-green-300" />
                    <span className="text-sm">已认证</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-indigo-200">信用分:</span>
                    <span className="font-bold text-yellow-300">{user.creditScore}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white border-0 hover:bg-white/30"
                onClick={() => router.push("/vip")}
              >
                升级会员
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend !== undefined && (
                    <div className={`flex items-center text-xs ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                      <span>{stat.trend > 0 ? '+' : ''}{stat.trend}%</span>
                    </div>
                  )}
                </div>
                {stat.trendLabel && (
                  <p className="text-xs text-gray-400 mt-1">{stat.trendLabel}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => router.push(action.href)}
            >
              <CardContent className="p-4">
                <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 推荐需求 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-indigo-600" />
                    推荐需求
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-indigo-600">
                    查看更多 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recommendedDemands.map((demand) => (
                    <div 
                      key={demand.id} 
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/demands/${demand.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{demand.title}</h4>
                          <p className="text-sm text-gray-500">{demand.company}</p>
                        </div>
                        <Badge variant={demand.status === "急招" ? "destructive" : "default"}>
                          {demand.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="text-orange-600 font-medium">{demand.budget}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">{demand.category}</Badge>
                        </span>
                        <span>截止: {demand.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侵权监测提醒 */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    侵权监测
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    查看全部 <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {infringementAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.level === "high" 
                          ? "bg-red-50 border-red-500" 
                          : "bg-yellow-50 border-yellow-500"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          alert.level === "high" ? "text-red-500" : "text-yellow-500"
                        }`} />
                        <div>
                          <p className={`text-sm font-medium ${
                            alert.level === "high" ? "text-red-700" : "text-yellow-700"
                          }`}>
                            {alert.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">{alert.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => router.push("/creator/protection")}
                >
                  开启智能监测
                </Button>
              </CardContent>
            </Card>

            {/* 最近浏览 */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-500" />
                  作品数据
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">总浏览量</p>
                        <p className="text-xs text-gray-500">本月新增 1,234</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">8,567</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">咨询量</p>
                        <p className="text-xs text-gray-500">本月新增 23</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">156</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">成交单数</p>
                        <p className="text-xs text-gray-500">本月新增 5</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
