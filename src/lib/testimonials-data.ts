import testimonialsData from "@/data/testimonials.json"

export interface Testimonial {
  id: string
  name: string
  organization: string
  avatar: string
  url: string
  quote: string
}

interface TestimonialsContent {
  title: string
  testimonials: Testimonial[]
}

export const testimonialsContent = testimonialsData as TestimonialsContent
