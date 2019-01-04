module ArticlesHelper
  def article_thumbnail_or_placeholder article
    if article.thumbnail.present? && article.thumbnail.asset.present?
      image_tag article.thumbnail.asset.thumb.url, class: "article-thumb"
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
end
