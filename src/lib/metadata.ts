interface IOpenGraphMetadata {
  title: string
  description: string
  image?: string
  type?: "website" | "article"
  imageWidth?: string
  imageHeight?: string
  twitterCard?: "summary" | "summary_large_image"
}

const DEFAULT_TITLE = "Ownership Token Framework"
const DEFAULT_DESCRIPTION =
  "The Ownership Token Framework maps enforceable claims across four metrics: onchain control, value accrual, verifiability, and token distribution. Use it to evaluate tokens on fundamentals."
const DEFAULT_IMAGE = "/og-share-large.png"
const DEFAULT_IMAGE_WIDTH = "1200"
const DEFAULT_IMAGE_HEIGHT = "631"

export const generateOpenGraphMetadata = (params?: IOpenGraphMetadata) => {
  const {
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    type = "website",
    imageWidth = DEFAULT_IMAGE_WIDTH,
    imageHeight = DEFAULT_IMAGE_HEIGHT,
    twitterCard = "summary_large_image",
  } = params || {}

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
      property: "og:image",
      content: image,
    },
    {
      name: "twitter:card",
      content: twitterCard,
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
      content: image,
    },
  ]

  if (imageWidth && imageHeight) {
    meta.splice(6, 0, {
      property: "og:image:width",
      content: imageWidth,
    })
    meta.splice(7, 0, {
      property: "og:image:height",
      content: imageHeight,
    })
  }

  return meta
}
