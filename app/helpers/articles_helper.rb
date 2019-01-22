module ArticlesHelper
  def article_image_link article
    link_to article_thumbnail_or_placeholder(article), article_path(article.slug)
  end
  def article_thumbnail_or_placeholder article, x_class = "img-fluid"
    if article.thumbnail.present? && article.thumbnail.asset.present?
      image_tag article.thumbnail.asset.url, class: "#{x_class}"
    else
      image_tag '/images/image-placeholder.jpg', class:  "#{x_class}"
    end
  end

  def article_banner article
    if article.banner.present? && article.banner.asset.present?
      image_tag article.banner.asset.url, class: "article-banner"
    end
  end

  def article_image article_image
    if article_image.present? && article_image.asset.present?
      image_tag article_image.asset.url, class: "img-fluid"
    end
  end

  def article_body_display_class article
    article.middle_image.present? && article.middle_image.asset.present? ? "col-sm-7" : "col-sm-12"
  end

  def widget_mode
    return if request.base_url.to_s.match('staging').nil?
    "mode: 'staging'"
  end
end
