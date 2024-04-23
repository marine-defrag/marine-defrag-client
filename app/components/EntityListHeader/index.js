/*
 *
 * EntityListHeader
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import styled, { withTheme } from 'styled-components';
import { Map, List } from 'immutable';
import { palette } from 'styled-theme';
import {
  Box, Text, Button, ResponsiveContext,
} from 'grommet';

import { isEqual } from 'lodash/lang';
import { truncateText } from 'utils/string';
import { isMinSize } from 'utils/responsive';
import { setFocusById, setFocusByRef } from 'utils/accessability';

import { TEXT_TRUNCATE } from 'themes/config';
import { FILTER_FORM_MODEL, EDIT_FORM_MODEL } from 'containers/EntityListForm/constants';

import ButtonFlatIconOnly from 'components/buttons/ButtonFlatIconOnly';
import Bookmarker from 'containers/Bookmarker';

import EntityListForm from 'containers/EntityListForm';
import appMessages from 'containers/App/messages';
import PrintHide from 'components/styled/PrintHide';
import TagList from 'components/TagList';
import Icon from 'components/Icon';
import ButtonOld from 'components/buttons/Button';

import EntityListSidebar from './EntityListSidebar';
import ButtonOptionsLabelWithIcon from './ButtonOptionsLabelWithIcon';

import { makeFilterGroups } from './filterGroupsFactory';
import { makeEditGroups } from './editGroupsFactory';
import {
  makeActiveFilterOptions,
  makeAnyWithoutFilterOptions,
} from './filterOptionsFactory';
import { makeActiveEditOptions } from './editOptionsFactory';

import messages from './messages';

const Styled = styled(PrintHide)`
  display: ${({ isPrint }) => isPrint ? 'none' : 'block'};
`;

const TheHeader = styled((p) => <Box direction="row" {...p} />)`
  height: ${({ theme, headerStyle }) => {
    if (headerStyle === 'simple') {
      return 40;
    }
    return theme.sizes.headerList.banner.height;
  }}px;
  padding: 0 3px;
  background-color: ${palette('primary', 3)};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.2);
  position: relative;
  z-index: 96;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 0 15px;
  }
`;
const HeaderSection = styled((p) => <Box direction="row" {...p} />)`
  position: relative;
  border-right: 1px solid ${({ noBorder }) => noBorder ? 'transparent' : palette('light', 4)};
  height: 100%;
  padding: 2px 5px;
  flex: ${({ grow }) => grow ? '1' : '0'} ${({ shrink = '1' }) => shrink ? '1' : '0'} auto;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 2px 10px;
  }
`;
const HeaderSectionType = styled((p) => <Box direction="column" {...p} />)`
  position: relative;
  border-right: 1px solid ${({ noBorder }) => noBorder ? 'transparent' : palette('light', 4)};
  width: 240px;
  padding: 18px 5px 2px;
  height: 100%;
`;
const SelectType = styled(ButtonOld)`
  display: none;
  text-align: left;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    display: block;
    padding-left: 2px;
    padding-right: 2px;
    max-width: 100%;
  }
  &:focus {
    outline: none;
  }
  &:focus-visible {
    outline: 2px solid ${palette('primary', 0)};
    border-radius: 3px;
  }
`;
const EntityListSearch = styled((p) => <Box justify="end" direction="row" gap="medium" {...p} />)``;

const ButtonOptions = styled((p) => <Button plain {...p} />)`
  color: ${palette('buttonFlat', 1)};

  &:focus {
    box-shadow: none;
  }
  &:hover, &:focus-visible {
    color: ${palette('buttonFlat', 0)};
    svg {
      stroke: ${palette('buttonFlat', 0)};
    }
    span {
      color: ${palette('buttonFlat', 0)};
    }
  }
  &:focus-visible {
    outline-offset: 4px;
    outline: 2px solid ${palette('buttonFlat', 0)};
    border-radius: 2px;
  }
`;

const Label = styled.div`
  font-size: ${(props) => props.theme.sizes.text.smallMobile};
  color: ${palette('text', 1)};
  padding-left: 2px;
  padding-right: 2px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.smaller};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.smaller};
  }
`;
const LinkTitle = styled.div`
  font-size: ${(props) => props.theme.sizes.text.small};
  font-weight: bold;
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : 'inherit'};
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    font-size: ${(props) => props.theme.sizes.text.default};
  }
  @media print {
    font-size: ${(props) => props.theme.sizes.print.default};
  }
`;

const TypeOptions = styled.div`
  display: none;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    position: absolute;
    top: 100%;
    left: 0;
    display: block;
  }
  @media (min-width: ${(props) => props.theme.breakpoints.large}) {
    min-width: 240px;
  }
  background: white;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.2);
  margin-top: 3px;
  padding: 5px 0;
`;
const TypeOption = styled(ButtonOld)`
  display: block;
  width: 100%;
  text-align: left;
  &:hover {
    color:${palette('headerNavMainItemHover', 0)};
  }
  &:focus-visible {
    box-shadow: none;
    color: ${({ theme }) => theme.global.colors.highlight};
    outline: 2px solid ${({ theme }) => theme.global.colors.highlight};
    border-radius: 1px;
  }
  color: ${(props) => props.active ? palette('headerNavMainItem', 1) : 'inherit'};
`;

const STATE_INITIAL = {
  activeOption: null,
  showTypes: false,
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
    this.typeWrapperRef = React.createRef();
    this.typeButtonRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.setState(STATE_INITIAL);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    if (this.state.showTypes && this.typeWrapperRef && this.typeWrapperRef.current && this.typeWrapperRef.current.lastElementChild) {
      this.typeWrapperRef.current.lastElementChild.addEventListener('keydown', this.onKeyboardHideTypes);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.showFilters !== nextProps.showFilters
      || this.props.showEditOptions !== nextProps.showEditOptions
    ) {
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
      || this.props.showFilters !== nextProps.showFilters
      || this.props.showEditOptions !== nextProps.showEditOptions
      || this.props.taxonomies !== nextProps.taxonomies
      || this.props.connections !== nextProps.connections
      || this.props.typeOptions !== nextProps.typeOptions
      || this.props.isManager !== nextProps.isManager
      || !isEqual(this.state, nextState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('mousedown', this.handleClickOutside);
    if (this.typeWrapperRef && this.typeWrapperRef.current && this.typeWrapperRef.current.lastElementChild) {
      this.typeWrapperRef.current.lastElementChild.removeEventListener('keydown', this.onKeyboardHideTypes);
    }
  }

  handleClickOutside = (evt) => {
    const wrapperContains = this.typeWrapperRef
      && this.typeWrapperRef.current
      && this.typeWrapperRef.current.contains(evt.target);
    const buttonContains = this.typeButtonRef
      && this.typeButtonRef.current
      && this.typeButtonRef.current.contains(evt.target);
    if (!wrapperContains && !buttonContains) {
      this.setState({ showTypes: false });
    }
  }

  onSetActiveOption = (option) => {
    this.setState({ activeOption: option });
  };

  onHideForm = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    if (this.state.activeOption) {
      setFocusById(`side-bar-option-${this.state.activeOption.optionId}`);
    }
    this.setState({ activeOption: null });
  };

  onShowTypes = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showTypes: true });
  };

  onHideTypes = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    this.setState({ showTypes: false });
  };

  onKeyboardHideTypes = (evt) => {
    if (evt !== undefined && evt.preventDefault) evt.preventDefault();
    setFocusByRef(this.typeButtonRef);
    this.setState({ showTypes: false });
  };

  getFormButtons = (activeOption, intl) => {
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
      entities,
      locationQuery,
      taxonomies,
      connectedTaxonomies,
      connections,
      entityIdsSelected,
      actortypes,
      actiontypes,
      resourcetypes,
      targettypes,
      actiontypesForTarget,
      membertypes,
      associationtypes,
      currentFilters,
      onShowFilters,
      onHideFilters,
      showFilters,
      showEditOptions,
      onHideEditOptions,
      onShowEditOptions,
      canEdit,
      onSelectType,
      typeOptions,
      dataReady,
      typeId,
      isManager,
      onUpdateQuery,
      includeMembers,
      onSetFilterMemberOption,
      headerActions,
      isPrintView,
      headerStyle,
      intl,
    } = this.props;

    const { activeOption } = this.state;
    const hasSelected = dataReady && canEdit && entityIdsSelected && entityIdsSelected.size > 0;
    const entitiesSelected = hasSelected
      && entities.filter((entity) => entityIdsSelected.includes(entity.get('id')));
    const formModel = showFilters ? FILTER_FORM_MODEL : EDIT_FORM_MODEL;

    let panelGroups = null;

    let formOptions = null;
    let currentTypeOption = null;
    if (headerStyle !== 'simple') {
      if (dataReady && showFilters) {
        panelGroups = makeFilterGroups({
          config,
          taxonomies,
          connectedTaxonomies,
          hasUserRole,
          actortypes,
          resourcetypes,
          actiontypes,
          targettypes,
          actiontypesForTarget,
          membertypes,
          associationtypes,
          activeFilterOption: activeOption,
          currentFilters,
          typeId,
          intl,
          locationQuery,
          messages: {
            attributes: intl.formatMessage(messages.filterGroupLabel.attributes),
            taxonomyGroup: intl.formatMessage(messages.filterGroupLabel.taxonomies),
            connections: (type) => getFilterConnectionsMsg(intl, type),
            // connectedTaxonomies: intl.formatMessage(messages.filterGroupLabel.connectedTaxonomies),
            taxonomies: (taxId) => intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
          },
          includeMembers,
        });
        panelGroups = Object.keys(panelGroups).reduce(
          (memo, groupId) => {
            const group = panelGroups[groupId];
            if (group.includeAnyWithout && group.options && group.options.length > 0) {
              const allAnyOptions = makeAnyWithoutFilterOptions({
                config,
                locationQuery,
                activeFilterOption: {
                  group: groupId,
                },
                contextIntl: intl,
                messages: {
                  titlePrefix: intl.formatMessage(messages.filterFormTitlePrefix),
                  without: intl.formatMessage(messages.filterFormWithoutPrefix),
                  any: intl.formatMessage(messages.filterFormAnyPrefix),
                  connections: (type) => getFilterConnectionsMsg(intl, type),
                },
              });
              return {
                ...memo,
                [groupId]: {
                  ...group,
                  optionsGeneral: allAnyOptions,
                },
              };
            }
            return {
              ...memo,
              [groupId]: group,
            };
          },
          {},
        );
        if (activeOption) {
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
            typeId,
            isManager,
            messages: {
              titlePrefix: intl.formatMessage(messages.filterFormTitlePrefix),
              without: intl.formatMessage(messages.filterFormWithoutPrefix),
              any: intl.formatMessage(messages.filterFormAnyPrefix),
            },
            includeMembers,
          });
        }
      } else if (dataReady && showEditOptions && hasSelected) {
        panelGroups = makeEditGroups({
          config,
          taxonomies,
          connectedTaxonomies,
          activeEditOption: activeOption,
          hasUserRole,
          actortypes,
          actiontypes,
          targettypes,
          resourcetypes,
          actiontypesForTarget,
          membertypes,
          associationtypes,
          typeId,
          messages: {
            attributes: intl.formatMessage(messages.editGroupLabel.attributes),
            taxonomyGroup: intl.formatMessage(messages.editGroupLabel.taxonomies),
            connections: (type) => getEditConnectionsMsg(intl, type),
            taxonomies: (taxId) => intl.formatMessage(appMessages.entities.taxonomies[taxId].plural),
          },
          // selectedActortypeIds: entitiesSelected.groupBy((e) => e.getIn(['attributes', 'actortype_id'])).keySeq(),
          // selectedActiontypeIds: entitiesSelected.groupBy((e) => e.getIn(['attributes', 'measuretype_id'])).keySeq(),
        });
        if (activeOption && connections) {
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
      const hasTypeOptions = typeOptions && typeOptions.length > 0;
      currentTypeOption = hasTypeOptions && typeOptions.find((option) => option.active);
    }

    const managerActions = headerActions && headerActions.filter(
      (action) => action.isManager
    );
    const normalActions = headerActions && headerActions.filter(
      (action) => !action.isManager
    );
    return (
      <ResponsiveContext.Consumer>
        {(size) => (
          <Styled isPrint={isPrintView}>
            <TheHeader align="center" headerStyle={headerStyle}>
              {config.types && typeOptions && (
                <HeaderSection noBorder>
                  <ButtonFlatIconOnly onClick={() => onSelectType()}>
                    <Icon name="arrowLeft" size="2em" />
                  </ButtonFlatIconOnly>
                </HeaderSection>
              )}
              {currentTypeOption && !isMinSize(size, 'large') && (
                <Text>
                  {truncateText(
                    currentTypeOption.label,
                    TEXT_TRUNCATE.TYPE_SELECT,
                    false,
                  )}
                </Text>
              )}
              {config.types && typeOptions && isMinSize(size, 'large') && (
                <HeaderSectionType justify="start">
                  {config.types && (
                    <Label>
                      <FormattedMessage
                        {...messages.selectType}
                        values={{
                          types: intl.formatMessage(appMessages[config.types].single),
                        }}
                      />
                    </Label>
                  )}
                  {currentTypeOption && (
                    <SelectType
                      as="button"
                      ref={this.typeButtonRef}
                      onClick={(evt) => this.state.showTypes
                        ? this.onHideTypes(evt)
                        : this.onShowTypes(evt)
                      }
                    >
                      <LinkTitle active>
                        {truncateText(
                          currentTypeOption.label,
                          TEXT_TRUNCATE.TYPE_SELECT,
                          false,
                        )}
                        {!this.state.showTypes && (
                          <Icon name="dropdownOpen" text textRight size="1em" />
                        )}
                        {this.state.showTypes && (
                          <Icon name="dropdownClose" text textRight size="1em" />
                        )}
                      </LinkTitle>
                    </SelectType>
                  )}
                  {this.state.showTypes && typeOptions && (
                    <PrintHide>
                      <TypeOptions ref={this.typeWrapperRef}>
                        {typeOptions.map((option) => (
                          <TypeOption
                            key={option.value}
                            active={option.active}
                            onClick={(event) => {
                              this.onHideTypes();
                              onSelectType(option.value);
                              if (event.pointerType !== 'touch') setFocusByRef(this.typeButtonRef);
                            }}
                          >
                            {option.label}
                          </TypeOption>
                        ))}
                      </TypeOptions>
                    </PrintHide>
                  )}
                </HeaderSectionType>
              )}
              <HeaderSection
                grow
                align="center"
                gap="medium"
                justify="end"
                noBorder={headerStyle === 'simple'}
              >
                {dataReady && currentFilters && isMinSize(size, 'large') && (
                  <EntityListSearch>
                    <TagList
                      filters={currentFilters}
                    />
                  </EntityListSearch>
                )}
              </HeaderSection>
              {dataReady && onShowFilters && isMinSize(size, 'large') && (
                <HeaderSection align="center">
                  <ButtonOptions
                    id="show-filters-button"
                    onClick={onShowFilters}
                    label={(
                      <Box direction="row" gap="small" align="center">
                        <Box>{<Icon name="filter" text />}</Box>
                        <Text>{intl.formatMessage(messages.listOptions.showFilter)}</Text>
                      </Box>
                    )}
                  />
                </HeaderSection>
              )}
              {normalActions && (
                <HeaderSection noBorder={!isManager}>
                  <Box fill="vertical" direction="row" align="center" pad={{ vertical: 'xsmall' }}>
                    {normalActions.map(
                      (action, i) => {
                        if (action.type === 'bookmarker') {
                          return (
                            <Box key={i}>
                              <Bookmarker viewTitle={action.title} type={action.entityType} />
                            </Box>
                          );
                        }
                        if (action.type === 'icon') {
                          return (
                            <Box key={i}>
                              <ButtonFlatIconOnly
                                onClick={action.onClick && (() => action.onClick())}
                                title={action.title}
                                subtle
                              >
                                <Icon name={action.icon} />
                              </ButtonFlatIconOnly>
                            </Box>
                          );
                        }
                        return null;
                      }
                    )}
                  </Box>
                </HeaderSection>
              )}
              {isManager && isMinSize(size, 'large') && (
                <HeaderSection noBorder>
                  <Box
                    fill="vertical"
                    justify={(
                      (canEdit && managerActions && managerActions.length > 0)
                      || (managerActions && managerActions.length > 1)
                    ) ? 'between' : 'center'}
                    pad={{ top: 'xsmall', bottom: 'xsmall' }}
                  >
                    {canEdit && (
                      <ButtonOptions
                        onClick={onShowEditOptions}
                        label={(
                          <ButtonOptionsLabelWithIcon
                            icon="edit"
                            title={intl.formatMessage(messages.listOptions.showEditOptions)}
                          />
                        )}
                      />
                    )}
                    {managerActions && managerActions.map(
                      (action, i) => {
                        if (action.icon === 'add' || action.icon === 'import') {
                          return (
                            <ButtonOptions
                              key={i}
                              onClick={action.onClick}
                              label={(
                                <ButtonOptionsLabelWithIcon icon={action.icon} title={action.title} />
                              )}
                            />
                          );
                        }
                        return (
                          <ButtonOptions
                            key={i}
                            onClick={action.onClick}
                            label={(
                              <Box direction="row" gap="small">
                                <Text color="dark-3" size="small">{action.title}</Text>
                              </Box>
                            )}
                          />
                        );
                      }
                    )}
                  </Box>
                </HeaderSection>
              )}
            </TheHeader>
            {headerStyle !== 'simple' && showFilters && (
              <EntityListSidebar
                hasEntities={entities && entities.size > 0}
                panelGroups={panelGroups}
                onHideSidebar={onHideFilters}
                onHideOptions={this.onHideForm}
                setActiveOption={this.onSetActiveOption}
                onUpdateQuery={(args) => {
                  this.onHideForm();
                  onUpdateQuery(args);
                }}
                memberOption={config.hasMemberOption
                  ? {
                    key: 'filter-member-option',
                    active: !!includeMembers,
                    label: 'Include members when filtering by region, class or intergovernmental organisation',
                    onClick: () => {
                      this.onHideForm();
                      onSetFilterMemberOption(!includeMembers);
                    },
                  }
                  : null
                }
                formOptions={formOptions && (
                  <EntityListForm
                    model={formModel}
                    activeOptionId={`${activeOption.group}-${activeOption.optionId}`}
                    formOptions={formOptions}
                    buttons={showEditOptions
                      ? this.getFormButtons(activeOption, intl)
                      : null
                    }
                    onCancel={this.onHideForm}
                    showCancelButton={showFilters}
                    onSelect={() => {
                      if (showFilters) {
                        this.onHideForm();
                        // onHideFilters();
                      }
                    }}
                    onSubmit={showEditOptions
                      ? (associations) => {
                        // close and reset option panel
                        this.setState({ activeOption: null });
                        onUpdate(associations, activeOption);
                      }
                      : null
                    }
                  />
                )}
              />
            )}
            {headerStyle !== 'simple' && showEditOptions && (
              <EntityListSidebar
                isEditPanel
                hasEntities={entities && entities.size > 0}
                hasSelected={hasSelected}
                panelGroups={panelGroups}
                onHideSidebar={onHideEditOptions}
                setActiveOption={this.onSetActiveOption}
                formOptions={formOptions && (
                  <EntityListForm
                    model={formModel}
                    activeOptionId={`${activeOption.group}-${activeOption.optionId}`}
                    formOptions={formOptions}
                    buttons={showEditOptions
                      ? this.getFormButtons(activeOption, intl)
                      : null
                    }
                    onCancel={this.onHideForm}
                    showCancelButton={showFilters}
                    onSelect={() => {
                      if (showFilters) {
                        this.onHideForm();
                        // onHideFilters();
                      }
                    }}
                    onSubmit={showEditOptions
                      ? (associations) => {
                        // close and reset option panel
                        this.setState({ activeOption: null });
                        onUpdate(associations, activeOption);
                      }
                      : null
                    }
                  />
                )}
              />
            )}
          </Styled>
        )}
      </ResponsiveContext.Consumer>
    );
  }
}
EntityListHeader.propTypes = {
  entities: PropTypes.instanceOf(List),
  entityIdsSelected: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  actortypes: PropTypes.instanceOf(Map),
  resourcetypes: PropTypes.instanceOf(Map),
  actiontypes: PropTypes.instanceOf(Map),
  targettypes: PropTypes.instanceOf(Map),
  membertypes: PropTypes.instanceOf(Map),
  associationtypes: PropTypes.instanceOf(Map),
  actiontypesForTarget: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  connectedTaxonomies: PropTypes.instanceOf(Map),
  locationQuery: PropTypes.instanceOf(Map),
  hasUserRole: PropTypes.object,
  config: PropTypes.object,
  onUpdate: PropTypes.func,
  onCreateOption: PropTypes.func,
  listUpdating: PropTypes.bool,
  theme: PropTypes.object,
  currentFilters: PropTypes.array,
  onUpdateQuery: PropTypes.func,
  onShowFilters: PropTypes.func,
  onHideFilters: PropTypes.func,
  showFilters: PropTypes.bool,
  showEditOptions: PropTypes.bool,
  onHideEditOptions: PropTypes.func,
  onShowEditOptions: PropTypes.func,
  canEdit: PropTypes.bool,
  dataReady: PropTypes.bool,
  isManager: PropTypes.bool,
  includeMembers: PropTypes.bool,
  isPrintView: PropTypes.bool,
  typeOptions: PropTypes.array,
  onSelectType: PropTypes.func,
  onSetFilterMemberOption: PropTypes.func,
  typeId: PropTypes.string,
  headerActions: PropTypes.array,
  headerStyle: PropTypes.string,
  intl: intlShape.isRequired,
};

export default withTheme(injectIntl(EntityListHeader));
