import type { Evidence, EvidenceUrl } from "@/lib/metrics-data"
import { EvidenceLink } from "./ui/evidence-link.tsx"

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

  return (
    <div className="flex flex-col gap-4 rounded-md bg-muted/50 p-4">
      {(evidence.name || evidence.summary) && (
        <div className="flex flex-col gap-2">
          {evidence.name && (
            <h4 className="text-base leading-6 tracking-normal text-card-foreground">
              {evidence.name}
            </h4>
          )}
          {evidence.summary && (
            <p className="text-base leading-6 tracking-normal text-muted-foreground">
              {evidence.summary}
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {evidence.urls.map((url, index) => (
          <EvidenceLink
            href={url.url}
            key={`${index}-${url.url}`}
            type={url.type}
          >
            {url.name}
          </EvidenceLink>
        ))}
      </div>
    </div>
  )
}
