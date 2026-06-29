import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import type { Evidence, EvidenceUrl } from "@/lib/metrics-data"
import { isPlaceholder } from "@/lib/utils"
import { EvidenceLink } from "./ui/evidence-link.tsx"

interface MarkdownComponentProps {
  children?: React.ReactNode
  href?: string
}

const markdownComponents = {
  p: ({ children }: MarkdownComponentProps) => <p>{children}</p>,
  a: ({ href, children }: MarkdownComponentProps) => (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  ),
}

export type FullEvidence = Evidence

export type EvidenceItem = EvidenceUrl | FullEvidence

export const isFullEvidence = (item: EvidenceItem): item is FullEvidence => {
  return "urls" in item && Array.isArray(item.urls)
}

interface IEvidenceCardProps {
  evidence: FullEvidence
}

export const EvidenceCard: React.FC<IEvidenceCardProps> = (props) => {
  const { evidence } = props

  // "TK"/empty urls are placeholders from WIP tokens — never render them as
  // live links (only the resolved ones are shown).
  const urls = evidence.urls.filter((url) => !isPlaceholder(url.url))

  return (
    <div className="flex flex-col gap-4 rounded-md bg-muted/50 p-4">
      {(!isPlaceholder(evidence.name) || !isPlaceholder(evidence.summary)) && (
        <div className="flex flex-col gap-2">
          {!isPlaceholder(evidence.name) && (
            <h4 className="text-base leading-6 tracking-normal text-card-foreground">
              {evidence.name}
            </h4>
          )}
          {!isPlaceholder(evidence.summary) && (
            <div className="text-base leading-6 tracking-normal text-muted-foreground prose max-w-none">
              <ReactMarkdown
                components={markdownComponents}
                remarkPlugins={[remarkBreaks]}
              >
                {evidence.summary}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {urls.map((url, index) => (
          <EvidenceLink
            href={url.url}
            key={`${index}-${url.url}`}
            type={url.type}
          >
            {isPlaceholder(url.name) ? url.url : url.name}
          </EvidenceLink>
        ))}
      </div>
    </div>
  )
}
