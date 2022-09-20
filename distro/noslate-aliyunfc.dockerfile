ARG NOSLATE_VERSION
ARG ILOGTAIL_REGION

FROM noslate:${NOSLATE_VERSION:-0.0.1}

# FC runtime 指定代码目录为 /code
RUN mkdir -p ${NOSLATE_LOGDIR} && \
    mkdir /code

# 设定 server.js
# 初始化 server.js 依赖

# 根据 ILOGTAIL_REGION 安装 ilogtail，默认值 zhangjiakou

# 指定入口
ENTRYPOINT []