/*  ============================================================
    MEMORY.JS  —  this is the only file you need to edit.
    ============================================================

    Everything written here shows up on the website.
    Change the words, add a photo. That's it.

    To add a photo:
      1. drop the file into  public/photos/
      2. copy one of the { } blocks below
      3. change "image" to "/photos/your-new-file.jpg"

    `date` is optional everywhere. Leave it as "" and no date is
    shown anywhere — the layout closes up on its own. Put a real
    date in (like "12 January 2025") whenever you want one to appear.
*/

export const herName = "Ket"; // opening screen becomes "Hey, Ket ❤️"

export const intro = {
  line: "I made a little something for you.",
  button: "Open it",
};

export const galleryHeading = {
  kicker: "our photos",
  title: "The days I keep going back to",
  lead: "Tap any photo to see it bigger.",
  tapHint: "Tap to open",
  /* the masthead line above the grid */
  issue: "a scrapbook",
  note: "for Ket",
};

/*  Big lines of type dropped into the grid between the photos,
    the way a magazine breaks up a photo essay. One appears every
    four photos, cycling through these. Add or remove freely.      */
export const pullQuotes = [
  "Red dupatta, lily pads everywhere, and you laughing at absolutely everything.",
  "I have a hundred photos of you. These are the ones I go back to.",
  "Nothing important happened on any of these days. That was the point.",
];

/*  The gallery. Add as many as you like — the editorial grid, the
    numbering and the swipe-through viewer all adjust on their own.  */
export const photos = [
  {
    image: "/photos/02-winter-sky.jpg",
    date: "",
    title: "The winter selfie",
    caption: "I didn't know this day would become one of my favourite memories.",
  },
  {
    image: "/photos/01-flower-behind-ear.jpg",
    date: "",
    title: "The flower",
    caption:
      "You tucked it behind my ear and I wore it the rest of the day. I wasn't giving it back.",
  },
  {
    image: "/photos/03-feet-in-the-river.jpg",
    date: "",
    title: "Nothing happened",
    caption: "Two pairs of feet, cold water, no plan. Best afternoon of my year.",
  },
  {
    image: "/photos/04-boat-in-lily-pads.jpg",
    date: "",
    title: "The boat day",
    caption:
      "The boatman stopped rowing. Neither of us wanted to be the one to say we should go back.",
  },
  {
    image: "/photos/12-sunset-laugh.jpg",
    date: "",
    title: "Golden hour",
    caption: "The light did something perfect and you were laughing before I even said anything.",
  },
  {
    image: "/photos/11-looking-down.jpg",
    date: "",
    title: "You, looking down",
    caption: "I took this without asking and you never noticed. My favourite photo of you that isn't a selfie.",
  },
  {
    image: "/photos/05-the-hug.jpg",
    date: "",
    title: "Your hair over both our faces",
    caption: "You laughed into my shoulder and I decided I was keeping this day.",
  },
  {
    image: "/photos/13-into-your-neck.jpg",
    date: "",
    title: "Laughing too hard",
    caption: "You laughed so hard you had to hide your face. I kept the one where I can still see it.",
  },
  {
    image: "/photos/06-hand-on-head.jpg",
    date: "",
    title: "My hand, your head",
    caption: "It just went there. It always goes there.",
  },
  {
    image: "/photos/15-under-the-trees.jpg",
    date: "",
    title: "Under the trees",
    caption: "Wind in the branches and your head on my shoulder. We stayed longer than we meant to.",
  },
  {
    image: "/photos/07-cheek-to-cheek.jpg",
    date: "",
    title: "Cheek to cheek",
    caption: "You leaned in before I did. For once I didn't have to be the brave one.",
  },
  {
    image: "/photos/10-durga-puja.jpg",
    date: "",
    title: "Durga Puja",
    caption:
      "You in green and gold with that little cherry purse, on the one day of the year everyone dresses up. I couldn't take my eyes off you.",
  },
  {
    image: "/photos/08-under-the-umbrella.jpg",
    date: "",
    title: "The one where we both looked up",
    caption: "Of a hundred photos that day, this is the only one where we both stayed still.",
  },
  {
    image: "/photos/14-on-your-shoulder.jpg",
    date: "",
    title: "Just resting",
    caption: "Nothing happening. You, on my shoulder, done with the day. I'd take this over any posed photo.",
  },
];

export const timelineHeading = {
  kicker: "the short version",
  title: "How it went",
  lead: "Not every day. Just the ones I'd want to live through again.",
};

/*  The timeline, in order. One photo + one sentence each.
    `image: ""` is allowed — that makes a text-only entry.          */
export const timeline = [
  {
    date: "",
    title: "The winter selfie",
    text: "I checked my phone eleven times before you replied.",
    image: "/photos/02-winter-sky.jpg",
  },
  {
    date: "",
    title: "The flower",
    text: "You put a flower behind my ear in the middle of a busy road.",
    image: "/photos/01-flower-behind-ear.jpg",
  },
  {
    date: "",
    title: "The boat day",
    text: "Red dupatta, lily pads everywhere, and you laughing at absolutely everything.",
    image: "/photos/04-boat-in-lily-pads.jpg",
  },
  {
    date: "",
    title: "Still you",
    text: "Same person, same laugh, still my favourite part of the day.",
    image: "/photos/14-on-your-shoulder.jpg",
  },
];

export const loveHeading = {
  kicker: "honestly",
  title: "Things I love about you",
  lead: "Tap a card. There's something behind each one.",
};

/*  The cards. Title shows, message hides until she taps it.
    Add or remove as many as you want.                              */
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

/*  The one surprise. Point `image` at any photo to make it yours. */
export const surprise = {
  kicker: "one more thing",
  prompt: "I have one little surprise for you...",
  button: "Open it",
  image: "/photos/09-you-laughing.jpg",
  date: "",
  title: "If I could relive one day with you, I'd choose this one.",
  text: "Not the boat, not the river, not the food. This exact second — you, laughing at something I said, head thrown back, not caring who was looking.",
};

/*  Background music.
    Drop an mp3 into  public/audio/  and point `file` at it.
    Set file to "" to remove the player entirely.                     */
export const music = {
  file: "/audio/our-song.mp3",
  label: "Our song",
};

/*  The scratch card. She rubs the silver away with a finger to reveal
    whatever is underneath. Works on a phone and with a mouse.         */
export const scratch = {
  kicker: "you have to work for this one",
  prompt: "There's one last thing. Scratch it off.",
  hint: "Scratch here",
  image: "/photos/13-into-your-neck.jpg",
  date: "",
  title: "You found the last one.",
  text: "This is the face I think about when we're apart. If you had to keep exactly one photo of us, keep this one. I already did.",
  skip: "Can't scratch it? Tap here",
};

/*  A secret. Tap the heart in "Hey, Ket ❤️" this many times on the
    opening screen and a note appears. Nobody finds this by accident.  */
export const secret = {
  taps: 5,
  message: "You found the thing I hid just for you. ❤️",
};

export const final = {
  kicker: "the end, for now",
  line1: "And that's just a few of our memories...",
  line2: "I can't wait to make many more with you.",
  line3: "I love you ❤️",
  sign: "— Bipro",
};
