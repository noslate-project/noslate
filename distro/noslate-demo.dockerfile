ARG NOSLATE_VERSION

FROM noslate:${NOSLATE_VERSION:-0.0.1}

LABEL org.opencontainers.image.authors="noslate-support@@list.alibaba-inc.com"

RUN mkdir -p ${NOSLATE_LOGDIR} && \
    mkdir -p /gateway



