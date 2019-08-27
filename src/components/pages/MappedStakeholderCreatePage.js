import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Fuse from 'fuse.js'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MESSAGES, PAGES } from '../../constants'
import { compilePath } from '../../util/path'
import withLayout from '../providers/LayoutProvider'
import withMappedStakeholders from '../providers/MappedStakeholderProvider'
import withStakeholders from '../providers/StakeholderProvider'
import Button from '../shared/Button'
import MappedStakeholderForm, { initialValues, stakeholderInitialValues } from '../shared/MappedStakeholderForm'

const searchDefaults = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1
}

let nameSuggestionEngine = null
let organisationSuggestionEngine = null

const MappedStakeholderCreatePage = props => {
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [nameSuggestions, setNameSuggestions] = useState([])
  const [organisationSuggestions, setOrganisationSuggestions] = useState([])
  const [suggestionSelected, setSuggestionSelected] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [formValues, setFormValues] = useState(initialValues)
  const [disabledFields, setDisabledFields] = useState([])

  useEffect(() => {
    const fetchInitialData = async () => {
      const mappedStakeholderRecords = await props.mappedStakeholderFindAll({ where: { stakeholderMapId: props.stakeholderMapId } })
      let stakeholderRecords = await props.stakeholderFindAll()

      if (mappedStakeholderRecords === null || stakeholderRecords === null) {
        return
      }

      // Remove stakeholders already associated with the map.
      // Stakeholders can only appear on a map once.
      stakeholderRecords = stakeholderRecords.filter(s => mappedStakeholderRecords.find(m => m.stakeholderId === s.id) === undefined)

      nameSuggestionEngine = new Fuse(stakeholderRecords, {
        ...searchDefaults,
        keys: ['firstName', 'surname']
      })

      organisationSuggestionEngine = new Fuse(stakeholderRecords, {
        ...searchDefaults,
        keys: ['organisation']
      })

      setSearchEnabled(true)
    }

    fetchInitialData()
  }, [])

  const handleCancel = () => {
    props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: props.stakeholderMapId }))
  }

  const handleChange = event => {
    setFormValues({ ...formValues, [event.target.id]: event.target.value })

    const isFirstName = event.target.id === 'firstName'
    const isSurname = event.target.id === 'surname'
    const isOrganisation = event.target.id === 'organisation'

    if (!isFirstName && !isSurname && !isOrganisation) {
      return
    }

    if (isFirstName) {
      setFirstName(event.target.value)
    }

    if (isSurname) {
      setSurname(event.target.value)
    }

    if (isFirstName || isSurname) {
      const fName = isFirstName ? event.target.value : firstName
      const sName = isSurname ? event.target.value : surname

      setNameSuggestions(
        nameSuggestionEngine
          .search(`${fName} ${sName}`)
          .slice(0, 4)
      )
    }

    if (isOrganisation) {
      setOrganisation(event.target.value)
      setOrganisationSuggestions(
        organisationSuggestionEngine
          .search(event.target.value)
          .slice(0, 4)
      )
    }
  }

  const handleSelectSuggestion = id => {
    return () => {
      const stakeholder = getUniqueCombinedSuggestions().find(item => item.id === id)

      setSuggestionSelected(true)

      setFormValues({
        ...formValues,
        ...Object.keys(stakeholder).reduce((result, key) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return result
          }

          result[key] = stakeholder[key]
          return result
        }, {})
      })

      setDisabledFields(Object.keys(stakeholderInitialValues))
    }
  }

  const handleClearSuggestion = () => {
    setFormValues({ ...formValues, ...stakeholderInitialValues })
    setNameSuggestions([])
    setOrganisationSuggestions([])
    setSuggestionSelected(false)
    setDisabledFields([])
  }

  const handleSubmit = (values, props) => {
    const applyChanges = async () => {
      const stakeholder = values.id === ''
        ? await props.stakeholderCreate(values)
        : getUniqueCombinedSuggestions().find(item => item.id === values.id)

      if (stakeholder === null || stakeholder === undefined) {
        return false
      }

      const mappedStakeholder = await props.mappedStakeholderCreate({
        ...values,
        stakeholderId: stakeholder.id,
        stakeholderMapId: props.stakeholderMapId
      })

      if (mappedStakeholder === null) {
        return false
      }

      return true
    }

    applyChanges().then(success => {
      if (success) {
        props.showMessage(MESSAGES.CONTENT.SUCCESS, MESSAGES.TYPES.SUCCESS)
      } else {
        props.showMessage(MESSAGES.CONTENT.ERROR, MESSAGES.TYPES.ERROR)
      }

      props.history.push(compilePath(PAGES.STAKEHOLDER_MAP_VIEW.PATH, { id: props.stakeholderMapId }))
    })
  }

  const getUniqueCombinedSuggestions = () => {
    const seen = new Set()

    return [...nameSuggestions, ...organisationSuggestions].filter(item => {
      if (seen.has(item.id)) {
        return false
      }

      seen.add(item.id)

      return true
    })
  }

  const getSuggestionsForDisplay = () => {
    const engine = new Fuse(getUniqueCombinedSuggestions(), {
      ...searchDefaults,
      keys: ['firstName', 'organisation', 'surname']
    })

    return engine
      .search(
        [firstName, surname, organisation]
          .join(' ')
          .replace(/\s{2,}/g, ' ')
          .trim()
      )
      .slice(0, 4)
  }

  const suggestions = getSuggestionsForDisplay()

  return (
    <Grid
      container
      spacing={3}
    >
      <Grid
        item
        xs={12}
        md={8}
      >
        <MappedStakeholderForm
          disabledFields={disabledFields}
          initialValues={formValues}
          onCancel={handleCancel}
          onChange={searchEnabled ? handleChange : () => {}}
          onSubmit={values => handleSubmit(values, props)}
          submitButtonLabel='Add to engagement map'
        />
      </Grid>

      {searchEnabled && suggestions.length > 0 &&
        <Hidden smDown>
          <Grid
            item
            xs={12}
            md={4}
          >
            <Card>
              <CardContent>
                <Typography
                  component='h3'
                  variant='h6'
                >
                  Suggestions
                </Typography>
                <List>
                  {suggestionSelected
                    ? <ListItem disableGutters>
                      <Button
                        onClick={handleClearSuggestion}
                        size='small'
                        variant='outlined'
                      >
                          Clear selection
                      </Button>
                    </ListItem>
                    : suggestions.map(item => (
                      <ListItem
                        key={item.id.toString()}
                        disableGutters
                      >
                        <ListItemText
                          primary={`${item.firstName} ${item.surname}`}
                          secondary={item.organisation}
                        />
                        <Button
                          onClick={handleSelectSuggestion(item.id)}
                          size='small'
                          variant='outlined'
                        >
                            Select
                        </Button>
                      </ListItem>
                    ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Hidden>
      }
    </Grid>
  )
}

MappedStakeholderCreatePage.propTypes = {
  stakeholderMapId: PropTypes.string.isRequired
}

let Page = MappedStakeholderCreatePage

Page = withLayout(Page)
Page = withMappedStakeholders(Page)
Page = withStakeholders(Page)

export default Page
