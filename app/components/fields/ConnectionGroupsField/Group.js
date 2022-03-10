import React from 'react';
import Link from 'containers/Link';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import { ROUTES } from 'themes/config';

import EntityListTable from 'containers/EntityListTable';

// import EntityListItemsWrap from 'components/fields/EntityListItemsWrap';
import EmptyHint from 'components/fields/EmptyHint';
import { getCategoryTitle } from 'utils/entities';

const GroupHeaderLink = styled(Link)`
  color: ${palette('link', 2)};
  &:hover {
    color: ${palette('linkHover', 2)};
  }
`;

const GroupHeader = styled.h6`
  font-weight: normal;
  margin-top: 5px;
  margin-bottom: 5px;
  @media (min-width: ${(props) => props.theme && props.theme.breakpoints ? props.theme.breakpoints.small : '769px'}) {
    margin-top: 40px;
    margin-bottom: 10px;
  }
`;


class Group extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { field, group } = this.props;
    const size = group.get(field.entityPath) ? group.get(field.entityPath).size : 0;

    return (
      <div>
        <GroupHeaderLink to={`${ROUTES.CATEGORY}/${group.get('id')}`}>
          <GroupHeader>
            {getCategoryTitle(group)}
          </GroupHeader>
        </GroupHeaderLink>
        {size > 0 && (
          <EntityListTable
            config={{ connections: { options: field.connectionOptions } }}
            entities={group.get(field.entityPath).toList()}
            taxonomies={field.taxonomies}
            connections={field.connections}
            onEntityClick={field.onEntityClick}
            entityPath={field.entityPath}
            columns={[{
              type: 'main',
              sort: 'title',
              attributes: ['code', 'title'],
            }]}
            moreLess
            inSingleView
          />
        )}
        {size === 0 && (
          <EmptyHint>
            <FormattedMessage {...field.showEmpty} />
          </EmptyHint>
        )}
      </div>
    );
  }
}

Group.propTypes = {
  field: PropTypes.object.isRequired,
  group: PropTypes.object.isRequired,
};
Group.contextTypes = {
  intl: PropTypes.object.isRequired,
};

export default Group;
