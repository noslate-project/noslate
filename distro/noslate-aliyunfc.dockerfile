ARG NOSLATE_VERSION

FROM noslate:${NOSLATE_VERSION:-0.0.1}

# FC runtime 指定代码目录为 /code
RUN mkdir -p ${NOSLATE_LOGDIR} && \
    mkdir /code

# 设定 server.js
# 初始化 server.js 依赖

# 指定入口
ENTRYPOINT []