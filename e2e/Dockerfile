FROM node:18.13.0-bullseye

WORKDIR /app

# Install buf command and buf plugins
# https://docs.buf.build/installation#binary
ENV BIN /usr/local/bin
ENV BUF_VERSION 1.12.0
RUN curl -sSL "https://github.com/bufbuild/buf/releases/download/v${BUF_VERSION}/buf-$(uname -s)-$(uname -m)" -o "${BIN}/buf" && \
    chmod +x "${BIN}/buf" && \
    npm i -g @bufbuild/protoc-gen-connect-web @bufbuild/protoc-gen-es

CMD [ "buf", "generate" ]
