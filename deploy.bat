@echo off
chcp 65001 >nul
echo ==========================================
echo 英语交流社区 - EdgeOne 部署脚本
echo ==========================================
echo.

REM 检查是否安装了腾讯云 CLI
where tcloud >nul 2>nul
if %errorlevel% neq 0 (
    echo [警告] 未检测到腾讯云 CLI
    echo 请先安装腾讯云 CLI 工具
echo 访问: https://cloud.tencent.com/document/product/440/34011
echo.
    pause
    exit /b 1
)

echo [1/4] 正在检查项目文件...
if not exist "index.html" (
    echo [错误] 未找到 index.html 文件
    pause
    exit /b 1
)

if not exist "styles.css" (
    echo [错误] 未找到 styles.css 文件
    pause
    exit /b 1
)

if not exist "script.js" (
    echo [错误] 未找到 script.js 文件
    pause
    exit /b 1
)

echo [2/4] 项目文件检查完成
echo.

echo [3/4] 正在创建部署包...
if exist "deploy-package.zip" del "deploy-package.zip"
powershell -Command "Compress-Archive -Path 'index.html', 'styles.css', 'script.js', 'edgeone.json' -DestinationPath 'deploy-package.zip'"

echo [4/4] 部署包创建完成: deploy-package.zip
echo.

echo ==========================================
echo 部署准备完成！
echo ==========================================
echo.
echo 请按照以下步骤完成部署：
echo.
echo 1. 登录腾讯云控制台: https://console.cloud.tencent.com/edgeone
echo 2. 创建或选择您的站点
echo 3. 进入 静态资源托管 功能
echo 4. 上传 deploy-package.zip 文件
echo 5. 配置域名和 CDN 加速
echo.
echo 或者使用腾讯云 CLI 命令部署：
echo tcloud cos upload -r ./ deploy-package.zip cos://your-bucket-name/
echo.
pause