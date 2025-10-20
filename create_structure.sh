#!/bin/bash

# 创建前端目录结构
mkdir -p frontend/{public,src}
mkdir -p frontend/public/{static,client,assets}
mkdir -p frontend/public/static/{css,js,assets,picture,winsunui}
mkdir -p frontend/src/{components,pages,utils,styles,assets}

# 创建后端目录结构
mkdir -p backend/{src,config,database}
mkdir -p backend/src/{routes,controllers,models,middleware,utils}
mkdir -p backend/database/{migrations,seeds}

# 创建配置文件
touch backend/.env.example
touch backend/package.json
touch frontend/package.json
touch frontend/index.html

echo "项目结构创建完成！"
tree -L 3 -I 'node_modules'
