"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Bell,
  MessageSquare,
  FileText,
  Shield,
  DollarSign,
  CheckCircle,
  Clock,
  ChevronRight,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Settings,
  Volume2,
  VolumeX,
  Pin,
  PinOff
} from "lucide-react";

interface Notification {
  id: string;
  type: "system" | "transaction" | "protection" | "cooperation" | "message";
  title: string;
  content: string;
  time: string;
  read: boolean;
  pinned?: boolean;
  action?: {
    text: string;
    href: string;
  };
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: "creator" | "enterprise";
  lastMessage: string;
  lastTime: string;
  unread: number;
  online?: boolean;
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "cooperation",
    title: "新的合作意向",
    content: "小米生态链对您的「智能家居中控面板设计」感兴趣，希望进一步沟通合作细节",
    time: "10分钟前",
    read: false,
    action: { text: "查看详情", href: "/creator/intents" },
  },
  {
    id: "2",
    type: "protection",
    title: "侵权监测提醒",
    content: "系统发现3处高风险侵权线索，涉及您的作品「智能水杯概念设计」",
    time: "1小时前",
    read: false,
    pinned: true,
    action: { text: "立即处理", href: "/creator/protection" },
  },
  {
    id: "3",
    type: "transaction",
    title: "收入到账",
    content: "您的作品授权费 ¥5,000 已到账，可在资产中心查看",
    time: "2小时前",
    read: true,
    action: { text: "查看明细", href: "/creator/assets" },
  },
  {
    id: "4",
    type: "system",
    title: "系统升级完成",
    content: "创意桥平台已完成版本升级，新增AI创意助手功能，快来体验吧！",
    time: "昨天",
    read: true,
  },
  {
    id: "5",
    type: "cooperation",
    title: "需求匹配成功",
    content: "您发布的「文创IP形象设计」需求已匹配到3位优质创作者",
    time: "昨天",
    read: true,
    action: { text: "查看匹配", href: "/enterprise/intents" },
  },
  {
    id: "6",
    type: "protection",
    title: "维权案件更新",
    content: "您的「某宝网侵权案」已有新进展，律师函已送达对方",
    time: "2天前",
    read: true,
    action: { text: "查看案件", href: "/creator/protection" },
  },
  {
    id: "7",
    type: "transaction",
    title: "提现成功",
    content: "您申请的 ¥10,000 提现已到账，到账银行卡：工商银行(尾号8888)",
    time: "3天前",
    read: true,
  },
  {
    id: "8",
    type: "system",
    title: "会员到期提醒",
    content: "您的黄金会员将于7天后到期，续费可继续享受专属权益",
    time: "3天前",
    read: false,
    action: { text: "立即续费", href: "/vip" },
  },
];

// 模拟对话数据
const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "小米生态链",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=xiaomi",
    role: "enterprise",
    lastMessage: "我们对您的设计很感兴趣，希望能详细了解一下合作方式",
    lastTime: "10分钟前",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "张律师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lawyer",
    role: "creator",
    lastMessage: "侵权案件的材料我已经准备好了，明天可以提交法院",
    lastTime: "1小时前",
    unread: 1,
  },
  {
    id: "3",
    name: "海尔智家",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=haier",
    role: "enterprise",
    lastMessage: "好的，我们会尽快安排设计评审会议",
    lastTime: "3小时前",
    unread: 0,
  },
  {
    id: "4",
    name: "创意桥客服",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=service",
    role: "creator",
    lastMessage: "您好，关于VIP会员的问题已为您解答",
    lastTime: "昨天",
    unread: 0,
    online: true,
  },
  {
    id: "5",
    name: "故宫博物院文创",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=gu Gong",
    role: "enterprise",
    lastMessage: "设计方案我们很满意，可以进入下一步合同签署",
    lastTime: "2天前",
    unread: 0,
  },
];

const notificationTypes = [
  { id: "all", name: "全部", icon: <Bell className="w-4 h-4" /> },
  { id: "cooperation", name: "合作", icon: <MessageSquare className="w-4 h-4" /> },
  { id: "protection", name: "维权", icon: <Shield className="w-4 h-4" /> },
  { id: "transaction", name: "交易", icon: <DollarSign className="w-4 h-4" /> },
  { id: "system", name: "系统", icon: <FileText className="w-4 h-4" /> },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "cooperation":
      return <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-600" /></div>;
    case "protection":
      return <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>;
    case "transaction":
      return <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><DollarSign className="w-5 h-5 text-green-600" /></div>;
    case "system":
      return <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center"><FileText className="w-5 h-5 text-gray-600" /></div>;
    default:
      return <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-indigo-600" /></div>;
  }
};

export default function MessagesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("notifications");
  const [selectedType, setSelectedType] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);

  const filteredNotifications = notifications.filter(n => {
    if (selectedType !== "all" && n.type !== selectedType) return false;
    if (searchQuery && !n.title.includes(searchQuery) && !n.content.includes(searchQuery)) return false;
    return true;
  });

  const filteredConversations = conversations.filter(c => {
    if (searchQuery && !c.name.includes(searchQuery) && !c.lastMessage.includes(searchQuery)) return false;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleTogglePin = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleBatchDelete = () => {
    setNotifications(notifications.filter(n => !selectedItems.includes(n.id)));
    setSelectedItems([]);
    setSelectMode(false);
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">消息中心</h1>
              <p className="text-xs text-gray-500">
                {unreadCount + unreadMessages > 0 ? `${unreadCount + unreadMessages} 条未读` : "全部已读"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === "notifications" && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectMode(!selectMode)}
                >
                  {selectMode ? "取消" : "选择"}
                </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="notifications" className="relative">
              通知
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              消息
              {unreadMessages > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                  {unreadMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* 通知 Tab */}
          <TabsContent value="notifications" className="mt-4 space-y-4">
            {/* 搜索和筛选 */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索通知..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                全部已读
              </Button>
            </div>

            {/* 类型筛选 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {notificationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedType === type.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border"
                  }`}
                >
                  {type.icon}
                  <span>{type.name}</span>
                </button>
              ))}
            </div>

            {/* 批量操作栏 */}
            {selectMode && (
              <Card className="bg-indigo-50 border-indigo-200">
                <CardContent className="p-3 flex items-center justify-between">
                  <span className="text-sm text-indigo-700">
                    已选择 {selectedItems.length} 条通知
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedItems([])}
                    >
                      取消选择
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleBatchDelete}
                      disabled={selectedItems.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 通知列表 */}
            <div className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">暂无通知</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`hover:shadow-md transition-shadow ${
                      !notification.read ? "bg-blue-50/50" : ""
                    } ${notification.pinned ? "border-l-4 border-l-indigo-500" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {selectMode ? (
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(notification.id)}
                            onChange={() => toggleSelection(notification.id)}
                            className="mt-2 w-4 h-4 rounded border-gray-300 text-indigo-600"
                          />
                        ) : (
                          getNotificationIcon(notification.type)
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                                {notification.pinned && (
                                  <Pin className="w-3 h-3 text-indigo-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex gap-2">
                              {notification.action && (
                                <Button 
                                  size="sm" 
                                  className="h-8"
                                  onClick={() => router.push(notification.action!.href)}
                                >
                                  {notification.action.text}
                                </Button>
                              )}
                              {!notification.read && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  标记已读
                                </Button>
                              )}
                            </div>
                            
                            {!selectMode && (
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => handleTogglePin(notification.id)}
                                  className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                  {notification.pinned ? (
                                    <PinOff className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <Pin className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDelete(notification.id)}
                                  className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* 消息 Tab */}
          <TabsContent value="messages" className="mt-4 space-y-4">
            {/* 搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索联系人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* 对话列表 */}
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">暂无消息</p>
                  </CardContent>
                </Card>
              ) : (
                filteredConversations.map((conversation) => (
                  <Card 
                    key={conversation.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/messages/${conversation.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img 
                            src={conversation.avatar} 
                            alt={conversation.name}
                            className="w-12 h-12 rounded-full bg-gray-100"
                          />
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{conversation.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {conversation.role === "enterprise" ? "企业" : "创作者"}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-400">{conversation.lastTime}</span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-sm truncate ${conversation.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                              {conversation.lastMessage}
                            </p>
                            {conversation.unread > 0 && (
                              <Badge className="bg-red-500 text-white ml-2">
                                {conversation.unread}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
