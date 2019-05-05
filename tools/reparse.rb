require 'json'

require_relative './credit_parser'
require_relative './cover_art_scraper'
require_relative './page_title_scraper'

STDOUT.sync = true

data_filename = __dir__ + '/../src/assets/data.json'

exit unless File.exist? data_filename

tracks = JSON.parse(File.read(data_filename, :encoding => 'utf-8'), :symbolize_names => true)

CreditParser.new.reparse_file(tracks)

File.open(__dir__ + '/../src/assets/data.json', 'w') do |f|
  f.puts JSON.dump(tracks)
end
