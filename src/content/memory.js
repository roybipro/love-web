/*  ============================================================
    MEMORY.JS  —  this is the only file you need to edit.
    ============================================================

    Everything written here shows up on the website.
    Change the words, add a photo. That's it.

    To add a photo:
      1. drop the file into  public/photos/
      2. copy one of the { } blocks in `photos`
      3. change "image" to "/photos/your-new-file.jpg"

    Three fields are optional everywhere. Leave them "" and they
    vanish from the page without leaving a gap:
      date   — e.g. "12 January 2025"
      place  — e.g. "Sylhet"
      note   — a line of pen beside the photo

    Anything marked EDIT ME is a placeholder I could not fill in
    without inventing something about your life. Those are yours.
*/

export const herName = "You";

/*  The cover of the book.                                              */
export const cover = {
  kicker: "a scrapbook",
  titleTo: "To", // becomes "To You ❤️"
  subtitle: "A little place for all the moments that became our story.",
  button: "Open Our Story",
  /* four prints pinned around the cover — pick the ones you love most */
  deco: [
    "/photos/04-boat-in-lily-pads.jpg",
    "/photos/12-sunset-laugh.jpg",
    "/photos/10-durga-puja.jpg",
    "/photos/03-feet-in-the-river.jpg",
  ],
};

/*  The navigation, in the order she reads it.
    `id` must match the section it points at — don't change those
    unless you know what you're doing. `label` is what she sees.      */
export const memories = [
  { id: "home", label: "Home" },
  { id: "how-we-met", label: "How We Met" },
  { id: "first-memory", label: "Our First Memory" },
  { id: "little-moments", label: "Little Moments" },
  { id: "favourites", label: "Favourite Memories" },
  { id: "love", label: "Things I Love" },
  { id: "timeline", label: "Our Timeline" },
  { id: "letter", label: "A Letter" },
];

/*  ============================================================
    MEMORY 02 — HOW WE MET
    ============================================================                          */
export const howWeMet = {
  label: "Memory 02",
  title: "How we met",
  lead: "It started with a simple conversation, and somehow it became everything.",
  /* one paragraph per string — keep them short, they set as article text */
  paragraphs: [
    "We met in a moment that felt ordinary at the time, but turned out to be the beginning of something important.",
    "From the start, there was something easy about being around you. The conversations felt natural, and the time went by quickly.",
    "What began as a small connection slowly grew into something real and steady.",
    "I still remember how comfortable it felt to be with you, even from the beginning.",
    "Now we have our own story, and I am grateful for every step that brought us here.",
  ],
  note: "and it still feels lucky",
  image: "",
};

/*  ============================================================
    MEMORY 03 — OUR FIRST MEMORY
    ============================================================
    `ar` is the shape of the print. Leave it out and the photo is
    cropped to a square-ish portrait like the rest of the wall;
    "4 / 3" lets a landscape photo show itself whole.                 */
export const firstMemory = {
  label: "Memory 03",
  title: "The first photo of us",
  date: "",
  place: "",
  ar: "4 / 3",
  text: "A simple moment, captured without trying too hard. It felt natural then, and it still feels like us now.",
  note: "one of my favourites",
  image: "/photos/16-first-photo.jpg",
};

/*  ============================================================
    MEMORY 04 — LITTLE MOMENTS  (the polaroid wall)
    ============================================================                          */
export const galleryHeading = {
  label: "Memory 04",
  title: "Little moments",
  lead: "The days I keep going back to. Tap any print to see it bigger — double-tap it for something I wrote beside it.",
  tapHint: "Tap to open",
  issue: "the prints",
  note: "for Ket",
};

/*  Big lines of type dropped into the wall, the way a magazine
    breaks up a photo essay. One appears every four photos.           */
export const pullQuotes = [
  "Red dupatta, lily pads everywhere, and you laughing at absolutely everything.",
  "I have a hundred photos of you. These are the ones I go back to.",
  "Nothing important happened on any of these days. That was the point.",
];

/*  The wall. Add as many as you like — the layout, the numbering
    and the swipe-through viewer all adjust on their own.
    `note` is the hidden line of pen; it shows on hover on a laptop
    and sits under the print on a phone.                              */
export const photos = [
  {
    image: "/photos/16-first-photo.jpg",
    date: "",
    place: "",
    ar: "4 / 3",
    title: "The first photo of us",
    caption:
      "Blue and gold, green and white, standing at a railing at night. The first one where we were actually us.",
    note: "we kept this one",
  },
  {
    image: "/photos/02-winter-sky.jpg",
    date: "",
    place: "",
    title: "The winter selfie",
    caption: "I didn't know this day would become one of my favourite memories.",
    note: "cold hands, warm day",
  },
  {
    image: "/photos/01-flower-behind-ear.jpg",
    date: "",
    place: "",
    title: "The flower",
    caption:
      "You tucked it behind my ear and I wore it the rest of the day. I wasn't giving it back.",
    note: "I kept it in a book somewhere",
  },
  {
    image: "/photos/03-feet-in-the-river.jpg",
    date: "",
    place: "",
    title: "Nothing happened",
    caption: "Two pairs of feet, the river, no plan. Best morning of my year.",
    note: "summer, and nowhere to be",
  },
  {
    image: "/photos/04-boat-in-lily-pads.jpg",
    date: "",
    place: "",
    title: "The boat day",
    caption:
      "The boatman stopped rowing. Neither of us wanted to be the one to say we should go back.",
    note: "the red one ❤️",
  },
  {
    image: "/photos/12-sunset-laugh.jpg",
    date: "",
    place: "",
    title: "Golden hour",
    caption: "The light did something perfect and you were laughing before I even said anything.",
    note: "best light of the whole year",
  },
  {
    image: "/photos/11-looking-down.jpg",
    date: "",
    place: "",
    title: "You, looking down",
    caption:
      "I took this without asking and you never noticed. My favourite photo of you that isn't a selfie.",
    note: "you never saw me take this",
  },
  {
    image: "/photos/05-the-hug.jpg",
    date: "",
    place: "",
    title: "Your hair over both our faces",
    caption: "You laughed into my shoulder and I decided I was keeping this day.",
    note: "I can still hear it",
  },
  {
    image: "/photos/13-into-your-neck.jpg",
    date: "",
    place: "",
    title: "Laughing too hard",
    caption: "You laughed so hard you had to hide your face. I kept the one where I can still see it.",
    note: "that butterfly stayed on my hoodie for weeks",
  },
  {
    image: "/photos/06-hand-on-head.jpg",
    date: "",
    place: "",
    title: "My hand, your head",
    caption: "It just went there. It always goes there.",
    note: "instinct",
  },
  {
    image: "/photos/15-under-the-trees.jpg",
    date: "",
    place: "",
    title: "Under the trees",
    caption: "Wind in the branches and your head on my shoulder. We stayed longer than we meant to.",
    note: "you fell asleep almost",
  },
  {
    image: "/photos/07-cheek-to-cheek.jpg",
    date: "",
    place: "",
    title: "Cheek to cheek",
    caption: "You leaned in before I did. For once I didn't have to be the brave one.",
    note: "still surprised you did that",
  },
  {
    image: "/photos/10-durga-puja.jpg",
    date: "",
    place: "",
    title: "Durga Puja",
    caption:
      "You in green and gold with that little cherry purse, on the one day of the year everyone dresses up. I couldn't take my eyes off you.",
    note: "the purse made the outfit",
  },
  {
    image: "/photos/08-under-the-umbrella.jpg",
    date: "",
    place: "",
    title: "The one where we both looked up",
    caption: "Of a hundred photos that day, this is the only one where we both stayed still.",
    note: "a miracle, honestly",
  },
  {
    image: "/photos/14-on-your-shoulder.jpg",
    date: "",
    place: "",
    title: "Just resting",
    caption: "Nothing happening. You, on my shoulder, done with the day. I'd take this over any posed photo.",
    note: "my shoulder, but you can keep it",
  },
];

/*  ============================================================
    MEMORY 05 — FAVOURITE MEMORIES
    ============================================================
    Three prints pulled out of the wall, plus the surprise.           */
export const favouritesHeading = {
  label: "Memory 05",
  title: "Favourite memories",
  lead: "If the whole book burned and I could carry three prints out, it would be these.",
  /* which photos, by their title above */
  picks: ["The boat day", "Golden hour", "Durga Puja"],
};

/*  The one surprise at the end of that section.                     */
export const surprise = {
  prompt: "And one more, that I kept for last...",
  button: "Open it",
  image: "/photos/09-you-laughing.jpg",
  date: "",
  place: "",
  title: "A favorite moment, without needing a reason.",
  text: "Some memories don't need to be explained. They just feel like home.",
};

/*  ============================================================
    MEMORY 06 — THINGS I LOVE ABOUT YOU
    ============================================================                          */
export const loveHeading = {
  label: "Memory 06",
  kicker: "honestly",
  title: "Little things I love about you",
  lead: "Tap a note. There's something behind each one.",
};

export const love = [
  {
    title: "Your Smile",
    text: "I don't think you realise how beautiful your smile is. It reaches your eyes half a second before it reaches your mouth, and by then I've forgotten whatever I was saying.",
  },
  {
    title: "Your Laugh",
    text: "The loud one you try to hide. The one where you hit my arm and tell me to stop, right before you start again.",
  },
  {
    title: "The Way You Care",
    text: "You ask if I've eaten before you've eaten. You remember small things I mentioned once, weeks after I forgot them myself.",
  },
  {
    title: "Your Little Habits",
    text: "Fixing your dupatta against the wind. Talking to animals that aren't yours. Stealing my hoodie and then denying it with a completely straight face.",
  },
  {
    title: "How You Listen",
    text: "You put your phone face-down when I start talking. Nobody has ever done that for me. It's the most romantic thing I know.",
  },
  {
    title: "The Way You Get Quiet",
    text: "When something matters to you, you go still and you just handle it. I love watching you be good at things.",
  },
];

/*  ============================================================
    MEMORY 07 — OUR LITTLE TIMELINE
    ============================================================
    One photo + one sentence each. `date` is left empty on purpose —
    I am not going to invent when things happened. Put your real
    dates in and they appear automatically.                           */
export const timelineHeading = {
  label: "Memory 07",
  title: "Our little timeline",
  lead: "Not every day. Just the ones I'd want to live through again.",
};

export const timeline = [
  {
    date: "",
    title: "The beginning",
    text: "A simple conversation changed the way my days felt.",
    image: "",
  },
  {
    date: "",
    title: "The easy part",
    text: "We started talking and it felt natural from the start.",
    image: "",
  },
  {
    date: "",
    title: "The connection",
    text: "What began as small moments became something important.",
    image: "",
  },
  {
    date: "",
    title: "A feeling I couldn't ignore",
    text: "I realised how much you meant to me, and it stayed with me.",
    image: "",
  },
  {
    date: "",
    title: "The first photo",
    text: "A quiet moment, captured with no effort at all.",
    image: "/photos/16-first-photo.jpg",
  },
  {
    date: "",
    title: "The flower",
    text: "One of those small moments that stayed in my head.",
    image: "/photos/01-flower-behind-ear.jpg",
  },
  {
    date: "",
    title: "The boat day",
    text: "Simple, easy, and full of laughter.",
    image: "/photos/04-boat-in-lily-pads.jpg",
  },
  {
    date: "",
    title: "Still writing it",
    text: "Even now, the best part of the day is being with you.",
    image: "/photos/14-on-your-shoulder.jpg",
  },
];

/*  ============================================================
    MEMORY 08 — A LETTER FOR YOU
    ============================================================
    The last page. The letter is the closing message from the old
    version, set by hand on paper.                                    */
export const letter = {
  label: "Memory 08",
  title: "A little letter for you",
  greeting: "Dear you,",
  lines: [
    "Some memories are small, but they stay with you.",
    "I hope we keep making more of them, together.",
  ],
  love: "With love ❤️",
  sign: "— Me",
};

/*  The scratch card, kept as the letter's postscript.               */
export const scratch = {
  ps: "P.S. — there's one last thing. Scratch it off.",
  hint: "Scratch here",
  image: "/photos/13-into-your-neck.jpg",
  title: "You found the last one.",
  text: "This is the face I think about when we're apart. If you had to keep exactly one photo of us, keep this one. I already did.",
  skip: "Can't scratch it? Tap here",
};

/*  ============================================================
    Extras
    ============================================================                          */

/*  Background music. Drop an mp3 into public/audio/ and point
    `file` at it. Set file to "" to remove the player entirely.
    `title` and `artist` are what the player shows.                   */
export const music = {
  file: "/audio/our-song.mp3",
  title: "Iraaday",
  artist: "Abdul Hannan & Rovalio",
};

/*  A secret. Tap the heart on the cover this many times and a note
    appears. Nobody finds this by accident.                           */
export const secret = {
  taps: 5,
  message: "You found the thing I hid just for you. ❤️",
};

/*  Subtle clicks when a page opens or a button is pressed.
    Off unless she turns it on in the music player.                   */
export const sound = {
  enabledByDefault: false,
};
