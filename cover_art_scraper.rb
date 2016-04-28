require 'nokogiri'
require 'open-uri'

# Scrape cover art from Bandcamp, because seems legit
class CoverArtScraper
  COVER_IMG_SELECTOR = '.popupImage > img:nth-child(1)'

  def scrape(track_list)
    track_list.select(&:track_link).each { |t| scrape_track(t) }
  end

  def scrape_track(track)
    return if File.exists? cover_filename(track)

    page = Nokogiri::HTML(open(track.track_link))

    img_src = page.at_css(COVER_IMG_SELECTOR).attr(:src)

    open(cover_filename(track), 'w') do |file|
      file << open(img_src).read
    end
  end

  def cover_filename(track)
    "covers/cover_#{slugify(track.title)}.jpg"
  end

  def slugify(string)
    string.downcase.tr(' ', '_').gsub(/[^\w-]/, '')
  end
end
