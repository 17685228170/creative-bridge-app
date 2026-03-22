"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Image,
  FileText,
  PenTool,
  Bot,
  Paperclip,
  Check,
  Shield,
  Eye,
  Share2,
  Store,
  ChevronRight,
  ChevronLeft,
  X,
  FileImage,
  Box,
  ScrollText,
  Sparkles,
  Link,
  Clock,
  Award,
  Download,
  ArrowRight,
  Lock,
  Globe,
  Users
} from "lucide-react";

const uploadTypes = [
  { id: "design", icon: <Image className="w-6 h-6" />, label: "设计图/插画", formats: "JPG, PNG, AI, PSD" },
  { id: "3d", icon: <Box className="w-6 h-6" />, label: "3D模型/渲染", formats: "OBJ, STL, FBX, BLEND" },
  { id: "sketch", icon: <PenTool className="w-6 h-6" />, label: "概念草图", formats: "手绘稿、线稿、概念图" },
  { id: "copy", icon: <ScrollText className="w-6 h-6" />, label: "文案/脚本", formats: "策划案、剧本、文案" },
  { id: "ai", icon: <Sparkles className="w-6 h-6" />, label: "AI生成作品", formats: "AI绘画、AI设计" },
  { id: "other", icon: <Paperclip className="w-6 h-6" />, label: "其他文件", formats: "其他格式文件" },
];

const categories = [
  "智能硬件",
  "工业设计",
  "平面设计",
  "UI/UX设计",
  "文创产品",
  "建筑设计",
  "服装设计",
  "其他",
];

const publishModes = [
  {
    id: "private",
    title: "仅确权保护，暂不公开",
    desc: "仅进行区块链存证，不对外展示",
    icon: <Lock className="w-5 h-5" />,
    note: "适合：初步创意，需要时间完善",
    color: "bg-gray-500"
  },
  {
    id: "vault",
    title: "存入「创意私库」，等待匹配",
    desc: "对签署保密协议的厂商匿名推荐",
    icon: <Users className="w-5 h-5" />,
    note: "适合：希望对接产业，但需要保护隐私",
    color: "bg-indigo-500"
  },
  {
    id: "public",
    title: "公开发布至「创意集市」",
    desc: "公开作品，直接寻求合作",
    icon: <Globe className="w-5 h-5" />,
    note: "适合：希望快速获得曝光和反馈",
    color: "bg-green-500"
  },
];

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [uploadType, setUploadType] = useState("design");
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "智能硬件",
    tags: [] as string[],
    publishMode: "vault",
    allowAI: false,
    autoProtect: false,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [certificate, setCertificate] = useState<any>(null);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag) && formData.tags.length < 10) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("publishMode", formData.publishMode);
    data.append("tags", JSON.stringify(formData.tags));
    files.forEach((file) => data.append("files", file));

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setTimeout(() => {
          setCertificate(result.certificate);
          setStep(3);
        }, 500);
      }
    } catch (error) {
      console.error("上传失败:", error);
      clearInterval(progressInterval);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />;
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* 步骤标题 */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">选择上传类型</h2>
        <p className="text-sm text-gray-500">请选择您的创意作品类型</p>
      </div>

      {/* 上传类型选择 */}
      <div className="grid grid-cols-2 gap-3">
        {uploadTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all ${
              uploadType === type.id
                ? "border-2 border-indigo-600 bg-indigo-50 shadow-md"
                : "border border-gray-200 hover:border-indigo-300 hover:shadow-sm"
            }`}
            onClick={() => setUploadType(type.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    uploadType === type.id 
                      ? "bg-indigo-600 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {type.icon}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{type.label}</p>
                  <p className="text-xs text-gray-500">{type.formats}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 文件上传区域 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-indigo-600" />
        </div>
        <p className="text-gray-700 font-medium mb-1">点击或拖拽文件到这里</p>
        <p className="text-gray-400 text-sm mb-4">支持批量上传</p>
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>JPG, PNG, PDF</span>
          <span>•</span>
          <span>AI, PSD, OBJ</span>
          <span>•</span>
          <span>≤ 100MB</span>
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* 已选文件列表 */}
      {files.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              已选择 {files.length} 个文件
            </p>
            <span className="text-xs text-gray-500">
              {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(1)}MB
            </span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-2 rounded-lg">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(1)}MB</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 pb-24">
      {/* 步骤标题 */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">填写创意信息</h2>
        <p className="text-sm text-gray-500">完善信息，让更多人发现你的创意</p>
      </div>

      {/* 已上传文件预览 */}
      {files.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
              {files[0].type.startsWith('image/') ? (
                <img 
                  src={URL.createObjectURL(files[0])} 
                  alt="preview" 
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                getFileIcon(files[0].type)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{files[0].name}</p>
              <p className="text-sm text-gray-500">
                {(files[0].size / 1024 / 1024).toFixed(1)}MB · {uploadTypes.find(t => t.id === uploadType)?.label}
              </p>
            </div>
            <Badge variant="outline" className="text-indigo-600 border-indigo-200">
              已上传
            </Badge>
          </div>
        </div>
      )}

      {/* 创意标题 */}
      <div>
        <Label className="text-sm font-medium text-gray-700">创意标题 <span className="text-red-500">*</span></Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="给你的创意起个吸引人的名字"
          className="mt-2"
        />
      </div>

      {/* 所属领域 */}
      <div>
        <Label className="text-sm font-medium text-gray-700">所属领域 <span className="text-red-500">*</span></Label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFormData({ ...formData, category: cat })}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                formData.category === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 创意简介 */}
      <div>
        <Label className="text-sm font-medium text-gray-700">创意简介</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="详细描述你的创意理念、设计思路、应用场景..."
          rows={4}
          className="mt-2 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{formData.description.length}/500 字</p>
      </div>

      {/* 添加标签 */}
      <div>
        <Label className="text-sm font-medium text-gray-700">添加标签</Label>
        <div className="flex gap-2 mt-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="输入标签，按回车添加"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleAddTag}>
            添加
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1">最多添加10个标签，帮助精准匹配</p>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="px-3 py-1 cursor-pointer hover:bg-gray-200"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 发布模式 */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">选择发布模式</Label>
        <div className="space-y-3">
          {publishModes.map((mode) => (
            <Card
              key={mode.id}
              className={`cursor-pointer transition-all ${
                formData.publishMode === mode.id
                  ? "border-2 border-indigo-600 bg-indigo-50 shadow-md"
                  : "border border-gray-200 hover:border-indigo-300"
              }`}
              onClick={() => setFormData({ ...formData, publishMode: mode.id })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      formData.publishMode === mode.id
                        ? "border-indigo-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.publishMode === mode.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    )}
                  </div>
                  <div className={`p-2 rounded-lg ${mode.color} text-white flex-shrink-0`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mode.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{mode.desc}</p>
                    <p className="text-xs text-indigo-600 mt-1.5">{mode.note}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 高级设置 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">高级设置</Label>
        <div className="space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.allowAI}
              onChange={(e) => setFormData({ ...formData, allowAI: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600"
            />
            <div>
              <p className="text-sm text-gray-700">允许AI学习</p>
              <p className="text-xs text-gray-500">允许平台AI学习该作品特征，用于更好的侵权监测和匹配推荐</p>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoProtect}
              onChange={(e) => setFormData({ ...formData, autoProtect: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600"
            />
            <div>
              <p className="text-sm text-gray-700">开启自动维权</p>
              <p className="text-xs text-gray-500">发现侵权时自动启动维权流程（仅限VIP会员）</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      {/* 成功图标 */}
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
        <Check className="w-12 h-12 text-white" />
      </div>

      {/* 成功文案 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">确权成功！</h2>
        <p className="text-gray-600">您的创意已获得法律认可的区块链存证</p>
      </div>

      {/* 证书卡片 */}
      {certificate && (
        <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-amber-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500" />
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-lg font-bold text-gray-900">🌉 创意桥 - 区块链存证证书</p>
              <p className="text-xs text-gray-500 mt-1">具有法律效力的数字版权证明</p>
            </div>
            
            <div className="bg-white/60 rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">存证编号</span>
                <span className="font-mono font-medium text-gray-900">{certificate.certNo}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">作品名称</span>
                <span className="font-medium text-gray-900 truncate max-w-[150px]">{formData.title}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">存证时间</span>
                <span className="text-gray-700">{new Date(certificate.createdAt).toLocaleString('zh-CN')}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">区块链</span>
                <span className="text-indigo-600 font-medium flex items-center gap-1">
                  <Link className="w-3 h-3" />
                  蚂蚁链 AntChain
                </span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between items-center">
                <span className="text-gray-500">交易哈希</span>
                <span className="font-mono text-xs text-gray-600">
                  {certificate.txHash?.slice(0, 16)}...{certificate.txHash?.slice(-8)}
                </span>
              </div>
            </div>

            {/* 证书操作 */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1 bg-white/80">
                <Download className="w-4 h-4 mr-1" />
                下载证书
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-white/80">
                <Share2 className="w-4 h-4 mr-1" />
                分享
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 法律效力说明 */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg py-3">
        <Shield className="w-4 h-4 text-green-500" />
        <span>该存证证书具有法律效力，可作为司法证据使用</span>
      </div>

      {/* 后续操作 */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-auto py-3"
          onClick={() => router.push("/creator/ideas")}
        >
          <Eye className="w-4 h-4 mr-2" />
          查看作品
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-3"
          onClick={() => router.push("/creator/protection")}
        >
          <Shield className="w-4 h-4 mr-2" />
          开启监测
        </Button>
      </div>

      <Button 
        className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base"
        onClick={() => router.push("/creator")}
      >
        完成并返回首页
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      {/* 提示 */}
      <div className="flex items-start gap-2 text-xs text-gray-400 bg-blue-50 rounded-lg p-3">
        <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <span>您可以在「我的创意」中管理所有已确权的作品，随时查看侵权监测报告和合作意向</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 1) {
                router.push("/creator");
              } else if (step < 3) {
                setStep(step - 1);
              }
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {step === 1 ? <X className="w-5 h-5 text-gray-600" /> : <ChevronLeft className="w-5 h-5 text-gray-600" />}
          </button>
          <div className="text-center">
            <h1 className="font-semibold text-gray-900">
              {step === 1 && "上传创意"}
              {step === 2 && "填写信息"}
              {step === 3 && "确权成功"}
            </h1>
            <p className="text-xs text-gray-500">步骤 {step}/3</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: uploading ? `${uploadProgress}%` : `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>

      {/* Footer Actions */}
      {step < 3 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 safe-area-bottom">
          <div className="max-w-2xl mx-auto">
            {uploading ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">正在上传并生成区块链存证...</span>
                  <span className="text-indigo-600 font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                {step > 1 && (
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={() => setStep(step - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    上一步
                  </Button>
                )}
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-12 text-base"
                  onClick={() => {
                    if (step === 2) {
                      handleUpload();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={step === 1 && files.length === 0}
                >
                  {step === 2 ? "确认上传" : "下一步"}
                  {step === 1 && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
