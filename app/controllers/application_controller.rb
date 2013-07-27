require 'streamer/sse'


class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include ActionController::Live
  def index

  end


  def events
    response.headers['Content-Type'] = 'text/event-stream'
    redis = Redis.new

    redis.subscribe('boards:create') do |on|
      on.message do |event, data|
        o = {"data" => data, "event" => event}
        logger.info o
        response.stream.write("data: #{o.to_json}\n\n")
      end
    end

  rescue IOError
    logger.info "Stream closed"
  ensure
    redis.quit
    response.stream.close
  end

  def search

  end

end
