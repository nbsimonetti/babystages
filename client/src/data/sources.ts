import type { Source } from '../types';

// Canonical, evidence-based sources. Every milestone and Do/Don't references
// one of these. URLs point to the organization's public guidance pages.
export const SOURCES = {
  CDC: {
    org: 'CDC — Learn the Signs. Act Early.',
    url: 'https://www.cdc.gov/ncbddd/actearly/milestones/index.html',
  },
  AAP: {
    org: 'American Academy of Pediatrics — HealthyChildren.org',
    url: 'https://www.healthychildren.org/English/ages-stages/Pages/default.aspx',
  },
  AAP_SLEEP: {
    org: 'AAP — Safe Sleep guidance',
    url: 'https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/A-Parents-Guide-to-Safe-Sleep.aspx',
  },
  AAP_MEDIA: {
    org: 'AAP — Media & screen time',
    url: 'https://www.healthychildren.org/English/family-life/Media/Pages/default.aspx',
  },
  AAP_FEEDING: {
    org: 'AAP — Feeding & nutrition',
    url: 'https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/default.aspx',
  },
  WHO: {
    org: 'WHO — Child growth & motor development standards',
    url: 'https://www.who.int/tools/child-growth-standards',
  },
  NIH: {
    org: 'NIH MedlinePlus — Infant & toddler development',
    url: 'https://medlineplus.gov/infantandnewborndevelopment.html',
  },
} satisfies Record<string, Source>;
