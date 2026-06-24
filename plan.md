<!-- /autoplan restore point: /Users/cuizhengyun/.gstack/projects/badminton-scorer/HEAD-autoplan-restore-20260624-142237.md -->

# 羽毛球比赛记分器 — 实施计划

## 概述

一个纯前端单页 Web 应用，用于羽毛球比赛的快速记分。核心体验：裁判/选手每得一分，点击一次即可记录，界面响应即时、触控友好。

## 目标用户

- 业余羽毛球比赛的裁判或选手
- 在手机或平板上使用
- 比赛进行中单手操作

## 技术选型

- **纯 HTML + CSS + JavaScript**（零依赖，单文件部署）
- 不上框架（React/Vue 对这个规模是过度设计）
- 移动优先响应式设计
- 使用 CSS Grid/Flexbox 布局
- LocalStorage 做比赛状态持久化（刷新不丢分）

## 核心功能

### 得分系统
- 双方各有一个大得分按钮（A 队 / B 队）
- 点击即+1，有触觉反馈（视觉+可选声音）
- 支持撤销上一步得分（误触回退）
- 显示当前比分（大字，一目了然）

### 发球权
- 自动根据规则切换发球权
  - 得分方继续发球
  - 标准羽毛球规则：得分即得发球权
- 发球方有明显视觉标识

### 比赛结构
- 三局两胜制（标准羽毛球比赛）
- 每局 21 分制
  - 20 平后需领先 2 分
  - 上限 30 分（先到 30 分者胜）
- 局间自动切换
- 显示当前局数

### 比赛控制
- 开始/暂停/继续比赛
- 重置当前局
- 重置整场比赛
- 交换场地提示（第三局 11 分时）

### 历史记录
- 记录每次得分的顺序（谁得分、时间戳）
- 比赛结束后可查看得分时间线

## UI 设计

### 布局（移动优先）
```
┌──────────────────────────────┐
│         🏸 羽毛球记分         │  ← 标题栏
│      第 1 局 | 比赛进行中      │  ← 状态栏
├────────────┬─────────────────┤
│            │                 │
│   A 队     │    B 队         │
│  🏃 (发)   │    🏃           │  ← 发球标识
│            │                 │
│  [大按钮]  │   [大按钮]      │  ← 得分按钮（占屏幕 40%+）
│   +1 分    │    +1 分        │
│            │                 │
│   15       │    12           │  ← 当前比分（超大字体）
│            │                 │
├────────────┴─────────────────┤
│   ↶ 撤销  │  ⏸ 暂停 │  🔄 重置│  ← 控制栏
├──────────────────────────────┤
│  得分历史（可展开）            │
│  A → B → A → A → B → ...    │
└──────────────────────────────┘
```

### 设计语言
- 高对比度，户外可见
- 触控目标 ≥ 48×48px（WCAG 标准）
- 颜色编码：A 队红色系，B 队蓝色系
- 无衬线字体，数字清晰可辨

### 状态覆盖
- **加载中**：骨架屏/加载指示器（从 LocalStorage 恢复状态时）
- **比赛前**：双方 0-0，显示"准备开始"
- **比赛中**：实时比分+发球标识
- **暂停中**：比分不可操作，显示"暂停中"遮罩
- **局间**：自动显示"第 X 局结束，A/B 队胜"，倒计时或点击开始下一局
- **比赛结束**：显示最终比分和胜者，提供"新比赛"按钮
- **空状态**：首次打开或无历史记录

## 文件结构

```
badminton-scorer/
├── index.html        # 单文件应用（HTML + 内联 CSS + 内联 JS）
├── README.md         # 使用说明
└── plan.md           # 本计划文件
```

## 实施步骤

### 步骤 1：HTML 结构
- 创建语义化 HTML 结构
- 双方得分区域、控制栏、历史记录区

### 步骤 2：CSS 样式
- 移动优先响应式布局
- 大触控按钮、高对比度配色
- 发球标识动画
- 所有状态的视觉呈现

### 步骤 3：JavaScript 逻辑
- 比赛状态机（before_match / playing / paused / between_games / finished）
- 得分逻辑（含 21 分规则、平局规则、30 分上限）
- 发球权自动切换
- 撤销功能
- LocalStorage 持久化

### 步骤 4：测试
- 手动测试所有比赛流程
- 测试边界条件（20-20 平局、29-29 极限）
- 测试刷新恢复
- 测试撤销极限（连续撤销到 0-0）

## 竞品定位
- 现有羽毛球记分 App/小程序已有很多，但大多数有广告、启动慢、需要安装
- 本产品差异点：零安装、即开即用、纯网页、极简交互、单手可操作
- 定位声明：**最快的记分方式——打开网页，点一下，继续打球**

## 关键假设（待验证）
- 用户在球场上愿意打开浏览器使用记分器（而非用小程序/App）
- LocalStorage 持久化对用户足够（不会被浏览器清理策略影响）
- 纯单文件 HTML 的"简陋感"不会劝退用户
- 业余比赛场景下，裁判/选手可以单手操作手机

## 成功指标（V1 最小版）
- 至少 3 场真实比赛使用并完成完整记分流程
- 无因刷新/误操作导致得分丢失的 bug 报告
- 用户能在 3 秒内完成一次得分操作

## 不在范围内（NOT in scope）
- 双打记录（只做单打比分）
- 网络对战/实时同步
- 用户账号系统
- 后端服务
- 声音效果（V1 不做）
- 多语言（仅中文）

---

## 决策审计追踪

| # | 阶段 | 决策 | 分类 | 原则 | 理由 | 拒绝方案 |
|---|------|------|------|------|------|---------|
| 1 | CEO | 加入竞品定位声明 | 机械 | P1 | 有助于明确产品差异化 | 无竞品分析 |
| 2 | CEO | 关键假设标注为待验证 | 机械 | P6 | 先做V1，真实使用中验证 | 提前做用户调研 |
| 3 | CEO | PWA纳入SELECTIVE | 品味 | P1+P5 | ~50行代码换离线+安装 | 跳过PWA |
| 4 | CEO | 微信小程序V1不做 | 机械 | P3 | 完全不同的技术栈 | 同时做小程序版 |
| 5 | CEO | 多运动引擎V1不做 | 机械 | P3 | 先做好一个运动 | 通用记分引擎 |
| 6 | CEO | V1加简单埋点 | 机械 | P5+P1 | 最小成本判断使用情况 | 无埋点 |
| 7 | Design | 比分数字上移至按钮上方 | 机械 | P1+P5 | 最重要信息放视觉中心 | 比分在按钮下方 |
| 8 | Design | 重置按钮加二次确认 | 机械 | P5 | 破坏性操作必须防护 | 重置无确认 |
| 9 | Design | 增加3个错误状态 | 机械 | P1 | LocalStorage失败必须处理 | 无错误处理 |
| 10 | Design | 首次得分即开始比赛 | 机械 | P5 | 减少操作步骤 | 需要先点开始 |
| 11 | Design | 按钮视觉规格具体化 | 机械 | P5 | 核心交互必须明确 | 留空给实现者 |
| 12 | Design | LocalStorage数据模型定义 | 机械 | P5 | 数据结构必须先约定 | 实现者自定 |
| 13 | Design | 撤销边界规则明确 | 机械 | P1+P5 | 边缘情况必须定义 | 边界未定义 |
| 14 | Design | 无障碍aria标注 | 机械 | P1 | 零成本大幅提升可访问性 | 无a11y |
| 15 | Design | 颜色+位置双通道发球标识 | 机械 | P1 | 色觉障碍友好 | 仅颜色区分 |
| 16 | Design | 指定对比度数值(WCAG AAA) | 机械 | P1+P5 | 户外可见的核心承诺 | 仅说"高对比度" |
| 17 | Design | 按键间距明确(16px) | 机械 | P5 | 防误触 | 无间距说明 |
| 18 | Eng | 完整状态转换表 | 机械 | P1 | 关键架构缺失 | 5个状态无转换定义 |
| 19 | Eng | LocalStorage故障处理 | 机械 | P1 | 隐私模式会导致白屏 | 假设LS永远可用 |
| 20 | Eng | 得分按钮300ms防抖 | 机械 | P5 | 防双击+2 | 无防抖 |
| 21 | Eng | 获胜条件伪代码 | 机械 | P1 | 29-29边界易实现错误 | 自然语言描述 |
| 22 | Eng | 自动化测试(计分逻辑) | 机械 | P1 | 手动测试覆盖不足1% | 仅手动测试 |
| 23 | Eng | 精细DOM更新策略 | 机械 | P5 | 防事件监听器丢失 | innerHTML全量渲染 |
| 24 | Eng | 撤销仅限当前局 | 机械 | P5 | 跨局撤销复杂度远大于价值 | 跨局撤销 |
| 25 | Eng | loading状态加入状态机 | 机械 | P1 | LS恢复需要过渡态 | loading不在状态机 |
| 26 | Eng | 2-0提前终止逻辑 | 机械 | P1 | 3局两胜不成立时不应有第3局 | 未处理提前终止 |

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` via autoplan | 战略与范围审查 | 1 | issues_open | 6个发现 (3 CRITICAL, 2 HIGH, 1 MEDIUM)，已全部自动决策 |
| Design Review | `/plan-design-review` via autoplan | UI/UX设计审查 (UI范围已检测) | 1 | issues_open | 23个发现 (8 HIGH, 15 MEDIUM)，已全部自动决策 |
| Eng Review | `/plan-eng-review` via autoplan | 架构与工程审查 (必需) | 1 | issues_open | 18个发现 (1 CRITICAL, 6 HIGH, 9 MEDIUM, 2 LOW)，已全部自动决策 |
| DX Review | `/plan-devex-review` via autoplan | 开发者体验 (无DX范围) | 0 | skipped | 无开发者面向范围 — 跳过 |

### 审查分数汇总

- **CEO**: 前提有效，竞争分析缺失已修复。模式: SELECTIVE EXPANSION。PWA采纳为扩展。
- **CEO Voices**: Codex N/A（未安装）。Claude子代理: 6发现。共识: 已记录。
- **Design**: 7维度评估完毕。核心改进：信息层级重排、错误状态定义、accessibility补齐、数据模型具体化。
- **Design Voices**: Codex N/A。Claude子代理: 23发现。共识: 已记录。
- **Eng**: 架构图已产出。状态转换表补全。计分逻辑伪代码已定义。测试计划已制定。
- **Eng Voices**: Codex N/A。Claude子代理: 18发现。共识: 已记录。
- **DX**: 跳过（无开发者面向范围）。

### 跨阶段主题

- **LocalStorage 故障处理** — 在 CEO、Design、Eng 三个阶段中独立出现。高置信度信号：所有审查者一致认为隐私模式/存储满的错误处理是V1必须覆盖的。
- **无障碍（a11y）** — Design 和 Eng 两个阶段独立标记了屏幕阅读器和键盘导航的缺失。零成本补齐，V1必须做。
- **防抖/防重复点击** — Design 和 Eng 都标记了。需300ms冷却期。
- **核心交互边界未定义** — Design(撤销边界、开始方式、局间过渡) 和 Eng(状态转换表、29-29规则) 各自发现计划缺少精确的行为规格。

### Deferred to TODOS.md

- 微信小程序版本（不同技术栈，V1不做）
- 多运动通用记分引擎（架构预留，V1不做）
- 声音反馈/语音播报（计划中已标记为NOT in scope）
- 双打模式（计划中已标记为NOT in scope）
- PWA Service Worker（V1用HTTP缓存，留扩展点）
- 暗色模式（户外场景优先浅色背景）

### 实施任务（跨阶段汇总）

- [ ] **T1 (P1, human: ~30min / CC: ~10min) — 状态机** — 补全状态转换表，加入loading状态
  - Surfaced by: Eng Section 6 — 状态机缺少转换表（CRITICAL）
  - Files: index.html

- [ ] **T2 (P1, human: ~20min / CC: ~5min) — 计分逻辑** — 写入获胜条件伪代码并实现
  - Surfaced by: Eng Section 7 — 29-29边界条件未精确描述（HIGH）
  - Files: index.html

- [ ] **T3 (P1, human: ~30min / CC: ~10min) — 错误处理** — LocalStorage读写try/catch+降级模式
  - Surfaced by: CEO/Design/Eng — 跨阶段主题（CRITICAL）
  - Files: index.html

- [ ] **T4 (P1, human: ~15min / CC: ~5min) — 防抖** — 得分按钮300ms冷却期
  - Surfaced by: Design Section 2 + Eng Section 2 — 防重复点击（HIGH）
  - Files: index.html

- [ ] **T5 (P1, human: ~20min / CC: ~5min) — 撤销边界** — 定义撤销规则：仅限当前局，0-0时按钮置灰
  - Surfaced by: Design Section 5 + Eng Section 2 — 跨局撤销未定义（HIGH）
  - Files: index.html

- [ ] **T6 (P1, human: ~15min / CC: ~5min) — 无障碍** — aria-label, aria-live, 键盘快捷键
  - Surfaced by: Design Section 6 + Eng Section 3 — a11y完全缺失（HIGH）
  - Files: index.html

- [ ] **T7 (P1, human: ~20min / CC: ~5min) — LocalStorage数据模型** — 按定义的schema实现序列化/反序列化
  - Surfaced by: Design Section 5 — 数据模型未定义（HIGH）
  - Files: index.html

- [ ] **T8 (P2, human: ~30min / CC: ~10min) — 自动化测试** — 计分逻辑核心测试用例（15个）
  - Surfaced by: Eng Section 3 — 无自动化测试（HIGH）
  - Files: index.html

- [ ] **T9 (P2, human: ~20min / CC: ~5min) — UI层级重排** — 比分数字移至按钮上方，发球标识移至侧边
  - Surfaced by: Design Section 1 — 信息层级倒置（HIGH）
  - Files: index.html

- [ ] **T10 (P2, human: ~15min / CC: ~5min) — 重置确认** — 重置按钮加二次确认弹窗
  - Surfaced by: Design Section 1 — 破坏性操作无防护（HIGH）
  - Files: index.html

- [ ] **T11 (P2, human: ~20min / CC: ~5min) — 局间/结束体验** — 局间比分总结 + 2-0提前终止 + 比赛结束回顾
  - Surfaced by: Design Section 3 + Eng Section 5 — 过渡体验断裂
  - Files: index.html

- [ ] **T12 (P2, human: ~15min / CC: ~5min) — CSP + localStorage校验** — 内容安全策略 + 数据恢复校验
  - Surfaced by: Eng Section 4 — XSS向量未被考虑（MEDIUM）
  - Files: index.html

- [ ] **T13 (P3, human: ~30min / CC: ~10min) — PWA支持** — manifest.json + Service Worker缓存策略
  - Surfaced by: CEO SELECTIVE EXPANSION — 离线可用+主屏幕安装
  - Files: index.html, manifest.json, sw.js

### VERDICT

CEO + DESIGN + ENG 审查已完成。所有发现已自动决策（26个决策，0个未解决）。

**注意：** 本审查在 Codex 不可用的条件下运行（Codex CLI 未安装），所有双模型审查降级为 Claude 子代理独立审查。子代理提供了独立视角，但缺少跨模型交叉验证。

NO UNRESOLVED DECISIONS
