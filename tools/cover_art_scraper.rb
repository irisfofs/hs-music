require 'nokogiri'
require 'open-uri'

# Scrape cover art from Bandcamp, because seems legit
class CoverArtScraper
  COVER_IMG_SELECTOR = '.popupImage'

  def scrape(track_list)
    cover_dir = "#{__dir__}/../src/covers"
    Dir.mkdir(cover_dir) unless File.exist? cover_dir

    tracks_with_links = track_list.select(&:track_link)
    tracks_with_links.each_with_index { |t, i|
      scrape_track(t)
      printf("\rScraping covers: %d of %d", i + 1, tracks_with_links.length)
    }
    puts
  end

  def scrape_track(track)
    return if File.exist? cover_filename(track)

    page = Nokogiri::HTML(open(track.track_link))
    img_src = page.at_css(COVER_IMG_SELECTOR).attr(:href)

    IO.copy_stream(open(img_src), cover_filename(track))
  end

  def cover_filename(track)
    __dir__ + "/../src/assets/covers/cover_#{slugify(track.title)}.jpg"
  end

  def slugify(string)
    string.downcase.tr(' ', '_').gsub(/[^\w-]/, '')
  end
end
