"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Search,
  FileText,
  Handshake,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageSquare,
  ChevronRight,
  Building2,
  BadgeCheck,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  Filter,
  MoreHorizontal,
  Bell,
  Settings
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  companyLogo?: string;
  verified?: boolean;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  creator: { 
    name: string;
    avatar?: string;
  };
  certificate?: { certNo: string };
  views: number;
  price?: string;
}

interface Demand {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: string;
  status: string;
  createdAt: string;
  applicants: number;
  views: number;
}

interface Intent {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  ideaTitle: string;
  message: string;
  status: string;
  createdAt: string;
}

// 模拟数据
const mockUser: User = {
  id: "1",
  name: "张经理",
  email: "zhang@xiaomi.com",
  role: "ENTERPRISE",
  companyName: "小米生态链",
  companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100",
  verified: true,
};

const mockStats = {
  demands: 8,
  ideasViewed: 156,
  inProgress: 3,
  completed: 12,
  monthlyChange: 23,
};

const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "智能家居中控面板设计",
    description: "极简主义风格，融合语音交互与触控操作",
    category: "工业设计",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"],
    creator: { name: "李明", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liming" },
    certificate: { certNo: "CB202603150001" },
    views: 2347,
    price: "¥50,000-100,000",
  },
  {
    id: "2",
    title: "文创IP形象设计",
    description: "国潮风格，适合年轻消费群体",
    category: "IP形象",
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400"],
    creator: { name: "王芳", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang" },
    certificate: { certNo: "CB202603160002" },
    views: 1890,
    price: "¥30,000-80,000",
  },
  {
    id: "3",
    title: "新能源汽车UI界面",
    description: "极简风格，大屏交互设计",
    category: "UI设计",
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400"],
    creator: { name: "陈工", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen" },
    certificate: { certNo: "CB202603170003" },
    views: 3156,
    price: "¥80,000-150,000",
  },
];

const mockDemands: Demand[] = [
  {
    id: "1",
    title: "智能家居产品外观设计",
    description: "寻找智能家居中控面板的外观设计方案",
    category: "工业设计",
    budget: "¥50,000-100,000",
    status: "OPEN",
    createdAt: "2026-03-20T10:00:00Z",
    applicants: 12,
    views: 456,
  },
  {
    id: "2",
    title: "文创IP形象设计",
    description: "为新产品线设计IP形象",
    category: "IP形象",
    budget: "¥30,000-80,000",
    status: "OPEN",
    createdAt: "2026-03-18T14:30:00Z",
    applicants: 8,
    views: 289,
  },
  {
    id: "3",
    title: "品牌VI设计",
    description: "企业品牌视觉识别系统设计",
    category: "平面设计",
    budget: "¥20,000-50,000",
    status: "CLOSED",
    createdAt: "2026-03-10T09:00:00Z",
    applicants: 15,
    views: 567,
  },
];

const mockIntents: Intent[] = [
  {
    id: "1",
    creatorName: "李明",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liming",
    ideaTitle: "智能家居中控面板设计",
    message: "我对贵公司的需求很感兴趣，希望能进一步沟通",
    status: "PENDING",
    createdAt: "2026-03-21T10:30:00Z",
  },
  {
    id: "2",
    creatorName: "王芳",
    creatorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang",
    ideaTitle: "文创IP形象设计",
    message: "我有多个成功案例，希望能为贵公司服务",
    status: "CONTACTING",
    createdAt: "2026-03-20T16:00:00Z",
  },
];

const quickActions = [
  { icon: <Plus className="w-6 h-6" />, label: "发布需求", desc: "快速发布创意需求", color: "bg-blue-500", href: "/enterprise/demands/new" },
  { icon: <Search className="w-6 h-6" />, label: "浏览创意", desc: "发现优质创意作品", color: "bg-green-500", href: "/enterprise/ideas" },
  { icon: <Handshake className="w-6 h-6" />, label: "我的对接", desc: "查看合作意向", color: "bg-orange-500", href: "/enterprise/intents" },
  { icon: <BarChart3 className="w-6 h-6" />, label: "数据报告", desc: "查看合作数据分析", color: "bg-purple-500", href: "/enterprise/analytics" },
];

export default function EnterpriseDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) {
      router.push("/");
      return;
    }

    const userData = JSON.parse(userStr);
    if (userData.role !== "ENTERPRISE") {
      router.push("/creator");
      return;
    }

    // 合并模拟数据
    setUser({ ...mockUser, ...userData });
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const getDemandStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-green-100 text-green-700">招募中</Badge>;
      case "CLOSED":
        return <Badge className="bg-gray-100 text-gray-700">已关闭</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-700">已完成</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getIntentStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">待处理</Badge>;
      case "CONTACTING":
        return <Badge className="bg-blue-100 text-blue-700">沟通中</Badge>;
      case "COOPERATING":
        return <Badge className="bg-green-100 text-green-700">已合作</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">创</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">创意桥</h1>
              <p className="text-xs text-gray-500">企业工作台</p>
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
        {/* 企业信息卡片 */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img 
                  src={user.companyLogo || "https://api.dicebear.com/7.x/identicon/svg?seed=" + user.companyName} 
                  alt={user.companyName}
                  className="w-20 h-20 rounded-2xl border-4 border-white/30 bg-white"
                />
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold">{user.companyName || user.name}</h2>
                  {user.verified && (
                    <Badge className="bg-white/20 text-white border-0">
                      <BadgeCheck className="w-3 h-3 mr-1" />
                      已认证
                    </Badge>
                  )}
                </div>
                <p className="text-blue-100 text-sm mb-3">{user.email}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-200" />
                    <span className="text-sm">企业用户</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-blue-200" />
                    <span className="text-sm">已合作 {mockStats.completed} 个项目</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white border-0 hover:bg-white/30"
                onClick={() => router.push("/enterprise/profile")}
              >
                完善资料
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 数据统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">发布需求</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{mockStats.demands}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  <span>+{mockStats.monthlyChange}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">浏览创意</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.ideasViewed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">对接中</p>
              <p className="text-2xl font-bold text-blue-600">{mockStats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-1">已完成</p>
              <p className="text-2xl font-bold text-green-600">{mockStats.completed}</p>
            </CardContent>
          </Card>
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="overview">推荐创意</TabsTrigger>
            <TabsTrigger value="demands">我的需求 ({mockDemands.length})</TabsTrigger>
            <TabsTrigger value="intents">合作意向 ({mockIntents.length})</TabsTrigger>
          </TabsList>

          {/* 推荐创意 Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                为您推荐
              </h3>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                查看更多 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockIdeas.map((idea) => (
                <Card key={idea.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/enterprise/ideas/${idea.id}`)}>
                  <div className="aspect-video bg-gray-100 relative">
                    <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover" />
                    {idea.certificate && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        已确权
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{idea.category}</Badge>
                      {idea.price && (
                        <span className="text-sm font-medium text-orange-600">{idea.price}</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{idea.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{idea.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={idea.creator.avatar} alt={idea.creator.name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm text-gray-600">{idea.creator.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {idea.views}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 我的需求 Tab */}
          <TabsContent value="demands" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">我的需求</h3>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => router.push("/enterprise/demands/new")}
              >
                <Plus className="w-4 h-4 mr-1" />
                发布需求
              </Button>
            </div>

            <div className="space-y-3">
              {mockDemands.map((demand) => (
                <Card key={demand.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{demand.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{demand.description}</p>
                      </div>
                      {getDemandStatusBadge(demand.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <Badge variant="outline">{demand.category}</Badge>
                      {demand.budget && (
                        <span className="text-orange-600 font-medium">{demand.budget}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(demand.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {demand.applicants} 人报名
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {demand.views} 次浏览
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          查看详情
                        </Button>
                        {demand.status === "OPEN" && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                            关闭
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 合作意向 Tab */}
          <TabsContent value="intents" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">合作意向</h3>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                筛选
              </Button>
            </div>

            <div className="space-y-3">
              {mockIntents.map((intent) => (
                <Card key={intent.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <img 
                        src={intent.creatorAvatar} 
                        alt={intent.creatorName}
                        className="w-12 h-12 rounded-full bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h4 className="font-semibold text-gray-900">{intent.creatorName}</h4>
                            <p className="text-sm text-gray-500">对「{intent.ideaTitle}」感兴趣</p>
                          </div>
                          {getIntentStatusBadge(intent.status)}
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg mt-2">
                          &ldquo;{intent.message}&rdquo;
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-400">
                            {new Date(intent.createdAt).toLocaleString('zh-CN')}
                          </span>
                          <div className="flex gap-2">
                            {intent.status === "PENDING" && (
                              <>
                                <Button variant="outline" size="sm">
                                  忽略
                                </Button>
                                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  立即沟通
                                </Button>
                              </>
                            )}
                            {intent.status === "CONTACTING" && (
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                继续沟通
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
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
