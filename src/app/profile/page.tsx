"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Crown,
  Shield,
  BarChart3,
  Briefcase,
  Palette,
  Wallet,
  FileText,
  Star,
  Settings,
  Bell,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  vipLevel: string;
  vipExpireDate: string;
  stats: {
    works: number;
    earnings: number;
    creditScore: number;
  };
  assets: {
    balance: number;
    pending: number;
    frozen: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      // Add mock data
      setUser({
        ...userData,
        vipLevel: "黄金会员",
        vipExpireDate: "2024.12.31",
        stats: {
          works: 28,
          earnings: 85200,
          creditScore: 92,
        },
        assets: {
          balance: 12850,
          pending: 3200,
          frozen: 0,
        },
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">我的</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                {user.avatar || "👤"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">
                    {user.role === "CREATOR" ? "创作者" : "企业"}·{user.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">{user.vipLevel}</span>
                </div>
                <p className="text-white/70 text-sm">
                  有效期至：{user.vipExpireDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{user.stats.works}</p>
                <p className="text-sm text-white/70">创作数</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">¥{user.stats.earnings.toLocaleString()}</p>
                <p className="text-sm text-white/70">总收益</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-2xl font-bold">{user.stats.creditScore}</p>
                <p className="text-sm text-white/70">信用分</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => router.push("/vip")}
              >
                <Crown className="w-4 h-4 mr-2" />
                升级会员
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => router.push("/profile/edit")}
              >
                <User className="w-4 h-4 mr-2" />
                编辑资料
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assets Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">我的资产</h3>
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ¥{user.assets.balance.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">可用余额</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ¥{user.assets.pending.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">待结算</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  ¥{user.assets.frozen.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">冻结金额</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.push("/wallet/withdraw")}>
                提现
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push("/wallet/bills")}>
                账单
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => router.push("/wallet/analytics")}>
                收益分析
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">我的服务</h3>
            <div className="grid grid-cols-4 gap-4">
              <div
                className="text-center cursor-pointer"
                onClick={() => router.push("/vip")}
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Crown className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs">VIP会员中心</p>
              </div>
              <div
                className="text-center cursor-pointer"
                onClick={() => router.push("/legal")}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-xs">我的法务顾问</p>
              </div>
              <div
                className="text-center cursor-pointer"
                onClick={() => router.push("/analytics")}
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-xs">创意数据报告</p>
              </div>
              <div
                className="text-center cursor-pointer"
                onClick={() => router.push("/creator/protection")}
              >
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-xs">维权保障计划</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Content */}
        <Card>
          <CardContent className="p-0">
            <h3 className="font-semibold p-6 pb-2">我的内容</h3>
            <div className="divide-y">
              <div
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/creator/ideas")}
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span>创意管理</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">({user.stats.works})</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <span>创意私库</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">(12)</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-400" />
                  <span>已发布作品</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">(16)</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span>合作记录</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">(8)</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span>我的收藏</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">(23)</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="p-0">
            <h3 className="font-semibold p-6 pb-2">设置与工具</h3>
            <div className="divide-y">
              <div
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/settings")}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>账号与安全</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <span>切换模式</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">创作者/厂商/投资者</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span>消息通知设置</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span>隐私设置</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/help")}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                  <span>帮助与反馈</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </main>
    </div>
  );
}