ARG BUILDPLATFORM
ARG NODE_VERSION
ARG NOSLATE_URL

FROM --platform=${BUILDPLATFORM:-linux/amd64} node:${NODE_VERSION:-16.15.1}

# set envionment variables
ENV NOSLATE_PATH=/usr/local/noslate \
    NOSLATE_WORKDIR=/.noslate \
    NOSLATE_BIN=${NOSLATE_PATH}/bin \
    ALICE_WORKDIR=${NOSLATE_WORKDIR}/alice \
    TURF_WORKDIR=${NOSLATE_WORKDIR}/turf \
    LIBTURF_PATH=${NOSLATE_WORKDIR}/bin/libturf.so \
    NOSLATE_LOGDIR=${NOSLATE_WORKDIR}/logs

# mkdirs
RUN mkdir -p ${NOSLATE_PATH} && \
    mkdir -p ${ALICE_WORKDIR} && \
    mkdir -p ${ALICE_WORKDIR}/caches && \
    mkdir -p ${ALICE_WORKDIR}/bundles && \
    mkdir -p ${TURF_WORKDIR} && \
    mkdir -p ${TURF_WORKDIR}/overlay && \
    mkdir -p ${TURF_WORKDIR}/runtime && \
    mkdir -p ${TURF_WORKDIR}/runtime/aworker/bin && \
    mkdir -p ${TURF_WORKDIR}/runtime/node-v16/bin && \
    mkdir -p ${TURF_WORKDIR}/sandbox && \
    chmod -R 777 ${NOSLATE_WORKDIR} && \
    chmod -R 555 ${TURF_WORKDIR}/runtime

# install noslate and requirements
RUN curl -sLo ${NOSLATE_URL} ./noslate.tar.gz && \
    tar -zxvf noslate.tar.gz -C ${NOSLATE_PATH} && \
    chmod +x ${NOSLATE_BIN}/turf && \
    chmod +x ${NOSLATE_BIN}/aworker && \
    chmod +x ${NOSLATE_BIN}/node && \
    ln -s ${NOSLATE_BIN}/turf /usr/local/bin/turf && \
    ln -s ${NOSLATE_BIN}/aworker /usr/local/bin/aworker && \
    ln -s ${NOSLATE_BIN}/aworker.shell /usr/local/bin/aworker.shell && \
    rm -f noslate.tar.gz && \
    apt-get update && \
    apt-get install -y unzip procps && \
    rm -rf /var/lib/apt/lists/*



