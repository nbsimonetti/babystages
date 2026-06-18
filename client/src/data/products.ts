// Stage-based product suggestions powering the affiliate revenue stream.
//
// These are GENERIC, development-supporting categories (books, safe toys, gear)
// tied to each age band — not medical recommendations or specific endorsements.
// Links are built as Amazon search URLs with an Associates tag so there are no
// stale ASINs; swap in curated products/links per market in production. Every
// placement must show the disclosure below (FTC requirement).

export const AFFILIATE_TAG = 'babystages-20'; // replace with your real Associates tag
export const AFFILIATE_DISCLOSURE =
  'BabyStages may earn a small commission from purchases made through these links, at no extra cost to you. These are general ideas to support play and development — not medical advice or endorsements.';

export interface ProductPick {
  title: string;
  why: string;
  query: string;
}

function link(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
}

const DEFAULT: ProductPick[] = [
  { title: 'Picture books for this age', why: 'Daily reading builds language and bonding.', query: 'children picture books age appropriate' },
  { title: 'Open-ended developmental toys', why: 'Simple toys encourage exploration and problem-solving.', query: 'developmental toys toddler' },
];

const PICKS: Record<string, ProductPick[]> = {
  'm0-2': [
    { title: 'High-contrast newborn cards', why: 'Match newborns’ developing vision (~8–12 inches).', query: 'high contrast baby cards newborn' },
    { title: 'Tummy-time mat', why: 'Supports daily supervised tummy time for neck strength.', query: 'tummy time mat baby' },
    { title: 'Soft black-and-white board books', why: 'Your voice + bold images fuel early brain wiring.', query: 'black and white baby board book' },
  ],
  'm2-4': [
    { title: 'Dangling grab-and-bat toys', why: 'Encourages reaching and hand discovery.', query: 'baby activity gym dangling toys' },
    { title: 'Baby-safe mirror', why: 'Babies love faces — great for tummy time.', query: 'baby tummy time mirror' },
  ],
  'm4-6': [
    { title: 'Textured teethers', why: 'Safe mouthing supports sensory exploration (teething begins).', query: 'silicone baby teether' },
    { title: 'Soft rattles & grip toys', why: 'Builds purposeful reaching and grasping.', query: 'soft baby rattle set' },
    { title: 'First-foods feeding set', why: 'Helpful when starting solids around 6 months.', query: 'baby led weaning feeding set' },
  ],
  'm6-9': [
    { title: 'Stacking cups', why: 'Classic cause-and-effect and fine-motor play.', query: 'stacking cups baby' },
    { title: 'Soft cloth/flap books', why: 'Supports babbling, naming, and peekaboo games.', query: 'baby cloth flap book' },
  ],
  'm9-12': [
    { title: 'Drop-and-fill containers', why: 'Object permanence and pincer-grasp practice.', query: 'baby object permanence box' },
    { title: 'Push-along walker toy', why: 'Supports cruising and first steps (not seated walkers).', query: 'baby push walker toy' },
    { title: 'Open/straw cups', why: 'For learning to drink as table foods expand.', query: 'baby straw training cup' },
  ],
  'm12-15': [
    { title: 'Shape sorter', why: 'Problem-solving and fine-motor coordination.', query: 'toddler shape sorter' },
    { title: 'Chunky board books', why: 'Naming and pointing grow vocabulary fast.', query: 'toddler board books' },
  ],
  'm15-18': [
    { title: 'Stacking blocks', why: 'Builds coordination and early spatial skills.', query: 'wooden stacking blocks toddler' },
    { title: 'Crayons & big paper', why: 'For first scribbles and grip development.', query: 'toddler crayons washable jumbo' },
  ],
  'm18-24': [
    { title: 'Simple pretend-play sets', why: 'Imaginative play deepens at this age.', query: 'toddler pretend play kitchen set' },
    { title: 'Ball set', why: 'Kicking and throwing build gross-motor skills.', query: 'soft toddler ball set' },
  ],
  'm24-30': [
    { title: 'Chunky puzzles', why: 'Problem-solving and matching.', query: 'toddler wooden puzzles chunky' },
    { title: 'Color & shape sorting toys', why: 'Supports learning colors and categories.', query: 'toddler color sorting toy' },
  ],
  'm30-36': [
    { title: 'Tricycle or balance toy', why: 'Big-muscle coordination and confidence.', query: 'toddler tricycle' },
    { title: 'Threading & lacing beads', why: 'Fine-motor and focus.', query: 'toddler lacing beads' },
  ],
  'm3-4': [
    { title: 'Building blocks / construction sets', why: 'Creativity and spatial reasoning.', query: 'preschool building blocks set' },
    { title: 'Storybooks with rhymes', why: 'Builds vocabulary and early literacy.', query: 'preschool rhyming storybooks' },
    { title: 'Kid-safe scissors & crafts', why: 'Fine-motor and creativity.', query: 'preschool safety scissors craft kit' },
  ],
  'm4-5': [
    { title: 'Simple board games', why: 'Turn-taking, rules, and patience.', query: 'preschool board games age 4' },
    { title: 'Early writing/tracing books', why: 'Pre-writing and letter recognition.', query: 'preschool tracing workbook letters' },
  ],
  'm5-6': [
    { title: 'Beginner reader books', why: 'Supports early independent reading.', query: 'early reader books kindergarten' },
    { title: 'Strategy & counting games', why: 'Numbers, rules, and teamwork.', query: 'kids math counting games age 5' },
    { title: 'Bike + helmet', why: 'Active play and gross-motor skills (wear a helmet).', query: 'kids bike with helmet age 5' },
  ],
};

export function picksForBand(bandId: string): { pick: ProductPick; url: string }[] {
  return (PICKS[bandId] || DEFAULT).map((pick) => ({ pick, url: link(pick.query) }));
}
