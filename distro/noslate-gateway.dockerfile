ARG BASE_IMG

FROM ${BASE_IMG}

LABEL org.opencontainers.image.authors="noslate-support@list.alibaba-inc.com" \
      org.opencontainers.image.source="https://github.com/noslate-project/noslate" \
      org.opencontainers.image.licenses="MIT"

ADD gateway /usr/local/gateway

ENTRYPOINT [ "node", "/usr/local/gateway/devstart.js" ]
