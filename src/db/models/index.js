import { MODELS } from '../../constants'
import mappedStakeholder from './mappedStakeholder'
import stakeholder from './stakeholder'
import stakeholderMap from './stakeholderMap'

const models = {
  [MODELS.MAPPED_STAKEHOLDER]: mappedStakeholder,
  [MODELS.STAKEHOLDER]: stakeholder,
  [MODELS.STAKEHOLDER_MAP]: stakeholderMap
}

export default models
