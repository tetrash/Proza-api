import React, { useState } from 'react';
import {
  makeStyles,
  Paper,
  Table,
  TableBody, TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import { gql, useQuery } from '@apollo/client';
import Loader from '../components/loader';

const styles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const LIST_POSTS = gql`query ListPosts {
  listPosts {
    items {
      id
      title
      author {
        id
        fullname
        username
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}`

interface Column {
  id: keyof Post;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any) => string;
}

interface PostAuthor {
  id: string;
  fullname: string;
  username: string;
}

interface Post {
  id: string;
  title: string;
  author?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

interface ListPosts {
  listPosts: {
    items: Post[]
  }
}

const columns: Column[] = [
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'author', label: 'Author', minWidth: 100, format: (value: PostAuthor) => `${value.username} ${value.fullname && `(${value.fullname})`}` },
  {
    id: 'updatedAt',
    label: 'Updated at',
    minWidth: 170,
    align: 'right',
    format: (value) => (new Date(Number(value))).toLocaleString(),
  },
  {
    id: 'createdAt',
    label: 'Created at',
    minWidth: 170,
    align: 'right',
    format: (value) => (new Date(Number(value))).toLocaleString(),
  },
];

export default function PostsPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const classes = styles();

  const { loading, data } = useQuery<ListPosts, {}>(LIST_POSTS);

  if (loading) {
    return <Loader />
  }

  if (data) {
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    return (
      <Paper className={classes.content}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.listPosts.items.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={`${column.id}-${row.id}`} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.listPosts.items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

  return <h2>Posts</h2>
}
