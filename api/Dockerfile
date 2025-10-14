FROM ruby:3.2.3

ENV RAILS_ENV=production RACK_ENV=production \
    BUNDLE_WITHOUT="development test"

WORKDIR /app
COPY api/Gemfile* ./
RUN bundle install

COPY api ./

EXPOSE 4000
CMD ["bash", "-lc", "bundle exec rails db:prepare && bundle exec rails server -b 0.0.0.0 -p 4000"]
