require 'redcarpet'

module ApplicationHelper
def widget_pack_url
  asset_url(Webpacker.instance.manifest.lookup!('application.js'))
end

def widget_js_url
  asset_url('cf-widget.js')
end

def widget_css_url
  asset_url('cf-widget.css')
end


  # Convert markdown to HTML
  def markdown(text)
    options = {
      filter_html:     true,
      hard_wrap:       true,
      link_attributes: { rel: 'nofollow', target: "_blank" },
      space_after_headers: true,
      fenced_code_blocks: true
    }

    extensions = {
      autolink:           true,
      superscript:        true,
      disable_indented_code_blocks: true
    }

    renderer    = Redcarpet::Render::HTML.new(options)
    @markdown ||= Redcarpet::Markdown.new(renderer, extensions)
    @markdown.render(text).html_safe
  end

  def page_title(title = "")
    t = SITE_NAME
    if !title.blank?
      t = "#{title} - #{t}"
    end
    return t
  end

  def display_time_ago timestamp
    return "" if timestamp.blank?
    return display_date_mm_yy(timestamp) if 3.months.ago > timestamp
    (minutes_in_words(timestamp)).html_safe
  end

  def minutes_in_words(timestamp)
    minutes = (((Time.now - timestamp).abs)/60).round

    return "" if minutes < 0

    case minutes
    when 0..4            then '5 minutes'
    when 5..14           then '15 minutes'
    when 15..29          then '30 minutes'
    when 30..59          then '30 minutes'
    when 60..119         then '1 hour'
    when 120..239        then '2 hours'
    when 240..479        then '4 hours'
    when 480..719        then '8 hours'
    when 720..1439       then '12 hours'
    when 1440..11519     then '' << pluralize((minutes/1440).floor, 'day')
    when 11520..43199    then '' << pluralize((minutes/11520).floor, 'week')
    when 43200..525599   then '' << pluralize((minutes/43200).floor, 'month')
    else                      pluralize((minutes/525600).floor, 'year')
    end
  end

  def display_date_mm_yy timestamp
    return "" if timestamp.blank?
    timestamp.strftime("%m/%Y")
  end

  def display_date timestamp, time = true
    return "" if timestamp.blank?
    timestamp.strftime(time ? "%Y-%m-%d %H:%M" : "%Y-%m-%d")
  end

  def last_edit_date object
    return "" unless object.respond_to?(:updated_at) && object.respond_to?(:created_at)
    object.created_at != object.updated_at ? object.updated_at : ""
  end

  def has_been_edited object
    return false unless object.respond_to?(:updated_at) && object.respond_to?(:created_at)
    object.created_at != object.updated_at
  end

end
