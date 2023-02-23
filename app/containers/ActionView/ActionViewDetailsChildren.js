/*
 *
 * ActionViewDetailsChildren
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';

import { selectActionConnections } from 'containers/App/selectors';

import { getActionConnectionField } from 'utils/fields';


import { ACTIONTYPES_CONFIG } from 'themes/config';

import FieldGroup from 'components/fields/FieldGroup';

const getActiontypeColumns = (typeid) => {
  let columns = [{
    id: 'main',
    type: 'main',
    sort: 'title',
    attributes: ['title'],
  }];
  if (
    ACTIONTYPES_CONFIG[parseInt(typeid, 10)]
    && ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns
  ) {
    columns = ACTIONTYPES_CONFIG[parseInt(typeid, 10)].columns.filter(
      (col) => {
        if (typeof col.showOnSingle !== 'undefined') {
          return col.showOnSingle;
        }
        return true;
      }
    );
  }
  return columns;
};

export function ActionViewDetailsChildren({
  taxonomies,
  childrenByType,
  onEntityClick,
  actionConnections,
}) {
  return (
    <FieldGroup
      group={{
        fields: childrenByType.reduce(
          (memo, children, typeid) => memo.concat(
            getActionConnectionField({
              actions: children,
              connections: actionConnections,
              taxonomies,
              onEntityClick,
              typeid,
              columns: getActiontypeColumns(typeid),
            })
          ),
          [],
        ),
      }}
    />
  );
}

ActionViewDetailsChildren.propTypes = {
  onEntityClick: PropTypes.func,
  taxonomies: PropTypes.instanceOf(Map),
  childrenByType: PropTypes.instanceOf(Map),
  actionConnections: PropTypes.instanceOf(Map),
};

const mapStateToProps = (state) => ({
  actionConnections: selectActionConnections(state),
});

export default connect(mapStateToProps, null)(ActionViewDetailsChildren);
