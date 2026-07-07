# 明格大屏 BrightScreen

> 一个面向学生与零基础初学者的**公开开源教学型数据可视化大屏项目**，带你从 0 到 1 完整搭建一个专业的数据可视化大屏。

明格大屏（BrightScreen）用最直白的方式，演示「布局 → 组件 → 数据接入 → 动态渲染」的完整流程。项目内置 Mock 数据、分层数据源切换、可扩展日志系统与双套测试，开箱即可运行、可教学、可二次开发。

---

## 一、项目预览

![明格大屏 BrightScreen 预览图](./docs/assets/dashboard-preview.png)

> 上图为本地运行后自动截图（`npm run screenshot` 生成），展示 1920×1080 自适应大屏：顶部标题栏、4 组核心指标卡、全国地图态势、访问趋势折线、分类占比饼图、城市排名柱状、能力雷达与底部实时动态滚动列表。

---

## 二、功能特性

- **纯前端教学演示**：现阶段仅前端，无后端代码，数据全部由 Mock 驱动。
- **分层数据源切换**：通过环境变量 `VITE_DATA_SOURCE` 在 `mock` / `api` 间切换，业务组件零改动。
- **6 类 Mock 数据集**：核心汇总、时间趋势、分类占比、城市排名、雷达多维、实时活动，统一存放于 `src/mocks/`。
- **可扩展日志系统**：`src/logs/logger.ts` 提供 `info / warn / error / debug`，预留 Sentry 等线上监控接入点。
- **完整质量管控**：ESLint + Prettier + Stylelint + TypeScript Strict 模式。
- **双套测试体系**：Vitest 单元测试 + Playwright 端到端测试。
- **自动化截图**：一行命令生成大屏预览图，便于文档与演示。

---

## 三、技术栈

| 分类       | 技术                          |
| ---------- | ----------------------------- |
| 构建工具   | Vite                          |
| 核心框架   | Vue 3                         |
| 开发语言   | TypeScript（Strict 严格模式） |
| 可视化图表 | ECharts                       |
| 状态管理   | Pinia                         |
| 请求工具   | Axios                         |
| 接口 Mock  | MSW                           |
| 单元测试   | Vitest                        |
| 端到端测试 | Playwright                    |
| 质量工具   | ESLint / Prettier / Stylelint |

---

## 四、目录结构

```
BrightScreen/
├── public/                  # 静态资源（favicon、china.json 地图、MSW worker）
├── scripts/
│   └── screenshot.mjs       # 自动化截图脚本
├── docs/assets/             # 文档图片（预览截图）
├── src/
│   ├── app/                 # 应用入口 App.vue / main.ts
│   ├── assets/              # 全局样式
│   ├── components/          # 通用组件 BasePanel / MetricCard / ScreenHeader
│   ├── charts/              # 图表封装（折线/柱状/饼图/雷达/地图）
│   ├── views/               # 页面视图 DashboardView
│   ├── layouts/             # 大屏布局 BigScreenLayout
│   ├── services/            # 业务服务层 http / dashboardService / dataSource
│   ├── mocks/               # Mock 数据 dashboardMock / handlers / browser
│   ├── stores/              # Pinia 状态 dashboardStore
│   ├── utils/               # 工具函数 format / resize / chart
│   ├── logs/                # 日志系统 logger
│   ├── types/               # 全局类型定义
│   └── tests/               # 单元与端到端测试
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 五、快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务（默认端口 5180）
npm run dev

# 3. 生产构建
npm run build

# 4. 预览构建产物
npm run preview
```

浏览器访问 `http://127.0.0.1:5180/` 即可看到大屏。

> 说明：本机 `5173` 端口常被其它项目占用，BrightScreen 已默认使用 `5180`，避免冲突。

---

## 六、双数据源切换

通过环境变量 `VITE_DATA_SOURCE` 控制数据来源，**业务组件无需任何改动**：

| 模式         | 取值                    | 行为                                                    |
| ------------ | ----------------------- | ------------------------------------------------------- |
| Mock（默认） | `VITE_DATA_SOURCE=mock` | 启动 MSW 拦截请求，返回模拟数据                         |
| 真实后端     | `VITE_DATA_SOURCE=api`  | 关闭 MSW，Axios 直连 `VITE_API_BASE_URL` 指定的真实接口 |

示例 `.env`：

```bash
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=/api
```

切换为 `api` 模式后，只需保证后端提供 `/api/dashboard` 与 `/api/dashboard/activity` 两个接口，返回结构与 `src/types/dashboard.ts` 一致即可平滑接入。

---

## 七、日志系统

`src/logs/logger.ts` 提供统一的日志实例：

```ts
import { logger } from '@/logs/logger'

logger.info('启动完成')
logger.warn('CPU 使用率偏高')
logger.error('请求失败', err)
logger.debug('调试信息', meta)
```

- 开发环境默认打印到浏览器控制台。
- 预留扩展入口：通过 `logger.addTransport(transport)` 可快速接入 Sentry 等线上日志监控平台。

---

## 八、测试体系

### 单元测试（Vitest）

```bash
npm run test
```

覆盖：

- 工具函数格式化输出正确性（`src/tests/unit/format.test.ts`）。
- 业务服务层在 Mock 环境下正常返回模拟数据（`src/tests/unit/dashboardService.test.ts`）。

### 端到端测试（Playwright）

```bash
npm run test:e2e
```

自动打开页面并校验：标题渲染、核心指标卡可见、图表容器已挂载、控制台无 Error 级报错。

---

## 九、自动化截图

项目内置截图脚本，可一键生成大屏预览图，常用于文档与演示：

```bash
npm run screenshot
```

脚本逻辑（`scripts/screenshot.mjs`）：

1. 独立启动一个临时 Vite 服务（占用专用端口 `5199`）。
2. 使用 Playwright 以 1920×1080、2 倍像素比加载页面。
3. 等待图表挂载与数据渲染完成后截图。
4. 截图保存到 `docs/assets/dashboard-preview.png`，并关闭临时服务。

如需自定义端口，可设置环境变量：

```bash
SCREENSHOT_PORT=5200 npm run screenshot
```

---

## 十、脚本命令一览

| 命令                 | 说明                       |
| -------------------- | -------------------------- |
| `npm run dev`        | 启动本地开发服务           |
| `npm run build`      | 生产打包（含类型检查）     |
| `npm run preview`    | 预览打包产物               |
| `npm run lint`       | 全项目代码规范校验         |
| `npm run format`     | 自动格式化全部代码         |
| `npm run test`       | 运行单元测试               |
| `npm run test:e2e`   | 运行 Playwright 端到端测试 |
| `npm run screenshot` | 自动生成大屏预览截图       |

---

## 十一、架构说明（分层理念）

```
组件层 (components / charts / views / layouts)
        │  仅通过 store 读取数据
        ▼
状态层 (stores/dashboardStore)
        │  调用业务服务
        ▼
服务层 (services/dashboardService → http/Axios)
        │  请求 /api/dashboard
        ▼
数据源 (dataSource)  ── mock ──> MSW 拦截 ──> mocks/*
                 └─ api  ──> 真实后端
```

核心理念：**视图不直接接触数据来源**。组件从 Pinia 读取，服务层统一发起请求，Mock 与真实后端通过环境变量切换，后期接入真实接口无需改动任何业务组件。

---

## 许可证

本项目基于 [MIT 协议](./LICENSE) 开源，可自由学习、使用与二次创作。
