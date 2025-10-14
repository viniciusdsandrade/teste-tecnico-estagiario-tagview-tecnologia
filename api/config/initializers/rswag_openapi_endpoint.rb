# frozen_string_literal: true

if defined?(Rswag::Ui::Configuration) &&
   !Rswag::Ui::Configuration.instance_methods.include?(:openapi_endpoint)
  Rswag::Ui::Configuration.class_eval do
    def openapi_endpoint(url, name)
      @config_object[:urls] ||= []
      @config_object[:urls] << { url: url, name: name }
    end
  end
end
