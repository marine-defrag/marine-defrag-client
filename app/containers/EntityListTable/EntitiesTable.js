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
import CellBodyCategories from './CellBodyCategories';
import CellBodyHasResource from './CellBodyHasResource';
import CellBodyBarChart from './CellBodyBarChart';
import CellHeaderMain from './CellHeaderMain';
import CellHeaderPlain from './CellHeaderPlain';

const HeaderTableCell = styled((p) => <TableCell {...p} />)``;
const BodyTableCell = styled((p) => <TableCell {...p} />)`
  padding: 6px 0;
`;

export function EntitiesTable({
  entities,
  canEdit,
  columns,
  headerColumns,
  onEntityClick,
  columnMaxValues,
}) {
  return (
    <Box fill="horizontal">
      <Table>
        {headerColumns && (
          <TableHeader>
            <TableRow>
              {headerColumns.map(
                (col, i) => (
                  <HeaderTableCell
                    key={i}
                    scope="col"
                    border="bottom"
                    col={col}
                  >
                    {col.type === 'main' && (
                      <CellHeaderMain
                        column={col}
                        canEdit={canEdit}
                      />
                    )}
                    {col.type === 'actors' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
                      />
                    )}
                    {col.type === 'targets' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
                      />
                    )}
                    {col.type === 'amount' && (
                      <CellHeaderPlain
                        column={col}
                        align="end"
                      />
                    )}
                    {col.type === 'date' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
                      />
                    )}
                    {col.type === 'taxonomy' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
                      />
                    )}
                    {col.type === 'hasResources' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
                      />
                    )}
                    {col.type === 'actorActions' && (
                      <CellHeaderPlain
                        column={col}
                        align="start"
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
                <BodyTableCell
                  key={i}
                  scope="row"
                  border={{
                    color: 'light-5',
                    side: 'bottom',
                  }}
                  col={col}
                >
                  {col.type === 'main' && (
                    <CellBodyMain
                      entity={entity[col.id]}
                      canEdit={canEdit}
                    />
                  )}
                  {col.type === 'actors' && (
                    <CellBodyActors
                      entity={entity[col.id]}
                      align="start"
                      onEntityClick={onEntityClick}
                    />
                  )}
                  {col.type === 'amount' && (
                    <CellBodyPlain
                      entity={entity[col.id]}
                      align="end"
                    />
                  )}
                  {col.type === 'date' && (
                    <CellBodyPlain
                      entity={entity[col.id]}
                      align="start"
                    />
                  )}
                  {col.type === 'targets' && (
                    <CellBodyActors
                      entity={entity[col.id]}
                      align="start"
                      onEntityClick={onEntityClick}
                    />
                  )}
                  {col.type === 'taxonomy' && (
                    <CellBodyCategories
                      entity={entity[col.id]}
                    />
                  )}
                  {col.type === 'hasResources' && (
                    <CellBodyHasResource
                      entity={entity[col.id]}
                      onEntityClick={onEntityClick}
                    />
                  )}
                  {col.type === 'actorActions' && (
                    <CellBodyBarChart
                      value={entity[col.id].value}
                      maxvalue={columnMaxValues[col.id]}
                      issecondary={col.members}
                      subject={col.subject}
                    />
                  )}
                </BodyTableCell>
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
  columnMaxValues: PropTypes.object,
  headerColumns: PropTypes.array,
  canEdit: PropTypes.bool,
  onEntityClick: PropTypes.func,
};

export default EntitiesTable;
