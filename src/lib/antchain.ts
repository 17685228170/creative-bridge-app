import { calculateContentHash } from "./crypto";

// 蚂蚁链存证服务配置
const ANTCHAIN_CONFIG = {
  // 是否使用真实蚂蚁链（需要配置环境变量）
  USE_REAL_CHAIN: process.env.ANTCHAIN_ENABLED === "true",
  
  // 蚂蚁链开放联盟链配置
  APP_KEY: process.env.ANTCHAIN_ACCESS_KEY || "",
  APP_SECRET: process.env.ANTCHAIN_SECRET_KEY || "",
  ENDPOINT: process.env.ANTCHAIN_ENDPOINT || "https://openapi.antchain.antgroup.com/gateway.do",
  
  // 链 ID
  CHAIN_ID: "antchain-open",
  
  // 存证模板 ID（需要在蚂蚁链控制台创建）
  TEMPLATE_ID: process.env.ANTCHAIN_TEMPLATE_ID || "",
};

export interface NotarizeRequest {
  fileHash: string;
  creatorId: string;
  title: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface NotarizeResponse {
  success: boolean;
  txHash: string;
  chainId: string;
  blockNumber: string;
  certNo: string;
  certUrl: string;
  contentHash: string;
  timestamp: number;
  error?: string;
}

// 生成签名（用于蚂蚁链 API 调用）
function generateSignature(params: Record<string, string>, appSecret: string): string {
  // 按参数名排序
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys.map(key => `${key}=${params[key]}`).join("&");
  
  // 使用 HMAC-SHA256 签名（简化实现）
  const crypto = require("crypto");
  return crypto.createHmac("sha256", appSecret).update(signStr).digest("hex");
}

// 真实蚂蚁链存证
async function realNotarizeOnChain(data: NotarizeRequest): Promise<NotarizeResponse> {
  try {
    const timestamp = Date.now();
    const contentHash = calculateContentHash({
      fileHash: data.fileHash,
      creatorId: data.creatorId,
      timestamp,
      title: data.title,
      metadata: data.metadata,
    });

    // 构建请求参数
    const params: Record<string, string> = {
      app_key: ANTCHAIN_CONFIG.APP_KEY,
      timestamp: String(timestamp),
      method: "antchain.baas.notary.notary",
      version: "1.0",
      sign_type: "HMAC-SHA256",
      chain_id: ANTCHAIN_CONFIG.CHAIN_ID,
      template_id: ANTCHAIN_CONFIG.TEMPLATE_ID,
      content_hash: contentHash,
      content: JSON.stringify({
        fileHash: data.fileHash,
        creatorId: data.creatorId,
        title: data.title,
        description: data.description,
        metadata: data.metadata,
        timestamp,
      }),
    };

    // 生成签名
    params.sign = generateSignature(params, ANTCHAIN_CONFIG.APP_SECRET);

    // 调用蚂蚁链 API
    const response = await fetch(ANTCHAIN_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    const result = await response.json();

    if (result.code !== "OK") {
      throw new Error(result.msg || "存证失败");
    }

    return {
      success: true,
      txHash: result.data.tx_hash,
      chainId: ANTCHAIN_CONFIG.CHAIN_ID,
      blockNumber: String(result.data.block_number),
      certNo: result.data.cert_no,
      certUrl: result.data.cert_url,
      contentHash,
      timestamp,
    };
  } catch (error: any) {
    console.error("蚂蚁链存证错误:", error);
    return {
      success: false,
      txHash: "",
      chainId: "",
      blockNumber: "",
      certNo: "",
      certUrl: "",
      contentHash: "",
      timestamp: Date.now(),
      error: error.message,
    };
  }
}

// Mock 存证（开发测试用）
async function mockNotarizeOnChain(data: NotarizeRequest): Promise<NotarizeResponse> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const timestamp = Date.now();
  const contentHash = calculateContentHash({
    fileHash: data.fileHash,
    creatorId: data.creatorId,
    timestamp,
    title: data.title,
    metadata: data.metadata,
  });
  
  // 生成模拟的链上数据
  const mockTxHash = "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
  const mockCertNo = `CB${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
  
  return {
    success: true,
    txHash: mockTxHash,
    chainId: "antchain-open",
    blockNumber: String(Math.floor(Date.now() / 1000)),
    certNo: mockCertNo,
    certUrl: `https://cert.antchain.antgroup.com/${mockCertNo}`,
    contentHash,
    timestamp,
  };
}

// 主存证函数
export async function notarizeOnChain(data: NotarizeRequest): Promise<NotarizeResponse> {
  if (ANTCHAIN_CONFIG.USE_REAL_CHAIN && ANTCHAIN_CONFIG.APP_KEY && ANTCHAIN_CONFIG.APP_SECRET) {
    return realNotarizeOnChain(data);
  }
  return mockNotarizeOnChain(data);
}

// 验证存证
export async function verifyOnChain(txHash: string): Promise<{
  valid: boolean;
  data?: {
    txHash: string;
    blockNumber: string;
    timestamp: number;
    contentHash: string;
  };
  error?: string;
}> {
  // 如果没有配置真实蚂蚁链，使用 Mock 验证
  if (!ANTCHAIN_CONFIG.USE_REAL_CHAIN || !ANTCHAIN_CONFIG.APP_KEY) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const isValid = txHash.startsWith("0x") && txHash.length === 66;
    return {
      valid: isValid,
      data: isValid ? {
        txHash,
        blockNumber: String(Math.floor(Date.now() / 1000) - 1000),
        timestamp: Date.now() - 86400000,
        contentHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
      } : undefined,
    };
  }

  try {
    const params: Record<string, string> = {
      app_key: ANTCHAIN_CONFIG.APP_KEY,
      timestamp: String(Date.now()),
      method: "antchain.baas.notary.query",
      version: "1.0",
      sign_type: "HMAC-SHA256",
      chain_id: ANTCHAIN_CONFIG.CHAIN_ID,
      tx_hash: txHash,
    };

    params.sign = generateSignature(params, ANTCHAIN_CONFIG.APP_SECRET);

    const response = await fetch(ANTCHAIN_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    const result = await response.json();

    if (result.code !== "OK") {
      return { valid: false, error: result.msg };
    }

    return {
      valid: true,
      data: {
        txHash: result.data.tx_hash,
        blockNumber: String(result.data.block_number),
        timestamp: result.data.timestamp,
        contentHash: result.data.content_hash,
      },
    };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

// 查询存证证书
export async function queryCertificate(certNo: string): Promise<{
  found: boolean;
  certificate?: {
    certNo: string;
    txHash: string;
    contentHash: string;
    timestamp: number;
    content: any;
  };
  error?: string;
}> {
  if (!ANTCHAIN_CONFIG.USE_REAL_CHAIN || !ANTCHAIN_CONFIG.APP_KEY) {
    // Mock 查询
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      found: true,
      certificate: {
        certNo,
        txHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
        contentHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(""),
        timestamp: Date.now() - 86400000,
        content: { mock: true },
      },
    };
  }

  try {
    const params: Record<string, string> = {
      app_key: ANTCHAIN_CONFIG.APP_KEY,
      timestamp: String(Date.now()),
      method: "antchain.baas.notary.queryCert",
      version: "1.0",
      sign_type: "HMAC-SHA256",
      chain_id: ANTCHAIN_CONFIG.CHAIN_ID,
      cert_no: certNo,
    };

    params.sign = generateSignature(params, ANTCHAIN_CONFIG.APP_SECRET);

    const response = await fetch(ANTCHAIN_CONFIG.ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(params),
    });

    const result = await response.json();

    if (result.code !== "OK") {
      return { found: false, error: result.msg };
    }

    return {
      found: true,
      certificate: {
        certNo: result.data.cert_no,
        txHash: result.data.tx_hash,
        contentHash: result.data.content_hash,
        timestamp: result.data.timestamp,
        content: JSON.parse(result.data.content),
      },
    };
  } catch (error: any) {
    return { found: false, error: error.message };
  }
}
