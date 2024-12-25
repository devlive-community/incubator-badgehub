<div align="center">

<img src="frontend/static/images/logo.svg" width="100" alt="Badge Hub">

### Badge Hub

Badgehub 是一个专为用户设计的徽标生成平台，提供直观且强大的工具，帮助用户轻松创建专业、高质量的徽标。无论是个人品牌、企业标识，还是特殊活动标志，Badgehub
都能满足不同场景的需求。通过可定制的模板、灵活的样式编辑器以及实时预览功能，用户可以快速设计出独特且引人注目的徽标，提升品牌形象，彰显个性风格。

</div>

## Features

- 动态 SVG 徽章生成
- 多种徽章样式（默认、扁平、塑料）
- 可定制的颜色和填充
- 简单的 REST API

## Usage

### Basic Badge

```
https://your-domain.com/api/badge/<OWNER>/<REPO>.svg
```

## Development

```bash
# 启动服务
npm run pm2:start

# 生产环境启动
npm run pm2:start:prod

# 停止服务
npm run pm2:stop

# 重启服务
npm run pm2:restart

# 删除服务
npm run pm2:delete

# 查看日志
npm run pm2:logs

# 监控面板
npm run pm2:monit
```