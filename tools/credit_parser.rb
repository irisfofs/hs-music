require 'nokogiri'
require 'English'

class CreditParser
  def extract_bandcamp_link(element)
    return nil unless element && element.text =~ /Available on Bandcamp/
    info_of_a(element)
  end

  # Primary artist credit:
  # "Remix by"
  # "Arrangement by"
  # "Arranged by"
  OTHER_PRIMARY = /(?:(?:Remix|Arrangement|Arranged) by)/
  PRIMARY_ARTIST = /(?:By|#{OTHER_PRIMARY}) (?<artist>.+)/

  def extract_artist_info(element, record)
    return nil unless element

    if element.text =~ PRIMARY_ARTIST
      puts "Already has artist #{rec}" if record[:artist]
      record[:artist] = $LAST_MATCH_INFO[:artist]
    elsif element.text =~ / by /
      record[:long_artist] ||= []
      record[:long_artist].push(element.text)
    end
  end

  def info_of_a(element)
    a = element.at_css('a')
    [a.text, a.attr(:href)] if a
  end

  PAGE = /Page (?<page>\d+)/
  TITLE = /\"(?<title>[^\"]+)\"/

  def load_credits_file
    File.open(__dir__ + '/soundcredits.html') { |f| Nokogiri::HTML(f) }
  end

  def get_info_for_file
    sound_credits = load_credits_file

    sound_credits.css('.credit').map do |credit|
      elems = credit.elements
      rec = {}

      parse_credit_entry(rec, credit)
    end
  end

  def reparse_file(tracks)
    sound_credits = load_credits_file

    tracks.zip(sound_credits.css('.credit')).map do |track, credit|
      parse_credit_entry(track, credit)
    end
  end

  def parse_credit_entry(rec, credit_el)
    elems = credit_el.elements

    if elems[0].text =~ /#{PAGE}\s*-\s*#{TITLE}/
      rec[:page] = $LAST_MATCH_INFO[:page]
      rec[:title] = $LAST_MATCH_INFO[:title]

      track_link = elems[0].css('a')[1]
      rec[:track_link] = track_link.attr(:href) if track_link
    elsif elems[0].text =~ PAGE
      rec[:page] = $LAST_MATCH_INFO[:page]
      if elems[1].text =~ TITLE
        rec[:title] = $LAST_MATCH_INFO[:title]
        rec[:track_link] = (info_of_a(elems[1]) || [nil, nil])[1]
      else
        puts "no match for element: #{elems.map(&:text)}"
      end
    else
      puts "no match for element: #{elems.map(&:text)}"
    end

    # grab link to page
    rec[:page_link] = (info_of_a(elems[0]) || [nil, nil])[1]

    # grab link to bandcamp track from title if it's there

    # extract link to bandcamp
    rec[:album], rec[:album_link] = elems[1..2].reduce(nil) { |a, e| a || extract_bandcamp_link(e) }

    elems[1..3].each { |e| extract_artist_info(e, rec) }

    rec
  end
end
