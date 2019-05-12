require 'English'
require 'nokogiri'
require 'open-uri'

# Scrape cover art from Bandcamp, because seems legit
class CoverArtScraper
  COVER_IMG_SELECTOR = '.popupImage'

  def scrape(track_list)
    cover_dir = "#{__dir__}/../src/assets/covers"
    Dir.mkdir(cover_dir) unless File.exist? cover_dir

    tracks_with_links = track_list.select { |t| t[:track_link] }
    tracks_with_links.each_with_index { |t, i|
      scrape_track(t)
      printf("\rScraping covers: %d of %d", i + 1, tracks_with_links.length)
    }
    puts
  end

  def scrape_track(track)
    return if File.exist?(cover_filename(track)) && track[:album_id] && track[:track_id]

    page = Nokogiri::HTML(open(track[:track_link]))

    scrape_cover(track, page)
    scrape_ids(track, page)
  end

  def scrape_cover(track, page)
    img_src = page.at_css(COVER_IMG_SELECTOR).attr(:href)

    IO.copy_stream(open(img_src), cover_filename(track))
  end

  def cover_filename(track)
    __dir__ + "/../src/assets/covers/cover_#{slugify(track[:title])}.jpg"
  end

  def slugify(string)
    string.downcase.tr(' ', '_').gsub(/[^\w-]/, '')
  end

  def scrape_ids(track, page)
    script_text = page.at_css('#pgBd').css('script').text

    if script_text =~ /album_id":(?<album_id>\d+)/
      track[:album_id] = $LAST_MATCH_INFO[:album_id].to_i
    end

    if script_text =~ /track_id":(?<track_id>\d+)/
      track[:track_id] = $LAST_MATCH_INFO[:track_id].to_i
    end
  end
end
