/*
 *
 * EntityListHeader
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { Map, List } from 'immutable';

import { isEqual } from 'lodash/lang';

import { FILTERS_PANEL, EDIT_PANEL } from 'containers/App/constants';
import { FILTER_FORM_MODEL, EDIT_FORM_MODEL } from 'containers/EntityListForm/constants';

import ButtonDefault from 'components/buttons/ButtonDefault';

import EntityListForm from 'containers/EntityListForm';
import appMessages from 'containers/App/messages';
import PrintHide from 'components/styled/PrintHide';

import EntityListSidebar from './EntityListSidebar';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import { makeActiveFilterOptions } from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

import messages from './messages';

const Styled = styled(PrintHide)``;

const ToggleShow = styled(ButtonDefault)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  padding: 0.75em 1em;
  letter-spacing: 0;
  border-radius: 0;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  font-size: 0.85em;
  width: 100%;
  @media (min-width: ${(props) => props.theme.breakpoints.small}) {
    font-size: 0.85em;
    padding: 0.75em 1em;
    width: ${(props) => props.theme.sizes.aside.width.large}px;
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;

const STATE_INITIAL = {
  activeOption: null,
  visibleSidebar: false,
};

const getFilterConnectionsMsg = (intl, type) => type
  && messages.filterGroupLabel[`connections-${type}`]
  ? intl.formatMessage(messages.filterGroupLabel[`connections-${type}`])
  : intl.formatMessage(messages.filterGroupLabel.connections);

const getEditConnectionsMsg = (intl, type) => type
  && messages.editGroupLabel[`connections-${type}`]
  ? intl.formatMessage(messages.editGroupLabel[`connections-${type}`])
  : intl.formatMessage(messages.editGroupLabel.connections);

export class EntityListHeader extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = STATE_INITIAL;
  }

  UNSAFE_componentWillMount() {
    this.setState(STATE_INITIAL);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.activePanel !== this.props.activePanel) {
      // close and reset option panel
      this.setState({ activeOption: null });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // TODO consider targeting specific query params, eg where, without, cat, catx but also actors, etc
    if (nextProps.listUpdating && isEqual(this.state, nextState)) {
      return false;
    }
    if (this.props.listUpdating && !nextProps.listUpdating) {
      return true;
    }
    return this.props.locationQuery !== nextProps.locationQuery
      || this.props.entityIdsSelected !== nextProps.entityIdsSelected
      || this.props.activePanel !== nextProps.activePanel
      || this.props.taxonomies !== nextProps.taxonomies
      || this.props.connections !== nextProps.connections
      || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  onSetActiveOption = (option) => {
    this.setState({ activeOption: option });
  };

  onShowForm = (option) => {
    this.setState({ activeOption: option.active ? null : option });
  };

  onShowSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ visibleSidebar: true });
  };

  onHideSidebar = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.onHideForm(evt);
    this.setState({ visibleSidebar: false });
  };

  onHideForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ activeOption: null });
  };

  getFormButtons = (activeOption) => {
    const { intl } = this.context;
    const { onCreateOption } = this.props;
    return [
      activeOption.create
        ? {
          type: 'addFromMultiselect',
          position: 'left',
          onClick: () => onCreateOption(activeOption.create),
        }
        : null,
      {
        type: 'simple',
        title: intl.formatMessage(appMessages.buttons.cancel),
        onClick: this.onHideForm,
      },
      {
        type: 'primary',
        title: intl.formatMessage(appMessages.buttons.assign),
        submit: true,
      },
    ];
  };

  resize = () => {
    // reset
    this.setState(STATE_INITIAL);
    this.forceUpdate();
  };

  render() {
    const {
      config,
      onUpdate,
      hasUserRole,
      canEdit,
      activePanel,
      onPanelSelect,
      entities,
      locationQuery,
      taxonomies,
      connectedTaxonomies,
      connections,
      entityIdsSelected,
      actortypes,
      actiontypes,
      targettypes,
      actiontypesForTarget,
      membertypes,
      associationtypes,
    } = this.props;
    const { intl } = this.context;
    const { activeOption } = this.state;

    const hasSelected = entityIdsSelected && entityIdsSelected.size > 0;
    const formModel = activePanel === FILTERS_PANEL ? FILTER_FORM_MODEL : EDIT_FORM_MODEL;

    let panelGroups = null;

    const entitiesSelected = activePanel === EDIT_PANEL
      && canEdit
      && hasSelected
      && entities.filter((entity) => entityIdsSelected.includes(entity.get('id')));

    if (activePanel === FILTERS_PANEL) {
      panelGroups = makeFilterGroups({
        config,
        taxonomies,
        connectedTaxonomies,
        hasUserRole,
        actortypes,
        actiontypes,
        targettypes,
        actiontypesForTarget,
        membertypes,
        associationtypes,
        activeFilterOption: activeOption,
        messages: {
          attributes: intl.formatMessage(messages.filterGroupLabel.attributes),
          taxonomyGroup: intl.formatMessage(messages.filterGroupLabel.taxonomies),
          actortypesGroup: intl.formatMessage(messages.filterGroupLabel.actortypes),
          connections: (type) => getFilterConnectionsMsg(intl, type),
          // connectedTaxonomies: intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
          taxonomies: (taxId) => this.context.intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
          actortypes: intl.formatMessage(appMessages.actortypes.plural),
          actiontypes: intl.formatMessage(appMessages.actiontypes.plural),
        },
      });
    } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
      panelGroups = makeEditGroups({
        config,
        taxonomies,
        connectedTaxonomies,
        activeEditOption: activeOption,
        hasUserRole,
        actortypes,
        actiontypes,
        targettypes,
        actiontypesForTarget,
        membertypes,
        associationtypes,
        messages: {
          attributes: intl.formatMessage(messages.editGroupLabel.attributes),
          taxonomyGroup: intl.formatMessage(messages.editGroupLabel.taxonomies),
          connections: (type) => getEditConnectionsMsg(intl, type),
          taxonomies: (taxId) => this.context.intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
        },
        // selectedActortypeIds: entitiesSelected.groupBy((e) => e.getIn(['attributes', 'actortype_id'])).keySeq(),
        // selectedActiontypeIds: entitiesSelected.groupBy((e) => e.getIn(['attributes', 'measuretype_id'])).keySeq(),
      });
    }
    let formOptions = null;
    if (activeOption) {
      if (activePanel === FILTERS_PANEL) {
        formOptions = makeActiveFilterOptions({
          entities,
          config,
          locationQuery,
          taxonomies,
          connections,
          // actortypes,
          // actiontypes,
          connectedTaxonomies,
          activeFilterOption: activeOption,
          contextIntl: intl,
          messages: {
            titlePrefix: intl.formatMessage(messages.filterFormTitlePrefix),
            without: intl.formatMessage(messages.filterFormWithoutPrefix),
          },
        });
      } else if (activePanel === EDIT_PANEL && canEdit && hasSelected) {
        formOptions = makeActiveEditOptions({
          entities: entitiesSelected,
          config,
          taxonomies,
          connections,
          connectedTaxonomies,
          activeEditOption: activeOption,
          contextIntl: intl,
          messages: {
            title: `${intl.formatMessage(messages.editFormTitlePrefix)} ${entitiesSelected.size} ${intl.formatMessage(messages.editFormTitlePostfix)}`,
          },
        });
      }
    }
    return (
      <Styled>
        {!this.state.visibleSidebar && (
          <ToggleShow onClick={this.onShowSidebar}>
            { canEdit
            && <FormattedMessage {...messages.sidebarToggle.showFilterEdit} />
            }
            { !canEdit
            && <FormattedMessage {...messages.sidebarToggle.showFilter} />
            }
          </ToggleShow>
        )}
        {this.state.visibleSidebar && (
          <EntityListSidebar
            activePanel={activePanel}
            canEdit={canEdit}
            onPanelSelect={onPanelSelect}
            hasEntities={entities && entities.size > 0}
            hasSelected={entityIdsSelected && entityIdsSelected.size > 0}
            panelGroups={panelGroups}
            onHideSidebar={this.onHideSidebar}
            setActiveOption={this.onSetActiveOption}
          />
        )}
        { formOptions
          && (
            <EntityListForm
              model={formModel}
              activeOptionId={activeOption.optionId}
              formOptions={formOptions}
              buttons={activePanel === EDIT_PANEL
                ? this.getFormButtons(activeOption)
                : null
              }
              onCancel={this.onHideForm}
              showCancelButton={(activePanel === FILTERS_PANEL)}
              onSelect={() => {
                if (activePanel === FILTERS_PANEL) {
                  this.onHideForm();
                  this.onHideSidebar();
                }
              }}
              onSubmit={activePanel === EDIT_PANEL
                ? (associations) => {
                // close and reset option panel
                  this.setState({ activeOption: null });
                  onUpdate(associations, activeOption);
                }
                : null
              }
            />
          )
        }
      </Styled>
    );
  }
}
EntityListHeader.propTypes = {
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  targettypes: PropTypes.instanceOf(Map),
  membertypes: PropTypes.instanceOf(Map),
  associationtypes: PropTypes.instanceOf(Map),
  actiontypesForTarget: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  entityIdsSelected: PropTypes.instanceOf(List),
  locationQuery: PropTypes.instanceOf(Map),
  canEdit: PropTypes.bool,
  hasUserRole: PropTypes.object,
  config: PropTypes.object,
  activePanel: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  onPanelSelect: PropTypes.func.isRequired,
  onCreateOption: PropTypes.func.isRequired,
  listUpdating: PropTypes.bool,
  theme: PropTypes.object,
};

EntityListHeader.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default withTheme(EntityListHeader);
