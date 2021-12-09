/*
 *
 * EntityListSidebar
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { palette } from 'styled-theme';
import { fromJS } from 'immutable';

import { FILTERS_PANEL, EDIT_PANEL } from 'containers/App/constants';

import Scrollable from 'components/styled/Scrollable';
import Icon from 'components/Icon';
import Button from 'components/buttons/Button';
import ButtonToggle from 'components/buttons/ButtonToggle';
import SupTitle from 'components/SupTitle';

import Sidebar from 'components/styled/Sidebar';
import SidebarHeader from 'components/styled/SidebarHeader';

import EntityListSidebarGroups from './EntityListSidebarGroups';

import messages from './messages';

// const Main = styled.div``;
const ScrollableWrapper = styled(Scrollable)`
  background-color: ${palette('aside', 0)};
`;

const ListEntitiesEmpty = styled.div`
  font-size: 1.2em;
  padding: 1.5em;
  color: ${palette('text', 1)};
  @media print {
    font-size: ${(props) => props.theme.sizes.print.large};
  }
`;

const ToggleHide = styled(Button)`
  position: absolute;
  right:0;
  top:0;
`;
// color: ${palette('link', 3)};
// &:hover {
//   color: ${palette('linkHover', 3)};
// }
const SidebarWrapper = styled.div`
  ${(props) => props.sidebarAbsolute
    ? 'position: absolute;top: 0;bottom: 0;;right: 0;z-index: 98;'
    : ''
}
`;

const STATE_INITIAL = {
  expandedGroups: {
    actortypes: true,
    taxonomies: true,
    taxonomies_1: true,
    taxonomies_2: true,
    taxonomies_3: true,
    taxonomies_4: true,
    taxonomies_5: true,
    taxonomies_6: true,
    taxonomies_7: true,
    taxonomies_8: true,
    taxonomies_9: true,
    taxonomies_10: true,
    taxonomies_11: true,
    taxonomies_12: true,
    // connectedTaxonomies: true,
    connections: true,
    targets: false,
    members: false,
    associations: false,
    attributes: true,
  },
};

export class EntityListSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = STATE_INITIAL;
  }

  UNSAFE_componentWillMount() {
    this.setState(STATE_INITIAL);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.activePanel !== this.props.activePanel) {
      // close and reset option panel
      this.props.setActiveOption(null);
    }
  }

  onShowForm = (option) => this.props.setActiveOption(option.active ? null : option);

  onToggleGroup = (groupId, expanded) => {
    this.setState((prevState) => {
      const expandedGroups = { ...prevState.expandedGroups };
      expandedGroups[groupId] = expanded;
      return ({
        expandedGroups,
        activeOption: null,
      });
    });
  }

  getSidebarButtons = () => {
    const { intl } = this.context;
    return ([
      {
        label: intl.formatMessage(messages.header.filterButton),
        panel: FILTERS_PANEL,
        icon: 'filter',
      },
      {
        label: intl.formatMessage(messages.header.editButton),
        panel: EDIT_PANEL,
        icon: 'edit',
      },
    ]);
  }

  render() {
    const {
      canEdit,
      activePanel,
      onPanelSelect,
      hasEntities,
      hasSelected,
      panelGroups,
      onHideSidebar,
    } = this.props;
    const { intl } = this.context;
    return (
      <SidebarWrapper
        sidebarAbsolute
        onClick={onHideSidebar}
      >
        <Sidebar onClick={(evt) => evt.stopPropagation()}>
          <ScrollableWrapper>
            <SidebarHeader hasButtons={canEdit}>
              {canEdit && (
                <ButtonToggle
                  options={this.getSidebarButtons()}
                  activePanel={activePanel}
                  onSelect={onPanelSelect}
                />
              )}
              {!canEdit && <SupTitle title={intl.formatMessage(messages.header.filter)} />}
              <ToggleHide onClick={onHideSidebar}>
                <Icon name="close" />
              </ToggleHide>
            </SidebarHeader>
            <div>
              { (activePanel === FILTERS_PANEL || (activePanel === EDIT_PANEL && hasSelected && hasEntities))
              && (
                <EntityListSidebarGroups
                  groups={fromJS(panelGroups)}
                  onShowForm={this.onShowForm}
                  onToggleGroup={this.onToggleGroup}
                  expanded={this.state.expandedGroups}
                />
              )
              }
              { activePanel === EDIT_PANEL && !hasEntities
              && (
                <ListEntitiesEmpty>
                  <FormattedMessage {...messages.entitiesNotFound} />
                </ListEntitiesEmpty>
              )
              }
              { activePanel === EDIT_PANEL && hasEntities && !hasSelected
              && (
                <ListEntitiesEmpty>
                  <FormattedMessage {...messages.entitiesNotSelected} />
                </ListEntitiesEmpty>
              )
              }
            </div>
          </ScrollableWrapper>
        </Sidebar>
      </SidebarWrapper>
    );
  }
}
EntityListSidebar.propTypes = {
  theme: PropTypes.object,
  activePanel: PropTypes.string,
  canEdit: PropTypes.bool,
  hasEntities: PropTypes.bool,
  hasSelected: PropTypes.bool,
  onPanelSelect: PropTypes.func.isRequired,
  panelGroups: PropTypes.object,
  onHideSidebar: PropTypes.func,
  setActiveOption: PropTypes.func,
};

EntityListSidebar.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default withTheme(EntityListSidebar);
