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
import styled from 'styled-components';
import CellBodyMain from './CellBodyMain';
import CellBodyPlain from './CellBodyPlain';
import CellBodyActors from './CellBodyActors';
import CellHeaderMain from './CellHeaderMain';
import CellHeaderPlain from './CellHeaderPlain';

const HeaderTableCell = styled((p) => <TableCell {...p} />)`
  white-space: nowrap;
`;

export function EntitiesTable({
  entities,
  canEdit,
  columns,
  headerColumns,
  onEntityClick,
}) {
  return (
    <Box fill="horizontal">
      <Table>
        {headerColumns && (
          <TableHeader>
            <TableRow>
              {headerColumns.map(
                (col, i) => (
                  <HeaderTableCell key={i} scope="col" border="bottom">
                    {col.type === 'main' && (
                      <CellHeaderMain
                        column={col}
                        canEdit={canEdit}
                      />
                    )}
                    {col.type === 'amount' && (
                      <CellHeaderPlain
                        column={col}
                        align="end"
                      />
                    )}
                    {col.type === 'targets' && (
                      <CellHeaderPlain
                        column={col}
                        align="end"
                      />
                    )}
                  </HeaderTableCell>
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
                  {col.type === 'main' && (
                    <CellBodyMain
                      entity={entity[col.type]}
                      canEdit={canEdit}
                    />
                  )}
                  {col.type === 'amount' && (
                    <CellBodyPlain
                      entity={entity[col.type]}
                      align="end"
                    />
                  )}
                  {col.type === 'targets' && (
                    <CellBodyActors
                      entity={entity[col.type]}
                      align="end"
                      onEntityClick={onEntityClick}
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
  onEntityClick: PropTypes.func,
};

export default EntitiesTable;
