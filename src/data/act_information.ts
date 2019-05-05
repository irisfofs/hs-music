// TODO: Move these to some util file?
const HS_RED = '#e00707';
const HS_BLUE = '#0715cd';
const HS_LIME = '#4ac925';
const HS_GREEN = '#168500';
const HS_GRAY = '#C6C6C6';

export interface ComicEvent {
  title: string;
  page: number;
  subtitle: string;
  color: string;
  length?: number;
}

/* Act information */
export const landmarks: {side1: ComicEvent[], side2: ComicEvent[]} = {
  side1: [
    {
      title: 'Act 1',
      page: 1,
      subtitle: 'The Note Desolation Plays',
      color: HS_RED
    },
    {
      title: 'Act 2',
      page: 248,
      subtitle: 'Raise of the Conductor\'s Baton',
      color: HS_RED
    },
    {
      title: 'Act 3',
      page: 759,
      subtitle: 'Insane Corkscrew Haymakers',
      color: HS_RED
    },
    {
      title: 'Intermission',
      page: 1154,
      subtitle: 'Don\'t Bleed on the Suits',
      color: HS_GREEN,
    },
    {
      title: 'Act 4',
      page: 1358,
      subtitle: 'Flight of the Paradox Clones',
      color: HS_RED
    },
    {
      title: 'Act 5 Act 1',
      page: 1989,
      subtitle: 'MOB1US DOUBL3 R34CH4ROUND',
      color: 'blue'
    },
    {
      title: 'Act 5 Act 2',
      page: 2626,
      subtitle: 'He is already here.',
      color: HS_RED
    },
    {
      title: 'EOA5',
      page: 4109,
      subtitle: 'Cascade.',
      color: 'black',
    },
  ],
  side2: [
    {
      title: 'Act 6 Act 1',
      page: 4113,
      subtitle: 'Through Broken Glass',
      color: HS_GRAY
    },
    {
      title: 'Act 6 Intermission 1',
      page: 4295,
      subtitle: 'corpse party',
      color: HS_LIME
    },
    {
      title: 'Act 6 Act 2',
      page: 4419,
      subtitle: 'Your shit is wrecked.',
      color: HS_GRAY
    },
    {
      title: 'Act 6 Intermission 2',
      page: 4667,
      subtitle: 'penis ouija',
      color: HS_LIME
    },
    {title: 'Act 6 Act 3', page: 4820, subtitle: 'Nobles', color: HS_GRAY},
    {
      title: 'Act 6 Intermission 3',
      page: 5263,
      subtitle: 'Ballet of the Dancestors',
      color: HS_LIME
    },
    {title: 'Act 6 Act 4', page: 5438, subtitle: 'Void', color: HS_GRAY},
    {
      title: 'Act 6 Intermission 4',
      page: 5441,
      subtitle: 'Dead',
      color: HS_LIME
    },
    {
      title: 'Act 6 Act 5',
      page: 5571,
      subtitle: 'Of Gods and Tricksters',
      color: HS_GRAY
    },
    {
      title: 'Act 6 Intermission 5',
      page: 5927,
      subtitle: 'I\'M PUTTING YOU ON SPEAKER CRAB.',
      color: HS_LIME
    },
    {title: 'Act 6 Act 6', page: 6243, subtitle: '', color: HS_GREEN},
    {
      title: 'Act 6 Act 6 Intermission 1',
      page: 6278,
      subtitle: '',
      color: HS_GRAY
    },
    {title: 'Act 6 Act 6 Act 2', page: 6475, subtitle: '', color: HS_GREEN},
    {
      title: 'Act 6 Act 6 Intermission 2',
      page: 6531,
      subtitle: '',
      color: HS_GRAY
    },
    {title: 'Act 6 Act 6 Act 3', page: 6853, subtitle: '', color: HS_GREEN},
    {
      title: 'Act 6 Act 6 Intermission 3',
      page: 6901,
      subtitle: '',
      color: HS_GRAY
    },
    {title: 'Act 6 Act 6 Act 4', page: 6921, subtitle: '', color: HS_GREEN},
    {
      title: 'Act 6 Act 6 Intermission 4',
      page: 6944,
      subtitle: '',
      color: HS_GRAY
    },
    {title: 'Act 6 Act 6 Act 5', page: 7409, subtitle: '', color: HS_GREEN},
    {
      title: 'Act 6 Act 6 Intermission 5',
      page: 7449,
      subtitle: '',
      color: HS_GRAY
    },
    {title: 'EOA6', page: 8087, subtitle: 'Collide.', color: 'green'},
    {title: 'Act 7', page: 8127, subtitle: '', color: 'white'},
  ],
};
