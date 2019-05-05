require 'nokogiri'
require 'open-uri'

# Scrape page titles from MSPA.
class PageTitleScraper
  PAGE_TITLE_SELECTOR = 'h2.type-hs-header'

  def self.scrape(track_list)
    tracks_with_pagelinks = track_list.select { |t| t[:page_link] }
    tracks_with_pagelinks.each_with_index { |t, i|
      scrape_title(t)
      printf("\rScraping titles: %d of %d", i + 1, tracks_with_pagelinks.length)
    }
    puts
  end

  def self.scrape_title(track)
    return if track[:page_title]

    page = Nokogiri::HTML(open(comic_link(track[:page_link])))
    elem = page.at_css(PAGE_TITLE_SELECTOR)
    track[:page_title] = elem.text if elem
  end
end

def comic_link(story_link)
  return "https://www.homestuck.com/#{story_link}"
end
