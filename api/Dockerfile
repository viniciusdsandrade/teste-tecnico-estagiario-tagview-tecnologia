FROM ruby:3.2.3

ENV RAILS_ENV=production \
    RACK_ENV=production \
    BUNDLE_WITHOUT="development test" \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true \
    SECRET_KEY_BASE=b/+iDMmuaikmqEDl1vZrz+v8OEBB1twpdCL6ysQGZP4K3fRlNKPJGmE1tBL7Yneahadq4vXP19iJspkUjn54TbkVpqe2BqurMb+LQid2EM38iREmHHf2Dz1OFREwsy2ICZluI3/lyIuze2+r4LMLJqxyee4ocBl483h8nVwSQHTR+u+QXg79PX/43dftIioZs3TG19C/sgEf+7gPfszRHhaFsxof2UgqXSOpA+YbWoAjGe27BjoIHvAOOlW6j/KXEtpYgLtjxTNgMkuwaO/O9iwNVLRXg8nRk/jbaON2Rws4ZNLAXNlISTV5xVaePo1kgQ7W3YTgkbkO1L8fhdPjuRkSqaSKD//t2EI4Hhtgti3sMfzQvrIGovj14MdHgm8Oqv2RF6KAKF0GR7oOxnTLqnu3SWKzu3l0ptcv--E2xYMpVNmagfxcVQ--NnUKJLfMtnGEn+FHDmDKtQ== \
    API_KEY=tagview-desafio-2024 \
    DB_HOST=db \
    DB_PORT=3306 \
    DB_USER=root \
    DB_PASSWORD=GhostSthong567890@# \
    DB_NAME=api_production

WORKDIR /app

RUN apt-get update -y && apt-get install -y --no-install-recommends \
      build-essential \
      default-libmysqlclient-dev \
      pkg-config \
  && rm -rf /var/lib/apt/lists/*

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . ./

EXPOSE 3000

CMD ["bash", "-lc", "\
  echo \"Checando DB em ${DB_HOST}:${DB_PORT}...\"; \
  ruby -rsocket -e 'host=ENV[\"DB_HOST\"]||\"db\"; port=(ENV[\"DB_PORT\"]||\"3306\").to_i; begin; \
    Socket.getaddrinfo(host, nil); \
    s=TCPSocket.new(host, port); s.close; exit 0; \
  rescue; exit 2; end' \
  && (echo 'DB acessível. Executando db:prepare...' && bundle exec rails db:prepare) \
  || echo 'DB indisponível. Pulando db:prepare.'; \
  exec bundle exec rails server -b 0.0.0.0 -p 3000 \
"]