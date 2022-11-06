import React, { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
type PaginationProps = {
  data: string[];
  limit: number;
};

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Repository Name',
    width: 150,
  },
  {
    field: 'language',
    headerName: 'Programming Language',
    width: 150,
  },
  {
    field: 'stargazers_count',
    headerName: 'Star count',
    width: 100,
  },
];

const PaginationComponent: React.FC<PaginationProps> = ({
  data,
  limit,
}: PaginationProps) => {
  return (
    <div style={{ height: 500, width: 'auto', minWidth: 420 }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={limit}
        rowsPerPageOptions={[limit]}
      />
    </div>
  );
};

export default PaginationComponent;
