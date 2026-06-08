# 邀请制 AI/API Gateway 平台 PRD v0.1

## 1. 项目定位

本项目是一个面向内部使用的 **邀请制 AI/API Gateway 平台**。

它同时提供：

1. 网页端 AI 对话体验；
2. OpenAI-compatible API 分发；
3. 多上游 API 聚合；
4. 订阅号池 / 中转站 API / 用户自带 API 的统一接入；
5. 搜索 API、网页读取 API 等非 AI API 的统一分发；
6. 邀请码注册、兑换码换余额、用户额度与调用统计。

项目不是单纯的“中转站”，而是一个：

> **多上游 AI/API 资源编排平台 + 高质量 Web Chat。**

---

## 2. 核心目标

### 2.1 产品目标

第一阶段目标是做出一个内部可用的 MVP：

用户可以通过邀请码注册，使用兑换码获得余额，然后在网页端直接对话，或创建 API Key 调用平台接口。

管理员可以接入不同类型的上游资源，包括：

- New API / 其他中转站 API；
- Sub2API 类型的订阅号池；
- CPA / CLIProxyAPI 类型的账号池服务；
- 官方或第三方 OpenAI-compatible API；
- 搜索 API；
- 网页读取 API；
- 自定义 HTTP API。

### 2.2 工程目标

系统必须具备可维护性，不能把多个开源项目简单拼在一起。

核心原则：

> **用户和管理员只面对一个统一平台。New API、Sub2API、CPA 只能作为内部 Connector 或参考实现，不能成为多个并列主系统。**

---

## 3. 非目标

第一阶段暂不追求：

- 公开注册；
- 在线支付；
- 分销系统；
- 复杂代理商体系；
- 多租户企业组织；
- 全自动注册账号；
- 复杂工作流/RAG 应用平台；
- 完整替代 New API / Sub2API / CPA 的全部功能。

第一版只做最小可维护闭环。

---

## 4. 用户角色

### 4.1 普通用户

普通用户可以：

- 使用邀请码注册；
- 使用兑换码兑换余额；
- 在网页端对话；
- 创建自己的 API Key；
- 查看余额、用量、调用记录；
- 配置自己的 BYOK API；
- 选择模型或服务；
- 使用联网搜索、网页读取等功能。

### 4.2 管理员

管理员可以：

- 创建邀请码；
- 创建余额兑换码；
- 管理用户；
- 管理上游 Provider；
- 管理账号池 / Key 池；
- 配置路由规则；
- 配置服务价格和倍率；
- 查看请求日志、错误日志、健康状态；
- 手动禁用用户、Key、Provider、Pool 或 Route。

---

## 5. 总体架构

系统整体采用“统一 Gateway Core + 多 Connector”架构。

```text
用户 Web Chat / 用户 API
        ↓
统一鉴权层
        ↓
Gateway Core
        ↓
Route Engine
        ↓
Connector 层
        ├─ OpenAI-compatible Connector
        ├─ New API Connector
        ├─ Sub2API Connector
        ├─ CPA / CLIProxyAPI Connector
        ├─ Search API Connector
        ├─ Reader API Connector
        └─ Custom HTTP Connector
        ↓
上游服务
```

重要原则：

- 不允许出现多个主路由中心；
- 不允许 New API、Sub2API、CPA 同时独立计费；
- 不允许用户在多个系统 UI 之间切换；
- 所有请求必须经过本平台统一鉴权、统一日志、统一计费、统一错误处理。

---

## 6. 核心抽象模型

### 6.1 Provider

表示一个上游服务来源。

例如：

- OpenAI；
- Claude；
- Gemini；
- New API 实例；
- Sub2API 实例；
- CPA / CLIProxyAPI 实例；
- SearXNG；
- Jina Reader；
- Firecrawl；
- 自定义 HTTP API。

字段示例：

```text
id
name
provider_type
base_url
status
health_status
created_at
updated_at
```

### 6.2 Credential

表示一个可调用凭证。

可以是：

- API Key；
- 账号 token；
- Sub2API token；
- CPA 凭证；
- 用户自带 API Key；
- 搜索 API Key。

字段示例：

```text
id
provider_id
credential_type
encrypted_secret
owner_type: system/user
owner_user_id
status
last_used_at
last_error
created_at
updated_at
```

所有密钥必须加密存储。

### 6.3 Pool

表示凭证池。

例如：

- Claude 订阅账号池；
- Codex 账号池；
- OpenAI API Key 池；
- 搜索 API Key 池。

字段示例：

```text
id
name
provider_id
pool_type
strategy
status
max_concurrency
cooldown_seconds
created_at
updated_at
```

### 6.4 Connector

Connector 是可维护性的核心。

每一种上游只允许通过 Connector 接入 Gateway Core。

Connector 必须实现统一接口：

```text
listModels()
checkHealth()
chatCompletion()
responses()
embedding()
search()
readUrl()
calculateUsage()
normalizeError()
```

不同 Connector 可以只实现其中一部分能力。

例如：

- Sub2API Connector 主要实现 chatCompletion / responses；
- Search Connector 主要实现 search；
- Reader Connector 主要实现 readUrl；
- OpenAI-compatible Connector 主要实现 chatCompletion / embedding。

### 6.5 Service

Service 表示对外提供的服务类型，不再只用“模型”来表达一切。

服务类型包括：

```text
llm.chat
llm.responses
llm.embedding
llm.rerank
image.generate
search.web
search.news
reader.url
custom.http
```

这样搜索 API、网页读取 API 不需要伪装成 AI 模型。

### 6.6 Route

Route 决定某个服务请求应该走哪个上游。

字段示例：

```text
id
service_type
public_model_name
target_provider_id
target_pool_id
target_model_name
priority
weight
fallback_order
enabled
```

示例：

```text
用户请求：gpt-4.1-mini
Route Engine：
  优先走 Provider A
  失败后走 Provider B
  再失败走 Sub2API Pool C
```

### 6.7 Product

Product 是用户可见的产品或服务包。

例如：

- 普通聊天模型；
- 高级模型；
- 联网搜索；
- 网页读取；
- Codex 额度；
- 自定义 API 调用额度。

字段示例：

```text
id
name
service_type
price_rule
allowed_user_group
enabled
```

### 6.8 Ledger

余额必须用账本模型，不能直接改余额。

每次充值、兑换、消费、退款都写入 Ledger。

字段示例：

```text
id
user_id
change_amount
balance_after
source
related_request_id
related_redeem_code
operator_id
created_at
```

---

## 7. 核心功能模块

### 7.1 邀请码注册

用户必须通过邀请码注册。

邀请码支持：

- 最大使用次数；
- 过期时间；
- 创建人；
- 备注；
- 是否启用；
- 邀请链追踪。

基础流程：

```text
管理员创建邀请码
用户输入邀请码注册
系统校验邀请码
创建用户
记录邀请关系
```

### 7.2 兑换码换余额

兑换码用于内部发放余额。

兑换码支持：

- 固定金额；
- 最大使用次数；
- 过期时间；
- 指定用户组；
- 管理员备注；
- 启用/禁用。

兑换流程：

```text
用户输入兑换码
系统校验兑换码
写入 Ledger
更新用户可用余额
记录兑换行为
```

### 7.3 用户 API Key

用户可以创建平台自己的 API Key。

每个 API Key 支持：

- 名称；
- 可用服务范围；
- 每日限额；
- 总额度限制；
- 启用/禁用；
- 最后调用时间。

对外接口第一阶段优先支持：

```text
/v1/chat/completions
/v1/responses
/v1/models
/v1/search
/v1/reader
```

### 7.4 Web Chat

Web Chat 是项目差异化核心，不能只做简单测试页面。

第一版必须支持：

- 流式输出；
- Markdown；
- 代码块；
- LaTeX；
- 会话历史；
- 模型选择；
- 余额显示；
- 联网搜索开关；
- 引用来源展示；
- 失败重试；
- 停止生成；
- BYOK 模式切换。

后续增强：

- 文件上传；
- 对话导出；
- 多模态；
- 工具调用过程展示；
- 快捷提示词；
- 收藏会话；
- 搜索历史对话。

### 7.5 BYOK 用户自带 API

用户可以导入自己的 API。

第一版支持：

- OpenAI-compatible；
- Claude-compatible；
- Gemini-compatible；
- 自定义 Base URL + API Key。

默认规则：

```text
用户自带 API 默认仅本人可用
不进入公共池
不参与平台统一分发
管理员不可明文查看用户 Key
```

用户可以在 Web Chat 中选择：

```text
使用平台余额
使用我的 API
```

### 7.6 Provider 管理

管理员可以添加上游 Provider。

第一版 Provider 类型：

```text
openai_compatible
newapi
sub2api
cpa
search
reader
custom_http
```

每个 Provider 必须支持：

- 连通性测试；
- 流式测试；
- 模型/服务发现；
- 健康状态；
- 最近错误；
- 启用/禁用。

### 7.7 Pool 管理

账号池 / Key 池需要统一管理。

支持：

- 凭证批量导入；
- 凭证状态；
- 健康检查；
- 失败冷却；
- 并发限制；
- 权重；
- 熔断；
- 手动启用/禁用。

状态枚举：

```text
ready
cooldown
quota_exhausted
auth_failed
rate_limited
network_error
disabled
```

### 7.8 路由规则

路由规则由管理员配置。

必须支持：

- 按模型路由；
- 按服务类型路由；
- 按用户组路由；
- 按权重路由；
- fallback；
- 禁用某个上游；
- 灰度切换。

示例：

```text
普通用户 gpt-4o-mini → 便宜中转站
高级用户 gpt-4o-mini → 官方 API
Codex 模型 → CPA Connector
Claude 订阅资源 → Sub2API Connector
联网搜索 → Search Connector
网页读取 → Reader Connector
```

### 7.9 搜索 API / Reader API

搜索和网页读取必须作为独立服务类型，不塞进 LLM 模型系统。

第一版支持：

```text
/v1/search
/v1/reader
```

Web Chat 联网搜索流程：

```text
用户开启联网搜索
系统调用 search.web
获得搜索结果
必要时调用 reader.url
整理引用来源
传入 LLM
输出带引用的回答
```

### 7.10 日志与统计

日志分三类。

#### 请求日志

记录：

```text
request_id
user_id
api_key_id
service_type
model
provider
route
status
latency
cost
created_at
```

#### 错误日志

记录：

```text
request_id
error_type
provider_error_code
normalized_error_code
message
retry_count
created_at
```

#### 审计日志

记录管理员行为：

```text
operator_id
action
target_type
target_id
before
after
created_at
```

---

## 8. 计费设计

第一版采用简单余额模型。

消费来源：

- Web Chat；
- 用户 API Key；
- 搜索 API；
- Reader API。

计费规则：

```text
LLM：按 token / 请求估算
Search：按请求次数
Reader：按网页读取次数
Custom HTTP：按请求次数
```

所有消费都必须写入 Ledger。

不要让 New API、Sub2API、CPA 各自独立对用户计费。它们只能作为上游成本来源。

---

## 9. UI 设计原则

### 9.1 只保留一个主 UI

用户和管理员只进入本平台 UI。

New API / Sub2API / CPA 原始管理台最多作为高级调试入口，不作为日常产品入口。

### 9.2 用户端页面

```text
Chat
API Keys
用量与余额
BYOK
服务目录
兑换码
文档
设置
```

### 9.3 管理端页面

```text
Dashboard
Users
Invites
Redeem Codes
Providers
Pools
Routes
Products
Logs
Search Hub
System
```

### 9.4 配置向导

添加上游时不要只给一张表单，要做向导：

```text
选择 Provider 类型
填写 Base URL / Key
自动测试连接
拉取模型/服务
测试流式输出
设置价格与路由
发布服务
```

这样后续维护成本会低很多。

---

## 10. 可维护性要求

这是本项目最重要的工程要求。

### 10.1 Connector 隔离

所有上游差异必须封装在 Connector 内。

Gateway Core 不应该知道 Sub2API、CPA、New API 的内部细节。

错误示例：

```text
业务代码里到处 if provider == sub2api
```

正确做法：

```text
Gateway Core 调用统一 Connector 接口
Sub2APIConnector 内部处理 Sub2API 特有逻辑
```

### 10.2 单一计费中心

所有用户余额、扣费、退款、兑换都由本平台 Ledger 负责。

禁止：

```text
New API 记一次账
Sub2API 记一次账
本平台再记一次账
```

允许：

```text
上游返回 usage
Connector 标准化 usage
Gateway Core 计算价格
Ledger 写入消费记录
```

### 10.3 单一日志中心

所有请求都生成统一 `request_id`。

请求链路中每一层都要带上这个 ID。

```text
Web Chat
Gateway Core
Route Engine
Connector
Upstream
```

这样后面排查问题不会乱。

### 10.4 单一路由中心

只有 Gateway Core 的 Route Engine 决定走哪个上游。

Sub2API / CPA 内部可以做账号池调度，但不能决定用户层面的服务路由。

### 10.5 明确服务类型

不要所有东西都叫 model。

必须区分：

```text
llm.chat
llm.embedding
search.web
reader.url
custom.http
```

这样后面扩展不会混乱。

### 10.6 版本化接口

内部 Connector 接口需要版本号。

例如：

```text
Connector API v1
```

后续扩展不能随便破坏已有 Connector。

### 10.7 配置优先，少写死

模型名映射、路由、价格、权重、fallback 都应配置化。

不要写死在代码里。

### 10.8 测试要求

第一版至少要有：

```text
Connector 单元测试
路由规则测试
余额扣费测试
兑换码测试
邀请码测试
API Key 鉴权测试
流式输出测试
错误标准化测试
```

每增加一种 Connector，都要提供最小测试用例。

---

## 11. 推荐技术实现

第一版可以采用：

```text
前端：Next.js / React
后端：Node.js NestJS 或 Python FastAPI
数据库：PostgreSQL
缓存：Redis
队列：BullMQ / Celery / RQ
部署：Docker Compose
日志：结构化 JSON 日志
```

如果想更快，可以：

```text
短期：基于 New API / Sub2API / CPA 做外部服务接入
中期：自研统一 Gateway Core
长期：把 New API / Sub2API / CPA 都降级成可替换 Connector
```

不建议一开始就把多个项目源码强行揉成一个大仓库。

更可维护的方式是：

```text
主平台独立开发
New API / Sub2API / CPA 作为独立服务或 Connector
通过 HTTP API 对接
后续再按需要吸收部分实现
```

---

## 12. MVP 范围

第一版 MVP 只做这些：

```text
1. 邀请码注册
2. 兑换码换余额
3. 用户余额账本
4. 用户 API Key
5. Web Chat
6. OpenAI-compatible API 转发
7. Sub2API Provider 接入
8. CPA Provider 接入
9. Search Provider 接入
10. 基础 Provider 健康检查
11. 基础请求日志
12. 基础管理员后台
```

暂不做：

```text
在线支付
分销系统
代理商系统
复杂权限组织
复杂工作流
全自动注册账号
公开市场
插件商城
```

---

## 13. 分阶段路线

### Phase 1：内部 MVP

目标：能内部使用。

完成：

- 用户注册邀请码；
- 兑换码余额；
- Web Chat；
- API Key；
- 一个 OpenAI-compatible 上游；
- 一个 Sub2API 上游；
- 一个 CPA 上游；
- 一个 Search 上游；
- 基础日志和扣费。

### Phase 2：统一控制台

目标：不再依赖多个后台来回配置。

完成：

- Provider 管理；
- Pool 管理；
- Route 管理；
- Product 管理；
- Logs 页面；
- 健康检查；
- 错误标准化。

### Phase 3：工程化 Gateway Core

目标：平台变成真正可维护的 API Gateway。

完成：

- Connector SDK；
- 路由策略增强；
- fallback；
- 熔断；
- 成本分析；
- 统一监控；
- 多服务类型扩展；
- 完整测试体系。

---

## 14. 关键风险

### 14.1 架构套娃风险

风险：

```text
你的平台 → New API → Sub2API → CPA → 上游
```

控制方式：

```text
Gateway Core 只调用平级 Connector
不要让多个系统互相嵌套成主链路
```

### 14.2 UI 混乱风险

风险：

```text
用户去你的 UI
管理员去 New API UI
又去 Sub2API UI
又去 CPA UI
```

控制方式：

```text
只做一个统一控制台
其他后台仅作为高级调试入口
```

### 14.3 计费混乱风险

风险：

```text
多个系统重复计费
usage 对不上
余额对不上
```

控制方式：

```text
本平台 Ledger 是唯一用户账本
上游 usage 只是成本参考
```

### 14.4 Connector 失控风险

风险：

```text
每接一个上游都改一堆核心代码
```

控制方式：

```text
定义 Connector 标准接口
新上游只新增 Connector
不修改 Gateway Core
```

---

## 15. 一句话总结

这个项目第一版应该做成：

> **邀请制内部 AI/API Gateway，统一管理用户、余额、Web Chat、API Key、Provider、Pool、Route 和日志；New API、Sub2API、CPA 都只是可替换 Connector 或参考实现，不允许多个开源系统在产品层互相套娃。**

这版 PRD 的核心思想就是：**先统一抽象，再接入上游；先做一个平台，再利用开源项目，而不是把几个开源后台拼成一个产品。**
