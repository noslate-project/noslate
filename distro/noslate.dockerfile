ARG BUILDPLATFORM
ARG NODE_VERSION
ARG NOSLATE_URL

FROM --platform=${BUILDPLATFORM:-linux/amd64} node:${NODE_VERSION:-16.15.1}

ENV NOSLATE_PATH=/usr/local/noslate \
    NOSLATE_WORKDIR=/.noslate \
    NOSLATE_BIN=${NOSLATE_PATH}/bin \
    ALICE_WORKDIR=${NOSLATE_WORKDIR}/alice \
    TURF_WORKDIR=${NOSLATE_WORKDIR}/turf \
    LIBTURF_PATH=${NOSLATE_WORKDIR}/bin/libturf.so \
    NOSLATE_LOGDIR=${}

RUN mkdir -p ${NOSLATE_PATH} && \
    mkdir -p ${ALICE_WORKDIR} && \
    mkdir -p ${ALICE_WORKDIR}/caches && \
    mkdir -p ${ALICE_WORKDIR}/bundles && \
    mkdir -p ${TURF_WORKDIR} && \
    mkdir -p ${TURF_WORKDIR}/overlay && \
    mkdir -p ${TURF_WORKDIR}/runtime && \
    mkdir -p ${TURF_WORKDIR}/runtime/serverless-worker-v1/bin && \
    mkdir -p ${TURF_WORKDIR}/runtime/alinode-v6/bin && \
    mkdir -p ${TURF_WORKDIR}/sandbox && \
    # TODO(chengzhong.wcz): confirm permissions;
    chmod -R 777 ${ALINODE_CLOUD_WORKDIR} && \
    chmod -R 555 ${TURF_WORKDIR}/runtime







