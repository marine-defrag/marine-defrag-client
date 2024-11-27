/*
 *
 * EntityListDownload
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl, FormattedMessage } from 'react-intl';
import { palette } from 'styled-theme';
import DebounceInput from 'react-debounce-input';
import { snakeCase } from 'lodash/string';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import CsvDownloader from 'react-csv-downloader';
import {
  Box,
  Text,
} from 'grommet';

import {
  ACTIONTYPE_ACTORTYPES,
  ACTIONTYPE_RESOURCETYPES,
  ACTIONTYPE_TARGETTYPES,
} from 'themes/config';

import { filterEntitiesByKeywords } from 'utils/entities';

import Content from 'components/Content';
import SupTitle from 'components/SupTitle';
import ButtonCancel from 'components/buttons/ButtonCancel';
import ButtonSubmit from 'components/buttons/ButtonSubmit';
import Checkbox from 'components/styled/Checkbox';

import appMessages from 'containers/App/messages';

import OptionsForActions from './OptionsForActions';
import OptionsForActors from './OptionsForActors';

import messages from './messages';
import {
  prepareDataForActions,
  prepareDataForActors,
  getAttributes,
  getDateSuffix,
  // getTaxonomies,
} from './utils';


const Footer = styled.div`
  width: 100%;
`;

// color: white;
const StyledButtonCancel = styled(ButtonCancel)``;

const Main = styled.div`
  padding: 0 0 10px;
  margin: 0 0 30px;
  @media (min-width: ${(props) => props.theme.breakpoints.medium}) {
    padding: 20px 24px;
    margin: 0 0 50px;
  }
`;

const Select = styled.div`
  width: 20px;
  text-align: center;
  padding-right: 6px;
`;

const TextInput = styled(DebounceInput)`
  background-color: ${palette('background', 0)};
  padding: 3px;
  flex: 1;
  font-size: 0.85em;
  width: 200px;
  border-radius: 2px;
  border: 1px solid;
  border-color: ${({ active, theme }) => active ? theme.global.colors.highlight : palette('light', 2)};
  &:focus {
    outline: 1px solid ${({ active, theme }) => active ? theme.global.colors.highlight : 'transparent'};
  }
`;

// const StyledInput = styled.input`
//   accent-color: ${({ theme }) => theme.global.colors.highlight};
// `;

const OptionLabel = styled((p) => <Text as="label" {...p} />)`
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
`;

export function EntityListDownload({
  typeId,
  config,
  fields,
  entities,
  taxonomies,
  connections,
  onClose,
  typeNames,
  intl,
  isAdmin,
  searchQuery,
}) {
  const [typeTitle, setTypeTitle] = useState('entities');
  const [csvFilename, setCSVFilename] = useState('csv');
  const [csvSuffix, setCSVSuffix] = useState(true);
  const [attributes, setAttributes] = useState({});
  const [taxonomyColumns, setTaxonomies] = useState({});
  // for actions
  const [actortypes, setActortypes] = useState({});
  const [actorsAsRows, setActorsAsRows] = useState(false);
  const [targettypes, setTargettypes] = useState({});

  const [resourcetypes, setResourcetypes] = useState({});
  // for actors
  const [actiontypes, setActiontypes] = useState({});
  const [actionsAsRows, setActionsAsRows] = useState(false);
  const [actiontypesAsTarget, setActiontypesAsTarget] = useState({});

  const [activeTextbox, setActiveTextbox] = useState(+false);
  // figure out export options
  const hasAttributes = !!config.attributes;
  const hasTaxonomies = !!config.taxonomies;
  // check action relationships
  let hasActors;
  let hasTargets;
  let hasResources;

  if (config.types === 'actiontypes') {
    hasActors = config.connections
      && config.connections.actors
      && ACTIONTYPE_ACTORTYPES[typeId]
      && ACTIONTYPE_ACTORTYPES[typeId].length > 0;

    hasTargets = config.connections
      && config.connections.targets
      && ACTIONTYPE_TARGETTYPES[typeId]
      && ACTIONTYPE_TARGETTYPES[typeId].length > 0;

    hasResources = config.connections
      && config.connections.resources
      && ACTIONTYPE_RESOURCETYPES[typeId]
      && ACTIONTYPE_RESOURCETYPES[typeId].length > 0;
  }
  // check actor relationships
  let hasActions;
  let hasActionsAsTarget;

  if (config.types === 'actortypes') {
    hasActions = config.connections
      && config.connections.actions
      && !!Object.keys(ACTIONTYPE_ACTORTYPES).find((actiontypeId) => {
        const actiontypeIds = ACTIONTYPE_ACTORTYPES[actiontypeId];
        return actiontypeIds.indexOf(typeId) > -1;
      });

    hasActionsAsTarget = config.connections
      && config.connections.targets
      && !!Object.keys(ACTIONTYPE_TARGETTYPES).find((actiontypeId) => {
        const actiontypeIds = ACTIONTYPE_TARGETTYPES[actiontypeId];
        return actiontypeIds.indexOf(typeId) > -1;
      });
  }

  // figure out options for each relationship type
  useEffect(() => {
    // set initial config values
    if (hasAttributes && fields) {
      setAttributes(
        getAttributes({
          typeId, // optional
          fieldAttributes: fields && fields.ATTRIBUTES,
          isAdmin,
          intl,
        })
      );
    }
    if (hasTaxonomies && taxonomies) {
      setTaxonomies(
        taxonomies.map((tax) => {
          const label = intl.formatMessage(appMessages.entities.taxonomies[tax.get('id')].plural);
          return ({
            id: tax.get('id'),
            label,
            active: false,
            column: snakeCase(label),
          });
        }).toJS()
      );
    }
    if (config.types === 'actiontypes') {
      // actors
      if (hasActors && typeNames.actortypes) {
        setActortypes(
          ACTIONTYPE_ACTORTYPES[typeId].reduce((memo, actortypeId) => {
            const label = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].pluralLong);
            return {
              ...memo,
              [actortypeId]: {
                id: actortypeId,
                label,
                active: false,
                column: `actors_${snakeCase(label)}`,
              },
            };
          }, {})
        );
      }
      // targets
      if (hasTargets && typeNames.actortypes) {
        setTargettypes(
          ACTIONTYPE_TARGETTYPES[typeId].reduce((memo, actortypeId) => {
            const label = intl.formatMessage(appMessages.entities[`actors_${actortypeId}`].pluralLong);
            return {
              ...memo,
              [actortypeId]: {
                id: actortypeId,
                label,
                active: false,
                column: `targets_${snakeCase(label)}`,
              },
            };
          }, {})
        );
      }
      // resources
      if (hasResources) {
        setResourcetypes(
          ACTIONTYPE_RESOURCETYPES[typeId].reduce((memo, resourcetypeId) => {
            const label = intl.formatMessage(appMessages.entities[`resources_${resourcetypeId}`].pluralLong);
            return {
              ...memo,
              [resourcetypeId]: {
                id: resourcetypeId,
                label,
                active: false,
                column: `resources_${snakeCase(label)}`,
              },
            };
          }, {})
        );
      }
    }
    if (config.types === 'actortypes') {
      // actions
      if (hasActions && typeNames.actiontypes) {
        const actiontypeIds = Object.keys(ACTIONTYPE_ACTORTYPES).filter(
          (actiontypeId) => ACTIONTYPE_ACTORTYPES[actiontypeId].indexOf(typeId) > -1
        );
        setActiontypes(
          actiontypeIds.reduce((memo, actiontypeId) => {
            const label = intl.formatMessage(appMessages.entities[`actions_${actiontypeId}`].pluralLong);
            return {
              ...memo,
              [actiontypeId]: {
                id: actiontypeId,
                label,
                active: false,
                column: `actions_${snakeCase(label)}`,
              },
            };
          }, {})
        );
      }
      // actions as target
      if (hasActionsAsTarget && typeNames.actiontypes) {
        const actiontypeIds = Object.keys(ACTIONTYPE_TARGETTYPES).filter(
          (actiontypeId) => ACTIONTYPE_TARGETTYPES[actiontypeId].indexOf(typeId) > -1
        );
        setActiontypesAsTarget(
          actiontypeIds.reduce((memo, actiontypeId) => {
            const label = intl.formatMessage(appMessages.entities[`actions_${actiontypeId}`].pluralLong);
            return {
              ...memo,
              [actiontypeId]: {
                id: actiontypeId,
                label,
                active: false,
                column: `actions-as-target_${snakeCase(label)}`,
              },
            };
          }, {})
        );
      }
    }
  }, [
    taxonomies,
    hasAttributes,
    hasTaxonomies,
    hasActors,
    hasTargets,
    hasResources,
    hasActions,
    hasActionsAsTarget,
  ]);
  // set initial csv file name
  useEffect(() => {
    let title = 'unspecified';
    if (config.types === 'actiontypes') {
      title = intl.formatMessage(appMessages.entities[`actions_${typeId}`].plural);
    }
    if (config.types === 'actortypes') {
      title = intl.formatMessage(appMessages.entities[`actors_${typeId}`].plural);
    }
    setTypeTitle(title);
    setCSVFilename(snakeCase(title));
  }, []);

  // check if should keep prefiltered search options
  const hasSearchQuery = !!searchQuery;
  // filter out list items according to keyword search or selection
  let searchedEntities = entities;
  if (hasSearchQuery) {
    const searchAttributes = (
      config.views
      && config.views.list
      && config.views.list.search
    ) || ['title'];

    searchedEntities = filterEntitiesByKeywords(
      searchedEntities,
      searchQuery,
      searchAttributes,
    );
  }

  const relationships = connections;

  // figure out columns
  let csvColumns = [{ id: 'id' }];
  if (hasAttributes) {
    csvColumns = Object.keys(attributes).reduce((memo, attKey) => {
      if (attributes[attKey].active) {
        let displayName = attributes[attKey].column;
        if (!displayName || attributes[attKey].column === '') {
          displayName = attKey;
        }
        return [
          ...memo,
          { id: attKey, displayName },
        ];
      }
      return memo;
    }, csvColumns);
  }
  if (hasTaxonomies) {
    csvColumns = Object.keys(taxonomyColumns).reduce((memo, taxId) => {
      if (taxonomyColumns[taxId].active) {
        let displayName = taxonomyColumns[taxId].column;
        if (!displayName || taxonomyColumns[taxId].column === '') {
          displayName = taxId;
        }
        return [
          ...memo,
          { id: `taxonomy_${taxId}`, displayName },
        ];
      }
      return memo;
    }, csvColumns);
  }
  let csvData;
  if (entities) {
    // for actions ///////////////////////////////////////////////////////////////
    if (config.types === 'actiontypes') {
      if (hasActors) {
        if (!actorsAsRows) {
          csvColumns = Object.keys(actortypes).reduce((memo, actortypeId) => {
            if (actortypes[actortypeId].active) {
              let displayName = actortypes[actortypeId].column;
              if (!displayName || actortypes[actortypeId].column === '') {
                displayName = actortypeId;
              }
              return [
                ...memo,
                { id: `actors_${actortypeId}`, displayName },
              ];
            }
            return memo;
          }, csvColumns);
        } else {
          csvColumns = [
            ...csvColumns,
            { id: 'actor_id', displayName: 'actor_id' },
            { id: 'actortype_id', displayName: 'actor_type' },
            { id: 'actor_code', displayName: 'actor_code' },
            { id: 'actor_title', displayName: 'actor_title' },
          ];
          if (isAdmin) {
            csvColumns = [
              ...csvColumns,
              { id: 'actor_draft', displayName: 'actor_draft' },
            ];
          }
        }
      }
      if (hasTargets) {
        csvColumns = Object.keys(targettypes).reduce((memo, actortypeId) => {
          if (targettypes[actortypeId].active) {
            let displayName = targettypes[actortypeId].column;
            if (!displayName || targettypes[actortypeId].column === '') {
              displayName = actortypeId;
            }
            return [
              ...memo,
              { id: `targets_${actortypeId}`, displayName },
            ];
          }
          return memo;
        }, csvColumns);
      }
      if (hasResources) {
        csvColumns = Object.keys(resourcetypes).reduce((memo, resourcetypeId) => {
          if (resourcetypes[resourcetypeId].active) {
            let displayName = resourcetypes[resourcetypeId].column;
            if (!displayName || resourcetypes[resourcetypeId].column === '') {
              displayName = resourcetypeId;
            }
            return [
              ...memo,
              { id: `resources_${resourcetypeId}`, displayName },
            ];
          }
          return memo;
        }, csvColumns);
      }
      csvData = prepareDataForActions({
        entities: searchedEntities,
        relationships,
        attributes,
        taxonomies,
        taxonomyColumns,
        typeNames,
        hasActors,
        actorsAsRows,
        actortypes,
        hasTargets,
        targettypes,
        hasResources,
        resourcetypes,
      });
    }
    // for actors ///////////////////////////////////////////////////////////////
    if (config.types === 'actortypes') {
      if (hasActions) {
        if (!actionsAsRows) {
          csvColumns = Object.keys(actiontypes).reduce((memo, actiontypeId) => {
            if (actiontypes[actiontypeId].active) {
              let displayName = actiontypes[actiontypeId].column;
              if (!displayName || actiontypes[actiontypeId].column === '') {
                displayName = actiontypeId;
              }
              return [
                ...memo,
                { id: `actions_${actiontypeId}`, displayName },
              ];
            }
            return memo;
          }, csvColumns);
        } else {
          csvColumns = [
            ...csvColumns,
            { id: 'action_id', displayName: 'action_id' },
            { id: 'actiontype_id', displayName: 'action_type' },
            { id: 'action_code', displayName: 'action_code' },
            { id: 'action_title', displayName: 'action_title' },
          ];
          if (isAdmin) {
            csvColumns = [
              ...csvColumns,
              { id: 'action_draft', displayName: 'action_draft' },
            ];
          }
        }
      }
      if (hasActionsAsTarget) {
        csvColumns = Object.keys(actiontypesAsTarget).reduce((memo, actiontypeId) => {
          if (actiontypesAsTarget[actiontypeId].active) {
            let displayName = actiontypesAsTarget[actiontypeId].column;
            if (!displayName || actiontypesAsTarget[actiontypeId].column === '') {
              displayName = actiontypeId;
            }
            return [
              ...memo,
              { id: `targeted-by-actions_${actiontypeId}`, displayName },
            ];
          }
          return memo;
        }, csvColumns);
      }

      csvData = prepareDataForActors({
        entities: searchedEntities,
        relationships,
        attributes,
        taxonomies,
        taxonomyColumns,
        typeNames,
        hasActions,
        actionsAsRows,
        actiontypes,
        hasActionsAsTarget,
        actiontypesAsTarget,
      });
    }
  }
  const csvDateSuffix = `_${getDateSuffix()}`;
  return (
    <Content inModal>
      <Main>
        <Box pad={{ vertical: 'small' }}>
          <SupTitle title={intl.formatMessage(messages.downloadCsvTitle)} />
        </Box>
        <Box margin={{ bottom: 'large' }} gap="small">
          <Text size="xxlarge">
            <strong>
              <FormattedMessage
                {...messages.exportAsTitle}
                values={{ typeTitle }}
              />
            </strong>
          </Text>
          <Text>
            <FormattedMessage {...messages.exportDescription} />
          </Text>
        </Box>
        {config.types === 'actiontypes' && (
          <OptionsForActions
            typeTitle={typeTitle}
            hasActors={hasActors}
            hasTargets={hasTargets}
            hasResources={hasResources}
            hasAttributes={hasAttributes}
            hasTaxonomies={hasTaxonomies}
            actorsAsRows={actorsAsRows}
            setActorsAsRows={setActorsAsRows}
            attributes={attributes}
            setAttributes={setAttributes}
            taxonomyColumns={taxonomyColumns}
            setTaxonomies={setTaxonomies}
            actortypes={actortypes}
            setActortypes={setActortypes}
            targettypes={targettypes}
            setTargettypes={setTargettypes}
            resourcetypes={resourcetypes}
            setResourcetypes={setResourcetypes}
          />
        )}
        {config.types === 'actortypes' && (
          <OptionsForActors
            typeTitle={typeTitle}
            hasActions={hasActions}
            actionsAsRows={actionsAsRows}
            setActionsAsRows={setActionsAsRows}
            actiontypes={actiontypes}
            setActiontypes={setActiontypes}
            hasActionsAsTarget={hasActionsAsTarget}
            actiontypesAsTarget={actiontypesAsTarget}
            setActiontypesAsTarget={setActiontypesAsTarget}
            hasAttributes={hasAttributes}
            attributes={attributes}
            setAttributes={setAttributes}
            hasTaxonomies={hasTaxonomies}
            setTaxonomies={setTaxonomies}
            taxonomyColumns={taxonomyColumns}
          />
        )}
        <Box direction="row" gap="medium" align="center" margin={{ top: 'xlarge' }}>
          <Box direction="row" gap="small" align="center" fill={false}>
            <OptionLabel htmlFor="input-filename">
              <FormattedMessage {...messages.filenameLabel} />
            </OptionLabel>
            <Box direction="row" align="center">
              <TextInput
                style={{ maxWidth: '250px', textAlign: 'right' }}
                minLength={1}
                debounceTimeout={500}
                value={csvFilename}
                active={activeTextbox}
                onFocus={() => setActiveTextbox(+true)}
                onBlur={() => setActiveTextbox(+false)}
                onChange={(evt) => setCSVFilename(evt.target.value)}
              />
              <Text>
                {`${csvSuffix ? csvDateSuffix : ''}.csv`}
              </Text>
            </Box>
          </Box>
          <Box direction="row" align="center" fill={false}>
            <Box direction="row" align="center">
              <Select>
                <Checkbox
                  id="check-timestamp"
                  checked={csvSuffix}
                  onChange={(evt) => setCSVSuffix(evt.target.checked)}
                />
              </Select>
            </Box>
            <Text size="small" as="label" htmlFor="check-timestamp">
              <FormattedMessage {...messages.includeTimestamp} />
            </Text>
          </Box>
        </Box>
      </Main>
      <Footer>
        <Box direction="row" justify="end">
          <StyledButtonCancel type="button" onClick={() => onClose()}>
            <FormattedMessage {...appMessages.buttons.cancel} />
          </StyledButtonCancel>
          <CsvDownloader
            role={undefined}
            tabIndex={undefined}
            datas={csvData}
            columns={csvColumns}
            filename={`${csvFilename}${csvSuffix ? csvDateSuffix : ''}`}
            bom={false}
          >
            <ButtonSubmit
              type="button"
              onClick={(evt) => {
                evt.preventDefault();
                onClose();
              }}
            >
              <FormattedMessage {...messages.buttonDownload} />
            </ButtonSubmit>
          </CsvDownloader>
        </Box>
      </Footer>
    </Content>
  );
}

EntityListDownload.propTypes = {
  fields: PropTypes.object,
  config: PropTypes.object,
  typeNames: PropTypes.object,
  typeId: PropTypes.string,
  entities: PropTypes.instanceOf(List),
  taxonomies: PropTypes.instanceOf(Map),
  connections: PropTypes.instanceOf(Map),
  onClose: PropTypes.func,
  isAdmin: PropTypes.bool,
  searchQuery: PropTypes.string,
  entityIdsSelected: PropTypes.object,
  intl: intlShape,
};

export default injectIntl(EntityListDownload);
