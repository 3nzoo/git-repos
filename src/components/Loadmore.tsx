import React, { useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

interface Column {
  id: 'name' | 'language' | 'stargazers_count';
  label: string;
  minWidth?: number;
  width: string;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 170, width: '33%' },
  { id: 'language', label: 'Language', minWidth: 100, width: '33%' },
  {
    id: 'stargazers_count',
    label: 'Stars',
    minWidth: 170,
    width: '33%',
    align: 'right',
  },
];

interface IData {
  id: number;
  name: string;
  language: string;
  stargazers_count: number;
}

type LoadMoreProps = {
  data: IData[];
  limit: number;
};

const LoadMore: React.FC<LoadMoreProps> = ({ data, limit }: LoadMoreProps) => {
  const [page, setPage] = useState(0);

  //? add new Page to load More
  const handleClick = async () => {
    const addPage = page + 1;
    await setPage(addPage);
  };

  return (
    <Paper sx={{ width: '80%', textAlign: 'center' }}>
      <TableContainer sx={{ maxHeight: 440, minHeight: 500 }}>
        <Table aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {data.length ? (
            <TableBody>
              {data.length ? (
                data
                  .slice(0, page * limit + limit)
                  .map((item: IData, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.language}</TableCell>
                        <TableCell align={'right'}>
                          {item.stargazers_count}
                        </TableCell>
                      </TableRow>
                    );
                  })
              ) : (
                <></>
              )}
            </TableBody>
          ) : (
            <></>
          )}
        </Table>
      </TableContainer>
      {data.length ? (
        <Button
          style={{
            height: 'auto',
            minHeight: '50px',
            minWidth: '100px',
            textAlign: 'center',
          }}
          variant="text"
          onClick={handleClick}
        >
          Load More...
        </Button>
      ) : (
        <></>
      )}
    </Paper>
  );
};

export default LoadMore;
