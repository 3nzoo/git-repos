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
    width: 250,
  },
  {
    field: 'language',
    headerName: 'Programming Language',
    width: 250,
    align: 'center',
  },
  {
    field: 'stargazers_count',
    headerName: 'Star count',
    width: 100,
    align: 'right',
  },
];

const PaginationComponent: React.FC<PaginationProps> = ({
  data,
  limit,
}: PaginationProps) => {
  return (
    <div style={{ height: 500, width: 'auto', minWidth: 640 }}>
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
