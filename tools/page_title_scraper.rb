require 'nokogiri'
require 'open-uri'

# Scrape page titles from MSPA.
class PageTitleScraper
  PAGE_TITLE_SELECTOR = 'h2.type-hs-header'

  def self.scrape(track_list)
    track_list.select(&:page_link).each { |t| scrape_title(t) }
  end

  def self.scrape_title(track)
    return if track.page_title

    page = Nokogiri::HTML(open(comic_link(track.page_link)))
    elem = page.at_css(PAGE_TITLE_SELECTOR)
    track.page_title = elem.text if elem
  end
end

def comic_link(story_link)
  return "https://www.homestuck.com/#{story_link}"
end
