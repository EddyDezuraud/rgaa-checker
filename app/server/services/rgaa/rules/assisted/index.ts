import type { RgaaRule } from '../../types'
import videoCaptions from './rgaa-4-1-1'
import formLabels from './rgaa-11-1-1'
import navigationOrder from './rgaa-12-1-2'
import imageText from './rgaa-1-2-1'
import frameTitles from './rgaa-2-1-1'
import audioTranscript from './rgaa-5-1-1'
import tableHeaders from './rgaa-6-1-1'
import scriptEvents from './rgaa-7-1-1'
import mandatoryElements from './rgaa-8-1-1'
import listStructure from './rgaa-10-1-1'
import keyboardShortcuts from './rgaa-13-1-1'

export const loadAssistedRules = (): RgaaRule[] => [
  videoCaptions,
  formLabels,
  navigationOrder,
  imageText,
  frameTitles,
  audioTranscript,
  tableHeaders,
  scriptEvents,
  mandatoryElements,
  listStructure,
  keyboardShortcuts
]
