import React, { FormEvent } from 'react';
import { Button, makeStyles, TextField } from '@material-ui/core';
import MDEditor from '@uiw/react-md-editor';

const useStyles = makeStyles(() => ({
  submitBtn: {
    'margin-left': '24px',
    'white-space': 'nowrap',
  },
  titleDiv: {
    width: '100%',
    'margin-bottom': '24px',
    display: 'inline-flex',
  },
  titleInput: {
    width: '100%',
  },
}));

interface PostFormProps {
  onSubmit: (payload: { title: string; body: string }) => unknown;
  initState?: Partial<{ title: string; body: string }>;
}

export default function PostForm({ onSubmit, initState }: PostFormProps) {
  const [title, setTitle] = React.useState<string>((initState && initState.title) || '');
  const [body, setBody] = React.useState<string>((initState && initState.body) || '');
  const classes = useStyles();
  const editorHeight = 500;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    return onSubmit({ title, body });
  };

  return (
    <form id="create-post-form" onSubmit={handleSubmit}>
      <div className={classes.titleDiv}>
        <TextField
          required
          id="title"
          label="Title"
          autoFocus
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          className={classes.titleInput}
        />
        <Button type="submit" form="create-post-form" variant="contained" color="primary" className={classes.submitBtn}>
          Save post
        </Button>
      </div>
      <MDEditor value={body} onChange={(value) => setBody(value || '')} height={editorHeight} />
    </form>
  );
}
