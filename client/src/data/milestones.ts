import type { AgeBand } from '../types';
import { SOURCES as S } from './sources';

// ---------------------------------------------------------------------------
// Developmental content, organized by age band and aligned to the CDC
// "Learn the Signs. Act Early." checkpoints (2022 update, developed with the
// AAP), with WHO motor-development standards and AAP HealthyChildren guidance.
//
// IMPORTANT FRAMING: these are TYPICAL ranges, not deadlines. Healthy children
// reach milestones at different times. The "watchFor" items mirror the CDC's
// "act early" guidance and are reasons to *chat with your pediatrician*, not
// causes for alarm. Nothing here is medical advice.
// ---------------------------------------------------------------------------

export const AGE_BANDS: AgeBand[] = [
  {
    id: 'm0-2',
    label: 'Newborn (0–2 months)',
    minDays: 0,
    maxDays: 61,
    overview:
      'Your newborn is adjusting to life outside the womb. Most of their world is eating, sleeping, and being soothed. Vision is blurry beyond about 8–12 inches — roughly the distance to your face during feeding. Reflexes (rooting, sucking, grasping, startle) drive most movement. By around 2 months you may see the first real social smile and hear coos — early signs the brain is wiring for connection.',
    milestones: [
      { domain: 'social', text: 'Calms down when spoken to or picked up', source: S.CDC },
      { domain: 'social', text: 'Begins to smile at people (social smile, often by ~2 months)', tip: 'Smile and talk to your baby face-to-face often — they learn connection by mirroring you.', source: S.CDC },
      { domain: 'language', text: 'Makes sounds other than crying (cooing)', tip: 'Pause after you talk so they can “answer” — this builds early conversation turns.', source: S.CDC },
      { domain: 'cognitive', text: 'Watches your face and follows you with eyes briefly', source: S.CDC },
      { domain: 'physical', text: 'Holds head up briefly during supervised tummy time', tip: 'Do short tummy-time sessions several times a day while awake and watched.', source: S.WHO },
      { domain: 'feedingSleep', text: 'Feeds every 2–3 hours; sleeps 14–17 hours across day and night', source: S.AAP_FEEDING },
    ],
    dosDonts: [
      { do: 'Always place baby on their back to sleep, on a firm flat surface with nothing else in the crib.', dont: 'Don’t put pillows, blankets, bumpers, or stuffed animals in the sleep space.', source: S.AAP_SLEEP },
      { do: 'Hold, cuddle, and respond to cries — you cannot “spoil” a newborn.', dont: 'Don’t worry that comforting often will create bad habits this young.', source: S.AAP },
      { do: 'Do supervised tummy time while awake to build neck and shoulder strength.', dont: 'Don’t leave baby unsupervised on their tummy or let them sleep on it.', source: S.CDC },
      { do: 'Talk, sing, and read aloud — your voice fuels brain development.', dont: 'Don’t rely on screens; AAP advises avoiding screen media under 18–24 months (except video chat).', source: S.AAP_MEDIA },
    ],
    dailyRhythm: { sleep: '14–17 hours total, in short stretches day and night', feeding: 'On demand, roughly every 2–3 hours (8–12 feeds/day)', note: 'Newborn sleep is irregular — a consolidated night is still weeks away.' },
    play: [
      'High-contrast black-and-white cards held ~8–12 inches away',
      'Gentle face-to-face talking, singing, and smiling',
      'Letting baby grasp your finger',
      'Short, frequent supervised tummy time on a blanket',
    ],
    safety: [
      'Back to sleep, every sleep, in their own clear crib/bassinet',
      'Correctly installed rear-facing car seat for every ride',
      'Never shake a baby — if frustrated, place baby safely down and step away',
      'Keep the sleep area smoke-free and not overheated',
    ],
    watchFor: [
      'Doesn’t respond to loud sounds',
      'Doesn’t watch things as they move by ~2 months',
      'Doesn’t smile at people by ~2 months',
      'Can’t hold head up at all during tummy time by ~2 months',
    ],
  },

  {
    id: 'm2-4',
    label: '2–4 months',
    minDays: 61,
    maxDays: 122,
    overview:
      'This is a delightfully social stretch. Your baby smiles to get your attention, chuckles, and “talks” in coos. Head control is improving fast — they hold their head steady when upright and push up on forearms during tummy time. Hands are discovering the world: they bring them to the mouth and swat at dangling toys.',
    milestones: [
      { domain: 'social', text: 'Smiles on their own to get your attention; may chuckle', source: S.CDC },
      { domain: 'language', text: 'Coos and makes sounds back when you talk (turn-taking)', tip: 'Narrate your day and wait for their reply — these “serve and return” chats build language.', source: S.CDC },
      { domain: 'physical', text: 'Holds head steady without support when held upright', source: S.WHO },
      { domain: 'physical', text: 'Pushes up on forearms during tummy time; brings hands to mouth', tip: 'Place a toy just ahead during tummy time to motivate pushing up.', source: S.CDC },
      { domain: 'cognitive', text: 'Looks at and follows moving things; recognizes familiar people at a distance', source: S.CDC },
    ],
    dosDonts: [
      { do: 'Keep up daily supervised tummy time — work toward ~15–30 min total a day.', dont: 'Don’t leave baby long in swings, bouncers, or seats that limit movement.', source: S.CDC },
      { do: 'Respond to coos by talking back; name things you see.', dont: 'Don’t use screen media as background — it reduces the talk babies hear.', source: S.AAP_MEDIA },
      { do: 'Offer safe, graspable toys to swat and hold.', dont: 'Don’t prop bottles or leave baby alone while feeding.', source: S.AAP_FEEDING },
      { do: 'Continue back-sleeping and safe-sleep rules.', dont: 'Don’t add crib bumpers, positioners, or weighted blankets/sleepers.', source: S.AAP_SLEEP },
    ],
    dailyRhythm: { sleep: '12–16 hours total; nights may start to lengthen', feeding: 'Breast milk or formula every 3–4 hours; no solids yet', note: 'Most babies aren’t ready for solid food until around 6 months.' },
    play: [
      'Dangling, high-contrast toys to bat at',
      'Mirror play — babies love faces, including their own',
      'Singing with gentle bouncing and movement',
      'Reading board books with simple, bold pictures',
    ],
    safety: [
      'Never leave baby alone on a bed, couch, or changing table — rolling can start any time',
      'Keep small objects and cords out of reach',
      'Check toys for loose or small parts',
      'Continue rear-facing car seat use',
    ],
    watchFor: [
      'Doesn’t watch things as they move',
      'Doesn’t smile at people',
      'Can’t hold head steady when held',
      'Doesn’t coo or make sounds',
      'Doesn’t bring hands to mouth',
    ],
  },

  {
    id: 'm4-6',
    label: '4–6 months',
    minDays: 122,
    maxDays: 183,
    overview:
      'Your baby is becoming a curious explorer. They laugh, squeal, and blow raspberries, and everything goes straight to the mouth. Many roll from tummy to back, and reaching becomes purposeful. Around 6 months, signs of readiness for solid foods often appear: good head control and sitting with support.',
    milestones: [
      { domain: 'social', text: 'Knows familiar people; laughs and enjoys looking at the mirror', source: S.CDC },
      { domain: 'language', text: 'Takes turns making sounds; blows raspberries; squeals', tip: 'Copy their sounds back — imitation games teach conversation.', source: S.CDC },
      { domain: 'physical', text: 'Rolls from tummy to back; pushes up with straight arms; reaches to grab a toy', tip: 'Place toys just out of reach to encourage reaching and rolling.', source: S.WHO },
      { domain: 'cognitive', text: 'Brings things to the mouth to explore; reaches with purpose', source: S.CDC },
      { domain: 'feedingSleep', text: 'May show readiness for solids near 6 months (good head control, sits with support, interest in food)', tip: 'Start iron-rich purées or soft foods alongside continued milk; introduce common allergens early per your pediatrician.', source: S.AAP_FEEDING },
    ],
    dosDonts: [
      { do: 'Around 6 months, introduce iron-rich solids while continuing breast milk/formula.', dont: 'Don’t give honey before 12 months, cow’s milk as a main drink before 12 months, or choking hazards (whole nuts, grapes, popcorn).', source: S.AAP_FEEDING },
      { do: 'Childproof now — anything in reach goes in the mouth.', dont: 'Don’t leave small objects, coins, or button batteries within reach.', source: S.AAP },
      { do: 'Read and talk constantly; name objects and feelings.', dont: 'Don’t introduce screen entertainment; keep it off during this window.', source: S.AAP_MEDIA },
      { do: 'Give floor time to practice rolling and reaching.', dont: 'Don’t use sit-up seats or walkers — they can delay motor skills and cause injuries.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '12–16 hours total; many sleep longer stretches at night with 2–3 naps', feeding: 'Milk every 4 hours; small amounts of solids may begin near 6 months', note: 'Solids at this stage are for practice — milk remains the main nutrition.' },
    play: [
      'Texture and rattle toys safe for mouthing',
      'Peekaboo to introduce object permanence',
      'Rolling a soft ball back and forth',
      'Songs with hand motions',
    ],
    safety: [
      'Lower the crib mattress before baby can sit/pull up',
      'Keep choking hazards and small items off the floor',
      'Secure to a five-point harness in seats; never on raised surfaces unattended',
      'Set water heater under 120°F (49°C) to prevent scald burns',
    ],
    watchFor: [
      'Doesn’t try to get things in reach',
      'Shows no affection for caregivers',
      'Doesn’t respond to sounds around them',
      'Has trouble getting things to the mouth',
      'Doesn’t roll over in either direction',
      'Seems very stiff or very floppy',
    ],
  },

  {
    id: 'm6-9',
    label: '6–9 months',
    minDays: 183,
    maxDays: 274,
    overview:
      'Mobility and personality bloom. Many babies sit without support, rake or pick up food, and babble strings like “bababa” and “mamama.” Stranger awareness and separation reactions appear — a normal, healthy sign of attachment. Object permanence is dawning: they look for things you hide.',
    milestones: [
      { domain: 'social', text: 'May be shy or anxious with strangers; reacts when you leave', tip: 'Play peekaboo and short separations to build trust that you come back.', source: S.CDC },
      { domain: 'language', text: 'Babbles strings of sounds (“bababa”, “mamama”); responds to their name', tip: 'Use their name often and respond to babble as if it’s real talk.', source: S.CDC },
      { domain: 'physical', text: 'Sits without support; moves objects hand to hand; rakes small foods', source: S.WHO },
      { domain: 'cognitive', text: 'Looks for dropped or hidden objects; bangs two things together', source: S.CDC },
      { domain: 'feedingSleep', text: 'Eats a wider range of textures; may take 2 naps', source: S.AAP_FEEDING },
    ],
    dosDonts: [
      { do: 'Offer safe finger foods and let baby self-feed (with supervision).', dont: 'Don’t leave baby alone while eating; learn infant choking first aid.', source: S.AAP_FEEDING },
      { do: 'Name objects, narrate, and read daily to grow vocabulary.', dont: 'Don’t expect screens to teach language — live interaction is what works.', source: S.AAP_MEDIA },
      { do: 'Create safe floor space to crawl and explore.', dont: 'Don’t use baby walkers — they’re an injury risk and discouraged by the AAP.', source: S.AAP },
      { do: 'Keep consistent, comforting goodbye routines.', dont: 'Don’t sneak away — predictable goodbyes build security.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '12–16 hours total with ~2 naps; many sleep through the night', feeding: 'Milk plus 2–3 solid “meals”; introduce cup with water at meals', note: 'Teething may begin and briefly disrupt sleep.' },
    play: [
      'Stacking cups and simple cause-and-effect toys',
      'Peekaboo and gentle hide-and-find with toys',
      'Banging safe pots/spoons to explore sound',
      'Board books with flaps and textures',
    ],
    safety: [
      'Babyproof: outlet covers, cabinet locks, secure furniture and TVs to walls',
      'Gate stairs once baby is mobile',
      'Keep cords, blinds, and small items out of reach',
      'Lower crib mattress to its lowest setting',
    ],
    watchFor: [
      'Doesn’t bear weight on legs with support',
      'Doesn’t sit with help',
      'Doesn’t babble or respond to their name',
      'Doesn’t recognize familiar people',
      'Doesn’t look where you point',
      'Doesn’t transfer toys from one hand to the other',
    ],
  },

  {
    id: 'm9-12',
    label: '9–12 months',
    minDays: 274,
    maxDays: 365,
    overview:
      'Your baby is on the move and communicating with intent. Pulling to stand and cruising along furniture lead toward first steps. The pincer grasp (thumb and forefinger) lets them pick up tiny bits of food. They wave, play pat-a-cake, understand “no,” and may say “mama” or “dada” with meaning.',
    milestones: [
      { domain: 'social', text: 'Plays games like pat-a-cake; waves bye-bye', source: S.CDC },
      { domain: 'language', text: 'Says “mama”/“dada” or a special name; understands “no”', tip: 'Pair words with gestures and respond to their attempts to grow real language.', source: S.CDC },
      { domain: 'physical', text: 'Pulls to stand and cruises along furniture; uses a pincer grasp', source: S.WHO },
      { domain: 'cognitive', text: 'Looks for hidden things; puts objects into a container', tip: 'Offer cups and containers to fill and dump — great for thinking skills.', source: S.CDC },
      { domain: 'feedingSleep', text: 'Eats mostly table foods in safe pieces; drinks from an open/straw cup with help', source: S.AAP_FEEDING },
    ],
    dosDonts: [
      { do: 'Encourage cruising and standing with safe support.', dont: 'Don’t rush walking or use walkers; let skills develop on their own.', source: S.AAP },
      { do: 'Offer a variety of healthy table foods in safe pieces.', dont: 'Don’t give round/firm choking hazards (whole grapes, nuts, hot dogs uncut, hard candy).', source: S.AAP_FEEDING },
      { do: 'Talk, read, sing, and name everything throughout the day.', dont: 'Don’t substitute screens for interaction (video chat with family is fine).', source: S.AAP_MEDIA },
      { do: 'Keep predictable routines and lots of affection.', dont: 'Don’t expect separation anxiety to vanish — it’s a normal phase.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '12–16 hours total; usually 2 naps', feeding: '3 meals plus snacks of table food; milk continues', note: 'At 12 months, whole cow’s milk can be introduced if advised by your pediatrician.' },
    play: [
      'Containers to fill and empty',
      'Stacking and nesting toys',
      'Naming body parts and pictures in books',
      'Push toys for new walkers (not seated walkers)',
    ],
    safety: [
      'Re-check babyproofing now that baby can reach higher',
      'Anchor furniture and TVs; lock away cleaners and medicines',
      'Keep button batteries and magnets completely out of reach',
      'Use stair gates and window guards',
    ],
    watchFor: [
      'Doesn’t crawl or stand with support',
      'Doesn’t search for hidden objects',
      'Doesn’t say single words like “mama” or “dada”',
      'Doesn’t learn gestures like waving or shaking head',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm12-15',
    label: '12–15 months',
    minDays: 365,
    maxDays: 456,
    overview:
      'Welcome to toddlerhood. Many take their first independent steps and begin to say one or two words besides “mama/dada.” They point to ask for things, follow simple directions paired with gestures, and love to show affection. Curiosity outpaces caution — close supervision matters more than ever.',
    milestones: [
      { domain: 'physical', text: 'Takes a few steps on their own; feeds self with fingers', source: S.WHO },
      { domain: 'language', text: 'Tries to say one or two words besides “mama/dada”; looks at a named object', tip: 'Name what they point to and expand on it (“ball — a red ball!”).', source: S.CDC },
      { domain: 'social', text: 'Claps; shows affection with hugs and cuddles', source: S.CDC },
      { domain: 'cognitive', text: 'Points to ask for something or get help; copies you', source: S.CDC },
      { domain: 'feedingSleep', text: 'Transitions toward whole milk and family meals; may move to one longer nap soon', source: S.AAP_FEEDING },
    ],
    dosDonts: [
      { do: 'Offer choices and let them try self-feeding with a spoon.', dont: 'Don’t pressure eating; toddlers’ appetites swing day to day.', source: S.AAP_FEEDING },
      { do: 'Respond to pointing by naming and talking about it.', dont: 'Don’t introduce solo screen time; AAP advises avoiding it before 18–24 months.', source: S.AAP_MEDIA },
      { do: 'Childproof for a climber and walker; supervise closely.', dont: 'Don’t leave water (tubs, buckets, pools) unattended — drowning is fast and silent.', source: S.AAP },
      { do: 'Keep consistent nap and bedtime routines.', dont: 'Don’t skip the wind-down routine — it cues sleep.', source: S.AAP_SLEEP },
    ],
    dailyRhythm: { sleep: '11–14 hours total including 1–2 naps', feeding: '3 meals + 2 snacks; whole milk and water as main drinks', note: 'Limit juice; water and milk are best.' },
    play: [
      'Push-walker toys and balls to chase',
      'Simple shape sorters and stacking blocks',
      'Naming pictures while reading together',
      'Pretend play like “talking” on a toy phone',
    ],
    safety: [
      'Anchor all furniture; toddlers climb everything',
      'Lock away medicines, cleaners, and small batteries',
      'Constant supervision near water and stairs',
      'Set hot drinks and cookware out of reach',
    ],
    watchFor: [
      'Doesn’t point to show you things',
      'Can’t walk by 18 months (chat earlier if you’re concerned)',
      'Doesn’t know what familiar objects are for',
      'Doesn’t gain new words',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm15-18',
    label: '15–18 months',
    minDays: 456,
    maxDays: 548,
    overview:
      'Independence and imitation define this stage. Toddlers walk confidently, climb on and off furniture, scribble, and help with dressing. Vocabulary grows toward several words, and they follow one-step directions without gestures. Big feelings arrive too — early tantrums are normal as words can’t yet keep up with emotions.',
    milestones: [
      { domain: 'physical', text: 'Walks well; climbs on/off a couch; scribbles; tries to use a spoon', source: S.WHO },
      { domain: 'language', text: 'Tries to say three or more words besides “mama/dada”; follows one-step directions without gestures', tip: 'Keep instructions short and clear; celebrate every new word.', source: S.CDC },
      { domain: 'social', text: 'Points to show you something interesting; helps with dressing', source: S.CDC },
      { domain: 'cognitive', text: 'Copies chores; plays with toys in simple ways (pushes a toy car)', source: S.CDC },
      { domain: 'feedingSleep', text: 'Usually moves to one afternoon nap', source: S.AAP },
    ],
    dosDonts: [
      { do: 'Stay calm and consistent during tantrums; name feelings.', dont: 'Don’t punish normal emotional outbursts — coach instead.', source: S.AAP },
      { do: 'Encourage helping and pretend play.', dont: 'Don’t expect sharing yet — it develops later.', source: S.AAP },
      { do: 'If you use any media after 18 months, choose high-quality content and co-view.', dont: 'Don’t use screens during meals or before bed.', source: S.AAP_MEDIA },
      { do: 'Offer the same healthy foods the family eats.', dont: 'Don’t become a short-order cook or force bites.', source: S.AAP_FEEDING },
    ],
    dailyRhythm: { sleep: '11–14 hours total with one ~1–3 hour nap', feeding: '3 meals + 2 snacks; family foods', note: 'Predictable routines reduce bedtime battles.' },
    play: [
      'Stacking, sorting, and simple puzzles',
      'Crayons and big paper for scribbling',
      'Pretend play: feeding a doll, toy phone',
      'Outdoor walking, climbing, and ball play',
    ],
    safety: [
      'Keep climbing-prone furniture anchored',
      'Lock up medications and chemicals; know Poison Control number',
      'Supervise near water at all times',
      'Use stair gates and keep windows secured',
    ],
    watchFor: [
      'Doesn’t copy others or point to show things',
      'Doesn’t gain new words or have at least a few words',
      'Doesn’t notice or mind when a caregiver leaves or returns',
      'Doesn’t walk',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm18-24',
    label: '18–24 months',
    minDays: 548,
    maxDays: 730,
    overview:
      'A language explosion is coming. Toddlers begin combining two words (“more milk”), point to body parts and pictures when asked, and run, kick, and climb stairs. They notice others’ emotions and look to your face to gauge new situations. Pretend play deepens.',
    milestones: [
      { domain: 'language', text: 'Says several single words and begins two-word phrases (“more milk”); points to things in a book', tip: 'Expand their words into short sentences to model grammar.', source: S.CDC },
      { domain: 'physical', text: 'Runs; kicks a ball; walks up a few stairs; eats with a spoon', source: S.WHO },
      { domain: 'social', text: 'Notices when others are hurt or upset; looks to your face to react', source: S.CDC },
      { domain: 'cognitive', text: 'Uses an object for its purpose; plays with several toys together', source: S.CDC },
      { domain: 'feedingSleep', text: 'One solid nap; total sleep 11–14 hours', source: S.AAP_SLEEP },
    ],
    dosDonts: [
      { do: 'Talk with rich vocabulary and read interactively every day.', dont: 'Don’t quiz constantly — keep talk warm and back-and-forth.', source: S.CDC },
      { do: 'Set a few clear, consistent limits with calm follow-through.', dont: 'Don’t expect impulse control yet — redirection works better than reasoning.', source: S.AAP },
      { do: 'Limit any screen use to ~1 hour/day of high-quality content, co-viewed (after 18–24 months).', dont: 'Don’t allow solo or background screens.', source: S.AAP_MEDIA },
      { do: 'Offer balanced meals and let the child decide how much to eat.', dont: 'Don’t use food as reward or punishment.', source: S.AAP_FEEDING },
    ],
    dailyRhythm: { sleep: '11–14 hours including one afternoon nap', feeding: '3 meals + 2 snacks; whole milk and water', note: 'Consistency at bedtime helps with the toddler “one more” stalling.' },
    play: [
      'Simple pretend play (kitchen, dolls, cars)',
      'Ball games — kicking and throwing',
      'Chunky puzzles and building blocks',
      'Singing songs with movements',
    ],
    safety: [
      'Keep furniture anchored; toddlers climb to reach',
      'Pools, tubs, and buckets need constant supervision',
      'Store cleaners, meds, and batteries locked and high',
      'Use a forward-facing or rear-facing car seat per weight/height limits',
    ],
    watchFor: [
      'Doesn’t use 2-word phrases by ~24 months',
      'Doesn’t know what to do with common things (brush, phone, spoon)',
      'Doesn’t copy actions and words',
      'Doesn’t follow simple instructions',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm24-30',
    label: '2–2½ years',
    minDays: 730,
    maxDays: 913,
    overview:
      'Your child is a busy learner with a fast-growing vocabulary (often ~50+ words and two-word combos by 2). They play alongside other children, begin simple pretend (feeding a doll), follow two-step directions, and assert independence (“me do it!”). Patience and routine are your best friends now.',
    milestones: [
      { domain: 'language', text: 'Says about 50 words; uses two-word phrases; names items in a book', tip: 'Read daily and talk through routines to keep words multiplying.', source: S.CDC },
      { domain: 'social', text: 'Plays next to (and sometimes with) other children; shows you what they can do', source: S.CDC },
      { domain: 'physical', text: 'Jumps with both feet off the ground; kicks and throws; turns book pages', source: S.WHO },
      { domain: 'cognitive', text: 'Uses objects to pretend; follows two-step instructions; knows at least one color', source: S.CDC },
      { domain: 'feedingSleep', text: 'Eats family meals independently; usually still naps once', source: S.AAP },
    ],
    dosDonts: [
      { do: 'Offer simple choices to support autonomy (“red cup or blue cup?”).', dont: 'Don’t engage in power struggles over things that don’t matter.', source: S.AAP },
      { do: 'Coach feelings and model calm during tantrums.', dont: 'Don’t expect sharing or turn-taking to come easily yet.', source: S.AAP },
      { do: 'Keep screen time to ~1 hour/day of quality content, co-viewed.', dont: 'Don’t use screens to soothe routinely — it limits self-regulation practice.', source: S.AAP_MEDIA },
      { do: 'Begin a relaxed approach to potty learning when signs of readiness appear.', dont: 'Don’t force or shame toilet training — readiness varies widely.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '11–14 hours including one nap', feeding: '3 meals + 2 snacks; varied family foods', note: 'Picky eating is common and usually a normal phase.' },
    play: [
      'Pretend play sets (kitchen, tools, dolls)',
      'Large crayons and finger paints',
      'Simple sorting by color and shape',
      'Outdoor jumping, climbing, and running',
    ],
    safety: [
      'Keep climbing furniture anchored to walls',
      'Constant supervision around all water',
      'Lock up medicines, cleaners, and sharp tools',
      'Teach simple safety words (“hot,” “stop”)',
    ],
    watchFor: [
      'Doesn’t use 2-word phrases',
      'Doesn’t imitate actions or words',
      'Doesn’t follow simple instructions',
      'Doesn’t know what to do with common objects',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm30-36',
    label: '2½–3 years',
    minDays: 913,
    maxDays: 1095,
    overview:
      'Speech becomes clearer and more complex — strangers can understand much of what your child says. They ask “what” and “who,” use pronouns (“I/me/we”), and engage in richer pretend play and early problem-solving. Big emotions remain, but self-regulation is slowly improving.',
    milestones: [
      { domain: 'language', text: 'Says ~50+ words; speaks in short sentences others mostly understand; uses words like “I/me/we”', tip: 'Ask open questions and give them time to answer.', source: S.CDC },
      { domain: 'social', text: 'Plays with other children; shows a wider range of emotions', source: S.CDC },
      { domain: 'cognitive', text: 'Uses things to pretend; solves simple problems; knows at least one color', source: S.CDC },
      { domain: 'physical', text: 'Strings large beads; turns pages one at a time; takes off some clothes', source: S.WHO },
      { domain: 'feedingSleep', text: 'Many drop the nap between 3–4 years; total sleep 10–13 hours', source: S.AAP_SLEEP },
    ],
    dosDonts: [
      { do: 'Encourage pretend play and playdates to build social skills.', dont: 'Don’t expect perfect sharing — it’s still developing.', source: S.AAP },
      { do: 'Read together and talk about stories and feelings.', dont: 'Don’t replace conversation and play with screens.', source: S.AAP_MEDIA },
      { do: 'Offer a calm, consistent bedtime routine.', dont: 'Don’t allow screens in the hour before bed.', source: S.AAP_SLEEP },
      { do: 'Praise effort and cooperation specifically.', dont: 'Don’t use harsh or physical punishment — it’s ineffective and harmful.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '10–13 hours; nap may be ending', feeding: '3 meals + 2 snacks; involve child in simple food choices', note: 'A “quiet time” can replace a dropped nap.' },
    play: [
      'Tricycles and balance toys',
      'Threading beads and simple puzzles',
      'Pretend scenarios with figures and props',
      'Drawing and early art with crayons',
    ],
    safety: [
      'Continue water supervision and pool fencing',
      'Keep harmful items locked and out of sight',
      'Teach name and basic safety rules',
      'Use a properly fitted car seat (harnessed)',
    ],
    watchFor: [
      'Speech is unclear most of the time to familiar people',
      'Doesn’t speak in sentences',
      'Doesn’t play pretend or with other children',
      'Doesn’t make eye contact',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm3-4',
    label: '3–4 years',
    minDays: 1095,
    maxDays: 1460,
    overview:
      'Imagination soars. Your preschooler invents elaborate pretend play, asks endless “why,” and speaks in sentences others understand most of the time. They begin to show empathy, follow rules in simple games, and grow more independent with dressing, eating, and toileting.',
    milestones: [
      { domain: 'language', text: 'Speaks in 4+ word sentences; tells about their day; asks “why/who/what”', tip: 'Answer questions and ask some back to extend conversations.', source: S.CDC },
      { domain: 'social', text: 'Pretends to be something during play; comforts others; likes to help', source: S.CDC },
      { domain: 'physical', text: 'Catches a large ball most of the time; draws a person with 3+ parts; holds crayon between fingers', source: S.WHO },
      { domain: 'cognitive', text: 'Names a few colors; tells what comes next in a familiar story; avoids danger', source: S.CDC },
      { domain: 'feedingSleep', text: 'Usually no nap; 10–13 hours of night sleep', source: S.AAP_SLEEP },
    ],
    dosDonts: [
      { do: 'Support imaginative play and offer art and building materials.', dont: 'Don’t over-schedule — free play builds creativity and problem-solving.', source: S.AAP },
      { do: 'Set clear, consistent rules with simple consequences.', dont: 'Don’t expect emotional control to be reliable yet.', source: S.AAP },
      { do: 'Read daily and point out letters and sounds naturally.', dont: 'Don’t pressure formal academics; learning through play works best.', source: S.AAP },
      { do: 'Keep total quality screen time to ~1 hour/day, co-viewed.', dont: 'Don’t allow screens to crowd out sleep, activity, or play.', source: S.AAP_MEDIA },
    ],
    dailyRhythm: { sleep: '10–13 hours at night; nap usually gone', feeding: '3 meals + 2 snacks; child helps choose and prepare simple foods', note: 'Offer healthy options and let the child decide amounts.' },
    play: [
      'Dress-up and imaginative role play',
      'Building sets, puzzles, and sorting games',
      'Drawing, cutting (kid scissors), and crafts',
      'Running, jumping, climbing, and ball games',
    ],
    safety: [
      'Teach street, water, and stranger safety simply',
      'Keep helmets on for bikes/trikes',
      'Continue car seat use (harnessed by height/weight)',
      'Supervise around water; never assume “water-safe”',
    ],
    watchFor: [
      'Speech is hard for others to understand',
      'Doesn’t speak in sentences',
      'Doesn’t play pretend',
      'Doesn’t follow simple instructions',
      'Loses skills they once had',
    ],
  },

  {
    id: 'm4-5',
    label: '4–5 years',
    minDays: 1460,
    maxDays: 1825,
    overview:
      'Your child is getting ready for school. They tell stories with a beginning and middle, hold conversations with several back-and-forth turns, count and recognize some letters and numbers, and enjoy games with rules and turn-taking. Friendships and cooperative play grow important.',
    milestones: [
      { domain: 'language', text: 'Tells a short story; keeps a conversation going with 3+ exchanges; uses time words', tip: 'Encourage storytelling and ask follow-up questions.', source: S.CDC },
      { domain: 'social', text: 'Follows rules and takes turns; sings, dances, or performs; does simple chores', source: S.CDC },
      { domain: 'cognitive', text: 'Counts to 10; names some numbers and letters; answers questions about a story', source: S.CDC },
      { domain: 'physical', text: 'Hops on one foot; buttons some buttons; writes some letters in their name', source: S.WHO },
      { domain: 'feedingSleep', text: '10–13 hours of night sleep; no nap', source: S.AAP_SLEEP },
    ],
    dosDonts: [
      { do: 'Play games with simple rules to practice turn-taking and patience.', dont: 'Don’t expect them to always lose gracefully — it’s a skill in progress.', source: S.AAP },
      { do: 'Read together daily and talk about letters, sounds, and numbers.', dont: 'Don’t turn learning into pressure; keep it playful.', source: S.AAP },
      { do: 'Give simple chores and responsibilities.', dont: 'Don’t do everything for them — independence builds confidence.', source: S.AAP },
      { do: 'Keep quality screen time consistent (~1 hour/day) with limits.', dont: 'Don’t allow screens to displace sleep, exercise, or play.', source: S.AAP_MEDIA },
    ],
    dailyRhythm: { sleep: '10–13 hours per night', feeding: '3 meals + healthy snacks; involve child in choices', note: 'Limit sugary drinks; water and milk are best.' },
    play: [
      'Board games with simple rules',
      'Drawing, writing, and craft projects',
      'Bikes/scooters with helmets',
      'Group and cooperative pretend play',
    ],
    safety: [
      'Reinforce road, water, and personal safety rules',
      'Helmets for wheels; supervise new activities',
      'Booster/forward-facing car seat per height/weight',
      'Teach what to do if lost and how to ask for help',
    ],
    watchFor: [
      'Can’t tell a simple story or be understood by others',
      'Doesn’t show a range of emotions',
      'Doesn’t respond to people or only with one or two words',
      'Loses skills they once had',
      'Has extreme difficulty separating or with daily routines',
    ],
  },

  {
    id: 'm5-6',
    label: '5–6 years',
    minDays: 1825,
    maxDays: 2200,
    overview:
      'School-age skills consolidate. Your child reasons more clearly, follows multi-step directions, reads or recognizes more letters and words, and manages emotions better. Friendships, fairness, and competence matter to them. Encourage independence, curiosity, and plenty of active play.',
    milestones: [
      { domain: 'cognitive', text: 'Counts and recognizes many letters/numbers; begins reading some words', source: S.CDC },
      { domain: 'language', text: 'Tells longer stories; speaks clearly in full sentences', source: S.CDC },
      { domain: 'social', text: 'Plays cooperatively, follows rules, and forms friendships', source: S.CDC },
      { domain: 'physical', text: 'Skips, hops, and has refined fine-motor control for writing and cutting', source: S.WHO },
      { domain: 'feedingSleep', text: '9–12 hours of night sleep recommended', source: S.AAP_SLEEP },
    ],
    dosDonts: [
      { do: 'Encourage reading, curiosity, and independent problem-solving.', dont: 'Don’t over-correct mistakes; let learning happen with support.', source: S.AAP },
      { do: 'Support friendships and cooperative play.', dont: 'Don’t ignore social struggles — coach skills gently.', source: S.AAP },
      { do: 'Set consistent routines for sleep, homework, and chores.', dont: 'Don’t allow screens in the bedroom or before bed.', source: S.AAP_MEDIA },
      { do: 'Ensure 1+ hour of active play daily.', dont: 'Don’t let screens replace physical activity and sleep.', source: S.AAP },
    ],
    dailyRhythm: { sleep: '9–12 hours per night', feeding: '3 balanced meals + healthy snacks', note: 'Consistent routines support focus and mood.' },
    play: [
      'Reading together and early independent reading',
      'Sports, bikes, and active outdoor play',
      'Building, art, and creative projects',
      'Games that involve rules, strategy, and teamwork',
    ],
    safety: [
      'Reinforce traffic, water, and online safety basics',
      'Helmets and gear for sports and wheels',
      'Booster seat until seat belt fits properly (~4’9”)',
      'Teach personal safety and trusted adults',
    ],
    watchFor: [
      'Trouble being understood or telling a simple story',
      'Very little interest in playing with others',
      'Trouble following routines or instructions',
      'Loses skills they once had',
      'Extreme behavior changes or fears affecting daily life',
    ],
  },
];

// Stable, opaque key for a milestone within a band — used to persist which
// milestones a parent has checked off. Tied to band id + position, so it stays
// stable as long as the data file's ordering for that band is unchanged.
export function milestoneKey(bandId: string, index: number): string {
  return `${bandId}#${index}`;
}

export function bandForDays(days: number): AgeBand {
  const found = AGE_BANDS.find((b) => days >= b.minDays && days < b.maxDays);
  if (found) return found;
  // Older than the last defined band: clamp to the final one.
  return AGE_BANDS[AGE_BANDS.length - 1];
}

export function bandIndexForDays(days: number): number {
  const i = AGE_BANDS.findIndex((b) => days >= b.minDays && days < b.maxDays);
  return i === -1 ? AGE_BANDS.length - 1 : i;
}

export const DOMAIN_META: Record<string, { label: string; icon: string }> = {
  physical: { label: 'Physical & Motor', icon: '🤸' },
  cognitive: { label: 'Cognitive', icon: '🧠' },
  language: { label: 'Language & Communication', icon: '💬' },
  social: { label: 'Social & Emotional', icon: '💗' },
  feedingSleep: { label: 'Feeding & Sleep', icon: '🍼' },
};
