ARG NOSLATE_VERSION

FROM noslate:${NOSLATE_VERSION:-0.0.1}

RUN mkdir -p ${NOSLATE_LOGDIR} && \
    mkdir -p /gateway



