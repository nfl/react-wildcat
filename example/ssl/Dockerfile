FROM selenium/standalone-chrome-debug:2.53.0

RUN apt-get update && apt-get install -y libnss3-tools

COPY example.crt /usr/local/share/ca-certificates
COPY example.crt /etc/ssl/certs
COPY example.key /etc/ssl/private

RUN mkdir -p $HOME/.pki/nssdb && certutil -d $HOME/.pki/nssdb -N
RUN certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "*.example.dev" -i /etc/ssl/certs/example.crt
