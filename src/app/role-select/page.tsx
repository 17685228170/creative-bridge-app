"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Palette, Factory, Briefcase } from "lucide-react";

type UserRole = "CREATOR" | "ENTERPRISE" | "INVESTOR";

interface RoleOption {
  id: UserRole;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  features: string[];
}

const roles: RoleOption[] = [
  {
    id: "CREATOR",
    icon: <Palette className="w-8 h-8" />,
    title: "创作者",
    subtitle: "我是设计师、艺术家、创作者",
    features: [
      "创意确权与保护",
      "作品展示与对接",
      "侵权监测与维权",
      "多元化变现渠道",
    ],
  },
  {
    id: "ENTERPRISE",
    icon: <Factory className="w-8 h-8" />,
    title: "生产商/品牌方",
    subtitle: "我是工厂、制造商、品牌商",
    features: [
      "海量创意库搜索",
      "AI智能匹配推荐",
      "创意评估与测试",
      "供应链资源对接",
    ],
  },
  {
    id: "INVESTOR",
    icon: <Briefcase className="w-8 h-8" />,
    title: "投资者/机构",
    subtitle: "我是投资人、投资机构、孵化器",
    features: [
      "优质项目发现",
      "项目尽职调查",
      "投后管理与服务",
      "退出渠道对接",
    ],
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>("CREATOR");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/");
      return;
    }

    try {
      // 更新用户角色
      const res = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (res.ok) {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.role = selectedRole;
          localStorage.setItem("user", JSON.stringify(user));
        }

        // 根据角色跳转
        if (selectedRole === "CREATOR") {
          router.push("/creator");
        } else if (selectedRole === "ENTERPRISE") {
          router.push("/enterprise");
        } else {
          router.push("/investor");
        }
      }
    } catch (error) {
      console.error("更新角色失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">请选择您的身份</h1>
        <p className="text-gray-500 mb-8">选择适合您的身份开始体验</p>

        <div className="space-y-4 mb-8">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRole === role.id
                  ? "border-2 border-indigo-600 bg-indigo-50"
                  : "border border-gray-200 hover:border-indigo-300"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      selectedRole === role.id
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {role.title}
                      </h3>
                      {selectedRole === role.id && (
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{role.subtitle}</p>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-center gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-indigo-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mb-4">
          提示：身份可在「我的」页面随时切换
        </p>

        <Button
          className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700"
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? "确认中..." : "确认选择"}
        </Button>
      </div>
    </div>
  );
}