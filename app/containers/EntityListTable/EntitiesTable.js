import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  Box,
} from 'grommet';
import CellBodyMain from './CellBodyMain';
import CellHeaderMain from './CellHeaderMain';

export function EntitiesTable({
  entities,
  canEdit,
  columns,
  headerColumns,
}) {
  return (
    <Box fill="horizontal">
      <Table>
        {headerColumns && (
          <TableHeader>
            <TableRow>
              {headerColumns.map(
                (col, i) => (
                  <TableCell key={i} scope="col" border="bottom">
                    {col.type !== 'main' && (
                      <span style={{ whiteSpace: 'nowrap' }}>{col.type}</span>
                    )}
                    {col.type === 'main' && (
                      <CellHeaderMain
                        column={col}
                        canEdit={canEdit}
                      />
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {entities.length > 0 && entities.map((entity, key) => (
            <TableRow key={key}>
              {columns.map((col, i) => (
                <TableCell
                  key={i}
                  scope="row"
                  border={{
                    color: 'light-5',
                    side: 'bottom',
                  }}
                >
                  {col.type !== 'main' && (
                    <span style={{ whiteSpace: 'nowrap' }}>{col.type}</span>
                  )}
                  {col.type === 'main' && (
                    <CellBodyMain
                      column={col}
                      entity={entity[col.type]}
                      canEdit={canEdit}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

EntitiesTable.propTypes = {
  entities: PropTypes.array.isRequired,
  columns: PropTypes.array,
  headerColumns: PropTypes.array,
  canEdit: PropTypes.bool,
};

export default EntitiesTable;
