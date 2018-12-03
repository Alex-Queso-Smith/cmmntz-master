module ArticlesHelper
  def article_thumbnail_or_placeholder article
    if article.thumbnail.present?
      image_tag article.thumbnail.asset.thumb.url, class: "article-thumb"
    end
  rescue
    ""
  end

  def article_banner article
    if article.banner.present?
      image_tag article.banner.asset.url, class: "article-banner"
    end
  end

  def article_middle_image article
    if article.middle_image.present?
      image_tag article.middle_image.asset.url, class: "article-middle-image"
    end
  end
end
