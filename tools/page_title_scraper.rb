require 'nokogiri'
require 'open-uri'

# Scrape cover art from Bandcamp, because seems legit
class PageTitleScraper
  PAGE_TITLE_SELECTOR = 'font[size="6"]'

  def self.scrape(track_list)
    track_list.select(&:track_link).each { |t| scrape_track(t) }
  end

  def self.scrape_track(track)
    return if track.page_title
    return unless track.page_link

    page = Nokogiri::HTML(open(track.page_link))
    elem = page.at_css(PAGE_TITLE_SELECTOR)
    track.page_title = elem.text if elem
  end
end
