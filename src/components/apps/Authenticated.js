import React from 'react'
import { MemoryRouter, Redirect, Route, Switch } from 'react-router'
import { PAGES } from '../../constants'
import MappedStakeholderEditPage from '../pages/MappedStakeholderEditPage'
import MappedStakeholderViewPage from '../pages/MappedStakeholderViewPage'
import MappedStakeholderCreatePage from '../pages/MappedStakeholderCreatePage'
import StakeholderMapCreatePage from '../pages/StakeholderMapCreatePage'
import StakeholderMapEditPage from '../pages/StakeholderMapEditPage'
import StakeholderMapViewPage from '../pages/StakeholderMapViewPage'
import StakeholderMapListPage from '../pages/StakeholderMapListPage'
import NotFoundPage from '../pages/NotFoundPage'

const Authenticated = props => {
  return (
    <MemoryRouter>
      <Switch>
        <Route
          exact
          path={PAGES.STAKEHOLDER_MAP_LIST.PATH}
          render={() => (
            <StakeholderMapListPage
              {...props}
              appBarTitle={PAGES.STAKEHOLDER_MAP_LIST.TITLE}
            />
          )}
        />

        <Route
          path={PAGES.STAKEHOLDER_MAP_CREATE.PATH}
          render={() => (
            <StakeholderMapCreatePage
              {...props}
              appBarTitle={PAGES.STAKEHOLDER_MAP_CREATE.TITLE}
            />
          )}
        />

        <Route
          path={PAGES.STAKEHOLDER_MAP_VIEW.PATH}
          render={routeProps => (
            <StakeholderMapViewPage
              {...props}
              appBarTitle={PAGES.STAKEHOLDER_MAP_VIEW.TITLE}
              stakeholderMapId={routeProps.match.params.id}
            />
          )}
        />

        <Route
          path={PAGES.STAKEHOLDER_MAP_EDIT.PATH}
          render={routeProps => (
            <StakeholderMapEditPage
              {...props}
              appBarTitle={PAGES.STAKEHOLDER_MAP_EDIT.TITLE}
              stakeholderMapId={routeProps.match.params.id}
            />
          )}
        />

        <Route
          path={PAGES.MAPPED_STAKEHOLDER_ADD_TO_MAP.PATH}
          render={routeProps => (
            <MappedStakeholderCreatePage
              {...props}
              appBarTitle={PAGES.MAPPED_STAKEHOLDER_ADD_TO_MAP.TITLE}
              stakeholderMapId={routeProps.match.params.id}
            />
          )}
        />

        <Route
          path={PAGES.MAPPED_STAKEHOLDER_EDIT.PATH}
          render={routeProps => (
            <MappedStakeholderEditPage
              appBarTitle={PAGES.MAPPED_STAKEHOLDER_EDIT.TITLE}
              stakeholderMapId={routeProps.match.params.stakeholderMapId}
              stakeholderId={routeProps.match.params.stakeholderId}
            />
          )}
        />

        <Route
          path={PAGES.MAPPED_STAKEHOLDER_VIEW.PATH}
          render={routeProps => (
            <MappedStakeholderViewPage
              appBarTitle={PAGES.MAPPED_STAKEHOLDER_VIEW.TITLE}
              stakeholderMapId={routeProps.match.params.stakeholderMapId}
              stakeholderId={routeProps.match.params.stakeholderId}
            />
          )}
        />

        <Route
          path={PAGES.NOT_FOUND.PATH}
          render={() => (
            <NotFoundPage
              {...props}
              appBarTitle={PAGES.NOT_FOUND.TITLE}
            />
          )}
        />

        <Redirect to={PAGES.NOT_FOUND.PATH} />
      </Switch>
    </MemoryRouter>
  )
}

export default Authenticated
