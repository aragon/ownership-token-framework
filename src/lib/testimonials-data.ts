import testimonialsData from "@/data/generated/testimonials.json"
import type { Testimonial, TestimonialsContent } from "@/lib/schemas"

export type { Testimonial }

export const testimonialsContent = testimonialsData as TestimonialsContent
