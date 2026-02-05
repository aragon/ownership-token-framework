interface IOpenGraphMetadata {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  type?: "website" | "article"
  imageWidth?: string
  imageHeight?: string
  twitterCard?: "summary" | "summary_large_image"
  url?: string
}

class MetadataUtils {
  baseUrl = "https://otf.aragon.org"

  private defaultTitle = "Ownership Token Framework"
  private defaultDescription =
    "The Ownership Token Framework maps enforceable claims across four metrics: onchain control, value accrual, verifiability, and token distribution. Use it to evaluate tokens on fundamentals."
  private defaultImage = `${this.baseUrl}/og-images/index.png`
  private defaultImageWidth = "1200"
  private defaultImageHeight = "631"
  private defaultImageAlt = "Ownership Token Framework"
  private siteName = "Ownership Token Framework"
  private twitterSite = "@aragonproject"

  private normalizeImageUrl = (image?: string): string => {
    if (!image) return this.defaultImage
    // If image is already a full URL (starts with http/https), return as-is
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image
    }
    // Otherwise, prepend baseUrl (ensuring no double slashes)
    const cleanPath = image.startsWith("/") ? image : `/${image}`
    return `${this.baseUrl}${cleanPath}`
  }

  generateOpenGraphMetadata = (params?: IOpenGraphMetadata) => {
    const {
      title = this.defaultTitle,
      description = this.defaultDescription,
      image,
      imageAlt = this.defaultImageAlt,
      type = "website",
      imageWidth = this.defaultImageWidth,
      imageHeight = this.defaultImageHeight,
      twitterCard = "summary_large_image",
      url,
    } = params || {}

    const fullUrl = url
      ? `${this.baseUrl}${url.startsWith("/") ? url : `/${url}`}`
      : this.baseUrl

    const normalizedImage = this.normalizeImageUrl(image)

    const meta = [
      {
        title,
      },
      {
        name: "description",
        content: description,
      },
      {
        property: "og:type",
        content: type,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:site_name",
        content: this.siteName,
      },
      {
        property: "og:url",
        content: fullUrl,
      },
      {
        property: "og:locale",
        content: "en_US",
      },
      {
        property: "og:image",
        content: normalizedImage,
      },
      {
        property: "og:image:width",
        content: imageWidth,
      },
      {
        property: "og:image:height",
        content: imageHeight,
      },
      {
        property: "og:image:alt",
        content: imageAlt,
      },
      {
        name: "twitter:card",
        content: twitterCard,
      },
      {
        name: "twitter:site",
        content: this.twitterSite,
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: normalizedImage,
      },
      {
        name: "twitter:image:alt",
        content: imageAlt,
      },
    ]

    return meta
  }
}

export const metadataUtils = new MetadataUtils()
export const generateOpenGraphMetadata = metadataUtils.generateOpenGraphMetadata
