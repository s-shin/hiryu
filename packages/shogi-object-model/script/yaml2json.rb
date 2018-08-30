#!/usr/bin/env ruby
require 'yaml'
require 'json'

data = YAML.safe_load(ARGF.to_io)
puts JSON.pretty_generate(data)
