"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  X,
  BadgeCheck,
  Flame,
  Star,
  Zap
} from "lucide-react";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  creator: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  certificate?: {
    certNo: string;
  };
  views: number;
  likes: number;
  price?: string;
  createdAt: string;
  tags: string[];
}

// 分类数据
const categories = [
  { id: "all", name: "全部", icon: "✨" },
  { id: "industrial", name: "工业设计", icon: "🏭" },
  { id: "graphic", name: "平面设计", icon: "🎨" },
  { id: "cultural", name: "文创产品", icon: "🏛️" },
  { id: "ip", name: "IP形象", icon: "👾" },
  { id: "ui", name: "UI/UX", icon: "📱" },
  { id: "architecture", name: "建筑设计", icon: "🏗️" },
  { id: "fashion", name: "服装设计", icon: "👔" },
];

// 排序选项
const sortOptions = [
  { id: "recommend", name: "智能推荐", icon: <Sparkles className="w-4 h-4" /> },
  { id: "trending", name: "最热", icon: <Flame className="w-4 h-4" /> },
  { id: "newest", name: "最新", icon: <Clock className="w-4 h-4" /> },
  { id: "popular", name: "最多浏览", icon: <Eye className="w-4 h-4" /> },
];

// 模拟创意数据
const mockIdeas: Idea[] = [
  {
    id: "1",
    title: "智能家居中控面板设计",
    description: "极简主义风格，融合语音交互与触控操作，打造未来感家居体验",
    category: "industrial",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"],
    creator: { name: "李明设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=liming", verified: true },
    certificate: { certNo: "CB202603150001" },
    views: 2347,
    likes: 156,
    price: "¥50,000-100,000",
    createdAt: "2026-03-15",
    tags: ["智能家居", "极简主义", "物联网"],
  },
  {
    id: "2",
    title: "国潮文创IP形象 - 山海经系列",
    description: "以山海经神兽为灵感，打造年轻化国潮IP形象",
    category: "ip",
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600"],
    creator: { name: "王芳创意", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangfang", verified: true },
    certificate: { certNo: "CB202603160002" },
    views: 5678,
    likes: 423,
    price: "¥30,000-80,000",
    createdAt: "2026-03-16",
    tags: ["国潮", "IP设计", "文创"],
  },
  {
    id: "3",
    title: "新能源汽车智能座舱UI",
    description: "大屏交互设计，极简风格，支持手势操作",
    category: "ui",
    images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600"],
    creator: { name: "陈工设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chen" },
    certificate: { certNo: "CB202603170003" },
    views: 3156,
    likes: 289,
    price: "¥80,000-150,000",
    createdAt: "2026-03-17",
    tags: ["汽车UI", "HMI", "智能座舱"],
  },
  {
    id: "4",
    title: "可持续环保包装设计",
    description: "可降解材料，模块化结构，零浪费理念",
    category: "graphic",
    images: ["https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600"],
    creator: { name: "绿色设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=green", verified: true },
    certificate: { certNo: "CB202603180004" },
    views: 1890,
    likes: 234,
    price: "¥20,000-50,000",
    createdAt: "2026-03-18",
    tags: ["环保", "包装", "可持续"],
  },
  {
    id: "5",
    title: "未来主义建筑概念设计",
    description: "参数化设计，生态建筑，碳中和理念",
    category: "architecture",
    images: ["https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600"],
    creator: { name: "建筑工作室", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=arch" },
    certificate: { certNo: "CB202603190005" },
    views: 4521,
    likes: 367,
    price: "¥100,000-300,000",
    createdAt: "2026-03-19",
    tags: ["建筑", "参数化", "生态"],
  },
  {
    id: "6",
    title: "新中式服装系列设计",
    description: "传统元素与现代剪裁结合，适合年轻群体",
    category: "fashion",
    images: ["https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600"],
    creator: { name: "时尚设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fashion", verified: true },
    certificate: { certNo: "CB202603200006" },
    views: 2890,
    likes: 198,
    price: "¥40,000-100,000",
    createdAt: "2026-03-20",
    tags: ["新中式", "服装", "国潮"],
  },
  {
    id: "7",
    title: "智能音箱产品外观设计",
    description: "织物材质，温润造型，家居融合",
    category: "industrial",
    images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600"],
    creator: { name: "产品设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=product" },
    certificate: { certNo: "CB202603210007" },
    views: 1567,
    likes: 123,
    price: "¥30,000-60,000",
    createdAt: "2026-03-21",
    tags: ["音箱", "智能家居", "织物"],
  },
  {
    id: "8",
    title: "品牌视觉识别系统设计",
    description: "完整的VI系统，包含Logo、色彩、字体规范",
    category: "graphic",
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600"],
    creator: { name: "品牌设计", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brand", verified: true },
    certificate: { certNo: "CB202603220008" },
    views: 2134,
    likes: 178,
    price: "¥25,000-80,000",
    createdAt: "2026-03-22",
    tags: ["品牌", "VI", "视觉"],
  },
];

// AI助手推荐
const aiRecommendations = [
  { text: "智能家居", icon: "🏠" },
  { text: "国潮文创", icon: "🎭" },
  { text: "新能源汽车", icon: "🚗" },
  { text: "环保包装", icon: "♻️" },
  { text: "UI设计", icon: "📱" },
];

export default function MarketPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("recommend");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyCertified, setOnlyCertified] = useState(false);

  // 筛选和排序
  const filteredIdeas = ideas
    .filter((idea) => {
      if (selectedCategory !== "all" && idea.category !== selectedCategory) return false;
      if (searchQuery && !idea.title.includes(searchQuery) && !idea.description.includes(searchQuery)) return false;
      if (onlyVerified && !idea.creator.verified) return false;
      if (onlyCertified && !idea.certificate) return false;
      if (priceRange) {
        // 简化的价格筛选逻辑
        const minPrice = parseInt(idea.price?.replace(/[^0-9]/g, "").slice(0, 5) || "0");
        if (priceRange === "under50k" && minPrice > 50000) return false;
        if (priceRange === "50k-100k" && (minPrice < 50000 || minPrice > 100000)) return false;
        if (priceRange === "over100k" && minPrice < 100000) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "popular":
          return b.views - a.views;
        case "trending":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">创</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">创意集市</h1>
            </div>
            
            {/* 搜索框 */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="搜索创意作品、设计师、标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-11"
                />
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-gray-100" : ""}
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* AI助手推荐 */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-2">
            <div className="flex items-center gap-1 text-indigo-600 text-sm font-medium flex-shrink-0">
              <Sparkles className="w-4 h-4" />
              <span>AI推荐：</span>
            </div>
            {aiRecommendations.map((rec) => (
              <button
                key={rec.text}
                onClick={() => setSearchQuery(rec.text)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm whitespace-nowrap hover:bg-indigo-100 transition-colors"
              >
                <span>{rec.icon}</span>
                <span>{rec.text}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 分类筛选 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 高级筛选 */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">筛选条件</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">价格区间</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: null, label: "全部" },
                      { id: "under50k", label: "5万以下" },
                      { id: "50k-100k", label: "5-10万" },
                      { id: "over100k", label: "10万以上" },
                    ].map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange(range.id as string)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          priceRange === range.id
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">创作者认证</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                    />
                    <span className="text-sm">仅看认证创作者</span>
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">版权保护</p>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyCertified}
                      onChange={(e) => setOnlyCertified(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600"
                    />
                    <span className="text-sm">仅看已确权作品</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 排序和结果数 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            共 <span className="font-medium text-gray-900">{filteredIdeas.length}</span> 个创意作品
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">排序：</span>
            <div className="flex items-center gap-1">
              {sortOptions.map((sort) => (
                <button
                  key={sort.id}
                  onClick={() => setSelectedSort(sort.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    selectedSort === sort.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {sort.icon}
                  <span>{sort.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 创意网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredIdeas.map((idea) => (
            <Card 
              key={idea.id} 
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => router.push(`/market/idea/${idea.id}`)}
            >
              {/* 图片 */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <img 
                  src={idea.images[0]} 
                  alt={idea.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* 确权标识 */}
                {idea.certificate && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    已确权
                  </div>
                )}
                {/* 价格标签 */}
                {idea.price && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                    {idea.price}
                  </div>
                )}
                {/* 悬浮操作 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                    onClick={(e) => { e.stopPropagation(); }}
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <CardContent className="p-4">
                {/* 分类和标签 */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.id === idea.category)?.name || idea.category}
                  </Badge>
                  {idea.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* 标题 */}
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {idea.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {idea.description}
                </p>

                {/* 创作者信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={idea.creator.avatar} 
                      alt={idea.creator.name}
                      className="w-6 h-6 rounded-full bg-gray-100"
                    />
                    <span className="text-sm text-gray-600">{idea.creator.name}</span>
                    {idea.creator.verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {idea.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {idea.likes}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 加载更多 */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            加载更多
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </main>
    </div>
  );
}
