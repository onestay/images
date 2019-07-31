FROM golang:1.12 as builder

ADD https://github.com/golang/dep/releases/download/v0.5.4/dep-linux-amd64 /usr/bin/dep
RUN chmod +x /usr/bin/dep

WORKDIR $GOPATH/src/github.com/onestay/images/upload
COPY Gopkg.toml Gopkg.lock ./
RUN dep ensure --vendor-only
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -v -o /app .

FROM alpine
RUN apk add --no-cache ca-certificates

COPY --from=builder /app ./

ENTRYPOINT [ "./app" ]
