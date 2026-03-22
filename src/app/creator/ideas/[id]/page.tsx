"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Download,
  Eye,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Calendar,
  Shield,
  Award,
  Link,
  Copy,
  Check,
  Edit,
  Trash2,
  Lock,
  Globe,
  Store,
  AlertTriangle,
  FileCheck,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ExternalLink
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
  income: number;
  certificate?: {
    certNo: string;
    txHash: string;
    createdAt: string;
    chainId: string;
  };
  monitoring?: boolean;
  riskCount?: number;
  tags: string[];
  publishMode: string;
}

// 模拟数据
const mockIdea: Idea = {
  id: "1",
  title: "智能家居中控面板设计",
  description: "这是一款面向未来智能家居的中控面板设计，采用极简主义风格，融合语音交互与触控操作。设计灵感来源于自然界的流水形态，旨在打造温润、亲和的家居氛围。\n\n主要特点：\n1. 无边框全面屏设计\n2. 语音+触控双模交互\n3. 环境自适应亮度调节\n4. 模块化功能扩展",
  category: "工业设计",
  images: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
    "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800"
  ],
  status: "APPROVED",
  createdAt: "2026-03-15T10:30:00Z",
  views: 2347,
  inquiries: 18,
  income: 5000,
  certificate: {
    certNo: "CB202603150001",
    txHash: "0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    createdAt: "2026-03-15T10:35:00Z",
    chainId: "antchain"
  },
  monitoring: true,
  riskCount: 2,
  tags: ["智能家居", "UI设计", "极简主义", "物联网"],
  publishMode: "public"
};

// 浏览趋势数据（模拟）
const viewTrendData = [
  { date: "03-15", views: 120 },
  { date: "03-16", views: 280 },
  { date: "03-17", views: 450 },
  { date: "03-18", views: 320 },
  { date: "03-19", views: 580 },
  { date: "03-20", views: 420 },
  { date: "03-21", views: 177 },
];

export default function IdeaDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 模拟API调用
    setTimeout(() => {
      setIdea(mockIdea);
      setLoading(false);
    }, 500);
  }, [params.id]);

  const handleCopyCertNo = () => {
    if (idea?.certificate?.certNo) {
      navigator.clipboard.writeText(idea.certificate.certNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrevImage = () => {
    if (idea && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (idea && currentImageIndex < idea.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">作品不存在</p>
          <Button onClick={() => router.push("/creator/ideas")}>返回列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push("/creator/ideas")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">
              {idea.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 作品展示 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 图片轮播 */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                <img 
                  src={idea.images[currentImageIndex]} 
                  alt={idea.title}
                  className="w-full h-full object-cover"
                />
                {idea.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      disabled={currentImageIndex === idea.images.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg disabled:opacity-30"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {idea.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* 缩略图 */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {idea.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? "border-indigo-600" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* 作品信息 */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{idea.category}</Badge>
                      {idea.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {idea.status === "APPROVED" ? (
                      <Badge className="bg-green-100 text-green-700">
                        <Globe className="w-3 h-3 mr-1" />
                        已公开
                      </Badge>
                    ) : idea.status === "PRIVATE" ? (
                      <Badge className="bg-blue-100 text-blue-700">
                        <Lock className="w-3 h-3 mr-1" />
                        私库
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">审核中</Badge>
                    )}
                  </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                  {idea.description}
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    上传于 {new Date(idea.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {idea.views} 次浏览
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {idea.inquiries} 次询价
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 数据统计 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  数据概览
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{idea.views}</p>
                    <p className="text-sm text-gray-500">总浏览</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{idea.inquiries}</p>
                    <p className="text-sm text-gray-500">询价量</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">¥{idea.income}</p>
                    <p className="text-sm text-gray-500">累计收益</p>
                  </div>
                </div>

                {/* 浏览趋势图 */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">近7天浏览趋势</p>
                  <div className="h-40 flex items-end gap-2">
                    {viewTrendData.map((item, idx) => {
                      const max = Math.max(...viewTrendData.map(d => d.views));
                      const height = (item.views / max) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-indigo-500 rounded-t-sm transition-all hover:bg-indigo-600"
                            style={{ height: `${height}%`, minHeight: '4px' }}
                          />
                          <span className="text-xs text-gray-400">{item.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧 - 操作面板 */}
          <div className="space-y-6">
            {/* 存证信息 */}
            {idea.certificate && (
              <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200">
                <div className="h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">区块链存证</p>
                      <p className="text-xs text-gray-500">蚂蚁链 AntChain</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">存证编号</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-medium">{idea.certificate.certNo}</span>
                        <button 
                          onClick={handleCopyCertNo}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">存证时间</span>
                      <span>{new Date(idea.certificate.createdAt).toLocaleString('zh-CN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">交易哈希</span>
                      <span className="font-mono text-xs text-gray-600">
                        {idea.certificate.txHash.slice(0, 12)}...{idea.certificate.txHash.slice(-8)}
                      </span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4 bg-white/80" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    查看区块链存证
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 快捷操作 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">作品操作</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {idea.status === "PRIVATE" && (
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Globe className="w-4 h-4 mr-2" />
                    设为公开
                  </Button>
                )}
                {idea.status === "APPROVED" && (
                  <Button variant="outline" className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    下架作品
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑信息
                </Button>
                <Button variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  复制作品
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  下载证书
                </Button>
                {idea.monitoring ? (
                  <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                    <Shield className="w-4 h-4 mr-2" />
                    关闭监测
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    开启监测
                  </Button>
                )}
                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除作品
                </Button>
              </CardContent>
            </Card>

            {/* 侵权监测 */}
            {idea.monitoring && (
              <Card className={idea.riskCount && idea.riskCount > 0 ? "border-orange-200" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    侵权监测
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {idea.riskCount && idea.riskCount > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">发现 {idea.riskCount} 条风险线索</span>
                      </div>
                      <div className="space-y-2">
                        <div className="p-3 bg-orange-50 rounded-lg text-sm">
                          <p className="font-medium text-orange-700">高风险</p>
                          <p className="text-orange-600 text-xs mt-1">某电商平台出现高度相似产品</p>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg text-sm">
                          <p className="font-medium text-yellow-700">中风险</p>
                          <p className="text-yellow-600 text-xs mt-1">社交媒体发现疑似抄袭内容</p>
                        </div>
                      </div>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                        查看详情
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileCheck className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">暂未发现侵权线索</p>
                      <p className="text-xs text-gray-400 mt-1">系统持续监测中...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 合作意向 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">最近询价</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">小</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">小米生态链</p>
                      <p className="text-xs text-gray-500 truncate">对该设计很感兴趣，希望进一步沟通</p>
                    </div>
                    <Badge variant="outline" className="text-xs">新</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">海</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900">海尔智家</p>
                      <p className="text-xs text-gray-500 truncate">询问合作授权事宜</p>
                    </div>
                    <span className="text-xs text-gray-400">2天前</span>
                  </div>
                </div>
                <Button variant="ghost" className="w-full mt-3 text-indigo-600" size="sm">
                  查看全部 {idea.inquiries} 条询价
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
