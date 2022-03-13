import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'grommet';
import styled from 'styled-components';
import CellBodyMain from './CellBodyMain';
import CellBodyPlain from './CellBodyPlain';
import CellBodyActors from './CellBodyActors';
import CellBodyCategories from './CellBodyCategories';
import CellBodyHasResource from './CellBodyHasResource';
import CellBodyBarChart from './CellBodyBarChart';
import CellHeaderMain from './CellHeaderMain';
import CellHeaderPlain from './CellHeaderPlain';

const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  width: inherit;
  table-layout: fixed;
  width: 100%;
`;
const TableHeader = styled.thead``;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  height: 100%;
`;

const TableCellHeader = styled.th`
  margin: 0;
  padding: 0;
  font-weight: inherit;
  text-align: inherit;
  height: 100%;
  text-align: start;
  border-bottom: solid 1px;
  border-bottom-color: ${({ utility }) => utility ? 'transparent' : 'rgba(0,0,0,0.33)'};
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 6px;
  padding-bottom: 6px;
  width: ${({ col, count, colSpan = 1 }) => {
    if (count === 1) {
      return 100;
    }
    if (count === 2) {
      return col.type === 'main' ? 70 : 30;
    }
    if (count > 2) {
      return col.type === 'main' ? 40 : (60 / (count - 1)) * colSpan;
    }
    if (count > 4) {
      return col.type === 'main' ? 40 : (60 / (count - 1)) * colSpan;
    }
    return 0;
  }}%;
`;
const TableCellHeaderInner = styled((p) => <Box {...p} />)`
`;
const TableCellBody = styled.td`
  margin: 0;
  padding: 0;
  font-weight: inherit;
  text-align: inherit;
  height: 100%;
  text-align: start;
  border-bottom: solid 1px #DADADA;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 6px;
  padding-bottom: 6px;
  word-wrap:break-word;
  width: ${({ col, count }) => {
    if (count === 1) {
      return 100;
    }
    if (count === 2) {
      return col.type === 'main' ? 70 : 30;
    }
    if (count > 4) {
      return col.type === 'main' ? 40 : 60 / (count - 1);
    }
    if (count > 2) {
      return col.type === 'main' ? 40 : 60 / (count - 1);
    }
    return 0;
  }}%;
`;
const TableCellBodyInner = styled((p) => <Box {...p} />)`
  padding: 6px 0;
`;

export function EntitiesTable({
  entities,
  canEdit,
  columns,
  headerColumns,
  onEntityClick,
  columnMaxValues,
  headerColumnsUtility,
  memberOption,
  subjectOptions,
}) {
  return (
    <Box fill="horizontal">
      <Table>
        {headerColumns && (
          <TableHeader>
            {headerColumnsUtility && (
              <TableRow>
                {headerColumnsUtility.map(
                  (col, i) => (
                    <TableCellHeader
                      key={i}
                      scope="col"
                      col={col}
                      count={headerColumns.length}
                      colSpan={col.span || 1}
                      utility
                    >
                      {col.type === 'options' && (
                        <Box>
                          {subjectOptions && (
                            <Box>
                              {subjectOptions}
                            </Box>
                          )}
                          {memberOption && (
                            <Box>
                              {memberOption}
                            </Box>
                          )}
                        </Box>
                      )}
                    </TableCellHeader>
                  )
                )}
              </TableRow>
            )}
            <TableRow>
              {headerColumns.map(
                (col, i) => (
                  <TableCellHeader
                    key={i}
                    scope="col"
                    col={col}
                    count={headerColumns.length}
                  >
                    <TableCellHeaderInner>
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
                          align="end"
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
                          align="end"
                        />
                      )}
                      {col.type === 'actorActions' && (
                        <CellHeaderPlain
                          column={col}
                          align="start"
                        />
                      )}
                      {col.type === 'actiontype' && (
                        <CellHeaderPlain
                          column={col}
                          align="start"
                        />
                      )}
                      {col.type === 'associations' && (
                        <CellHeaderPlain
                          column={col}
                          align="start"
                        />
                      )}
                      {col.type === 'members' && (
                        <CellHeaderPlain
                          column={col}
                          align="start"
                        />
                      )}
                    </TableCellHeaderInner>
                  </TableCellHeader>
                )
              )}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {entities.length > 0 && entities.map((entity, key) => (
            <TableRow key={key}>
              {columns.map((col, i) => (
                <TableCellBody
                  key={i}
                  scope="row"
                  col={col}
                  count={headerColumns.length}
                >
                  <TableCellBodyInner>
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
                        align="end"
                      />
                    )}
                    {col.type === 'targets' && (
                      <CellBodyActors
                        entity={entity[col.id]}
                        align="start"
                        onEntityClick={onEntityClick}
                      />
                    )}
                    {col.type === 'members' && (
                      <CellBodyActors
                        entity={entity[col.id]}
                        align="start"
                        onEntityClick={onEntityClick}
                      />
                    )}
                    {col.type === 'associations' && (
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
                        align="end"
                      />
                    )}
                    {col.type === 'actorActions' && (
                      <CellBodyBarChart
                        value={entity[col.id].value}
                        maxvalue={Object.values(columnMaxValues).reduce((memo, val) => Math.max(memo, val), 0)}
                        issecondary={col.members}
                        subject={col.subject}
                      />
                    )}
                    {col.type === 'actiontype' && (
                      <CellBodyBarChart
                        value={entity[col.id].value}
                        maxvalue={Object.values(columnMaxValues).reduce((memo, val) => Math.max(memo, val), 0)}
                        subject={col.subject}
                      />
                    )}
                  </TableCellBodyInner>
                </TableCellBody>
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
  headerColumnsUtility: PropTypes.array,
  canEdit: PropTypes.bool,
  onEntityClick: PropTypes.func,
  memberOption: PropTypes.node,
  subjectOptions: PropTypes.node,
};

export default EntitiesTable;
