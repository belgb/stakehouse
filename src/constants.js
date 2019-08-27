import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'

export const COLOR = {
  BACKGROUND: '#fff',
  ERROR: '#ba1614',
  PRIMARY: '#0d6f77',
  PRIMARY_LIGHT: '#1badba',
  SECONDARY: '#b91aaa',
  SUCCESS: '#53ba21',
  TEXT: '#22244a',
  WARNING: orange[700]
}

export const COMMS_KEYS = {
  MANAGE: 'MANAGE',
  SATISFIED: 'SATISFIED',
  INFORMED: 'INFORMED',
  MONITOR: 'MONITOR'
}

export const COMMS_GROUPS = {
  [COMMS_KEYS.MANAGE]: 'Manage closely',
  [COMMS_KEYS.SATISFIED]: 'Engage regularly',
  [COMMS_KEYS.INFORMED]: 'Update and inform',
  [COMMS_KEYS.MONITOR]: 'Monitor'
}

export const COMMS_RESPONSES = {
  [COMMS_KEYS.MANAGE]: 'Work together, engage regularly and openly.',
  [COMMS_KEYS.SATISFIED]: 'Keep in regular contact, share information.',
  [COMMS_KEYS.INFORMED]: 'Provide updates and information.',
  [COMMS_KEYS.MONITOR]: 'Monitor and provide updates as required, be ready to respond to questions and requests.'
}

export const PAGES = {
  MAPPED_STAKEHOLDER_ADD_TO_MAP: {
    TITLE: 'Add stakeholder or partner',
    PATH: '/stakeholdermap/:id/mappedstakeholder/add'
  },
  MAPPED_STAKEHOLDER_EDIT: {
    TITLE: 'Edit stakeholder or partner',
    PATH: '/stakeholdermap/:stakeholderMapId/mappedstakeholder/:stakeholderId/edit'
  },
  MAPPED_STAKEHOLDER_VIEW: {
    TITLE: 'Stakeholder or partner',
    PATH: '/stakeholdermap/:stakeholderMapId/mappedstakeholder/:stakeholderId/view'
  },
  NOT_FOUND: {
    TITLE: 'Not Found',
    PATH: '/not-found'
  },
  STAKEHOLDER_MAP_CREATE: {
    TITLE: 'Create engagement map',
    PATH: '/stakeholdermap/create'
  },
  STAKEHOLDER_MAP_EDIT: {
    TITLE: 'Edit engagement map',
    PATH: '/stakeholdermap/:id/edit'
  },
  STAKEHOLDER_MAP_LIST: {
    TITLE: 'Engagement maps',
    PATH: '/'
  },
  STAKEHOLDER_MAP_VIEW: {
    TITLE: 'Engagement map',
    PATH: '/stakeholdermap/:id/view'
  }
}

export const LAYOUT = {
  DRAWER_WIDTH: 240,
  MENU_ITEM_HEIGHT: 48
}

export const MESSAGES = {
  CONTENT: {
    ERROR: 'Something went wrong - please try again',
    SUCCESS: 'Success'
  },
  FORM_HELP_TEXT: 'Fields marked with * are required.',
  TYPES: {
    ERROR: 'error',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning'
  },
  VALIDATION: {
    REQUIRED: 'This field is required'
  }
}

export const MODELS = {
  MAPPED_STAKEHOLDER: 'mappedStakeholder',
  STAKEHOLDER: 'stakeholder',
  STAKEHOLDER_MAP: 'stakeholderMap'
}

export const STAKEHOLDER_SECTORS = {
  BUS: 'Business',
  TRA: 'Industry Association or Representative Body',
  GVC: 'Central Government',
  GVL: 'Local Government',
  EDU: 'University or other educational institution',
  RES: 'Research Institute or organisation',
  IWI: 'Iwi or Māori Authority',
  NGO: 'Non-governmental organisation (NGO)',
  EXT: 'External service supplier',
  INT: 'Internal',
  OTH: 'Other'
}

export const STAKEHOLDER_STATUS_KEYS = {
  GOOD: 'GOOD',
  OK: 'OK',
  BAD: 'BAD',
  NEW: 'NEW'
}

export const STAKEHOLDER_STATUS_COLORS = {
  [STAKEHOLDER_STATUS_KEYS.NEW]: blue[500],
  [STAKEHOLDER_STATUS_KEYS.GOOD]: green[500],
  [STAKEHOLDER_STATUS_KEYS.OK]: orange[500],
  [STAKEHOLDER_STATUS_KEYS.BAD]: red[500]
}

export const STAKEHOLDER_STATUSES = {
  [STAKEHOLDER_STATUS_KEYS.NEW]: 'Early development',
  [STAKEHOLDER_STATUS_KEYS.GOOD]: 'Productive and robust',
  [STAKEHOLDER_STATUS_KEYS.OK]: 'Positive – requires more development',
  [STAKEHOLDER_STATUS_KEYS.BAD]: 'Tense – more work needed'
}

export const STATUS_WEIGHT = {
  [STAKEHOLDER_STATUS_KEYS.GOOD]: 0,
  [STAKEHOLDER_STATUS_KEYS.NEW]: 1,
  [STAKEHOLDER_STATUS_KEYS.OK]: 2,
  [STAKEHOLDER_STATUS_KEYS.BAD]: 3
}
