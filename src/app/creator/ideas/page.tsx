"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Shield,
  Store,
  Lock,
  FileText,
  Trash2,
  Copy,
} from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  status: string;
  createdAt: string;
  views: number;
  inquiries: number;
  certificate?: {
    certNo: string;
  };
  monitoring?: boolean;
  riskCount?: number;
}

export default function IdeasManagementPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const res = await fetch("/api/ideas/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("获取创意列表失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (activeTab === "all") return true;
    if (activeTab === "private") return idea.status === "PRIVATE";
    if (activeTab === "public") return idea.status === "APPROVED";
    if (activeTab === "draft") return idea.status === "DRAFT";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-green-100 text-green-700">已发布</Badge>;
      case "PRIVATE":
        return <Badge className="bg-blue-100 text-blue-700">私库</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">审核中</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-100 text-gray-700">草稿</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <Store className="w-4 h-4" />;
      case "PRIVATE":
        return <Lock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">创意管理</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              筛选
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push("/upload")}
            >
              <Plus className="w-4 h-4 mr-1" />
              上传
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">
              全部({ideas.length})
            </TabsTrigger>
            <TabsTrigger value="private">
              私库({ideas.filter((i) => i.status === "PRIVATE").length})
            </TabsTrigger>
            <TabsTrigger value="public">
              已发布({ideas.filter((i) => i.status === "APPROVED").length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              草稿({ideas.filter((i) => i.status === "DRAFT").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-4">
            {filteredIdeas.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 mb-4">暂无创意作品</p>
                  <Button onClick={() => router.push("/upload")}>
                    <Plus className="w-4 h-4 mr-2" />
                    上传第一个创意
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredIdeas.map((idea) => (
                <Card key={idea.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div
                        className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 cursor-pointer"
                        onClick={() => router.push(`/creator/ideas/${idea.id}`)}
                      >
                        {idea.images?.[0] ? (
                          <img
                            src={idea.images[0]}
                            alt={idea.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FileText className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3
                              className="font-semibold text-gray-900 truncate cursor-pointer"
                              onClick={() => router.push(`/creator/ideas/${idea.id}`)}
                            >
                              {idea.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(idea.status)}
                              <span className="text-sm text-gray-500">{idea.category}</span>
                              {getStatusBadge(idea.status)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>📅 {new Date(idea.createdAt).toLocaleDateString()}</span>
                          {idea.certificate && (
                            <span className="text-indigo-600">🔒 已确权</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>👁️ 浏览：{idea.views || 0}</span>
                          <span>💬 询价：{idea.inquiries || 0}</span>
                          {idea.monitoring && (
                            <span className="text-green-600">
                              🛡️ 监测{idea.riskCount ? `（${idea.riskCount}条风险）` : ""}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          {idea.status === "PRIVATE" && (
                            <Button variant="outline" size="sm">
                              设为公开
                            </Button>
                          )}
                          {idea.status === "APPROVED" && (
                            <Button variant="outline" size="sm">
                              下架
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            编辑
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Batch Actions */}
      <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">批量操作</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                选择
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}