
const xdata = {
  default:{
    version: '1.0.0',
    title: 'organizer',
    origin: 'http://localhost:8000',
    params: true,
    error: '/error',
    base_path: '/vault',
    delete_meta: 10000,
    webmanifest: './manifest.webmanifest',
    base_script_name: 'main',
    styles:[{
      href: './app/css/ico.css',
      rel: 'stylesheet'
    },{
      href: './app/css/bootstrap.css',
      rel: 'stylesheet'
    },{
      href: './app/css/main.css',
      rel: 'stylesheet'
    }],
    js_head:[],
    js_body:[],
    storage: {
      max_age: 9999999999,
      prefix: 'rt'
    },
    stream: {
      download: {
        type: 'text/plain',
        charset: 'utf-8'
      },
      fetch: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  },
  cipher: {
    order: ['AES', 'SERPENT', 'TWOFISH']
  },
  schema: {
    birthdays: [],
    business: [],
    bills: [],
    contacts: [],
    diary: [],
    emails: [],
    events: [],
    locations: [],
    notes: [],
    passwords: [],
    schedule: [],
    shopping: [],
    todos: []
  },
  nav: [
    'birthdays', 'business', 'bills', 'contacts', 'diary', 'emails', 'events', 'locations',
    'notes', 'passwords', 'schedule', 'shopping', 'todos', 'settings'
  ],
  mainmenu: [
    ['home', '/home'],
    ['birthdays', '/birthdays'],
    ['business', '/business'],
    ['bills', '/bills'],
    ['contacts', '/contacts'],
    ['diary', '/diary'],
    ['emails', '/emails'],
    ['events', '/events'],
    ['locations', '/locations'],
    ['notes', '/notes'],
    ['passwords', '/passwords'],
    ['schedule', '/schedule'],
    ['shopping', '/shopping'],
    ['todos', '/todos'],
    ['settings', '/settings'],
    ['about','/about']
  ],
  vault: {
    msg: 'vault page'
  },
  home: {
    msg: 'home page'
  },
  about: {
    msg: 'about page'
  },
  settings: {
    msg: 'settings page'
  },
  birthdays: {
    msg: 'birthdays page'
  },
  business: {
    msg: 'business page'
  },
  bills: {
    msg: 'bills page'
  },
  contacts: {
    msg: 'contacts page'
  },
  diary: {
    msg: 'diary page'
  },
  emails: {
    msg: 'emails page'
  },
  events: {
    msg: 'events page'
  },
  locations: {
    msg: 'locations page'
  },
  notes: {
    msg: 'notes page'
  },
  passwords: {
    msg: 'passwords page'
  },
  schedule: {
    msg: 'schedule page'
  },
  shopping: {
    msg: 'shopping page'
  },
  todos: {
    msg: 'todos page'
  }
}

export { xdata }
