import React, { FormEvent, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import MDEditor from '@uiw/react-md-editor';
import SaveIcon from '@material-ui/icons/Save';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormActionButton from './formActionButton';

const useStyles = makeStyles(() => ({
  actionButton: {
    'white-space': 'nowrap',
  },
  actionButtonDiv: {
    'margin-left': 'auto',
  },
  titleDiv: {
    width: '100%',
    'margin-bottom': '30px',
    display: 'inline-flex',
  },
  titleInput: {
    width: '50%',
  },
  formDiv: {
    'max-width': 'fit-content',
    'min-width': '100%',
  },
}));

interface PostFormProps {
  onSubmit: (payload: { title: string; body: string }) => unknown;
  onDelete?: () => unknown;
  initState?: Partial<{ title: string; body: string }>;
  allowDelete?: boolean;
}

export default function PostsForm({ onSubmit, initState, onDelete, allowDelete }: PostFormProps) {
  const [title, setTitle] = useState<string>((initState && initState.title) || '');
  const [body, setBody] = useState<string>((initState && initState.body) || '');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const classes = useStyles();
  const editorHeight = 500;

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    return onSubmit({ title, body });
  };

  const handleDelete = () => {
    handleCloseDialog();
    return onDelete && onDelete();
  };

  return (
    <div className={classes.formDiv}>
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
          <div className={classes.actionButtonDiv}>
            <FormActionButton
              className={classes.actionButton}
              onClick={handleSubmit}
              buttonText="Save post"
              startIcon={<SaveIcon />}
            />
            {allowDelete && (
              <FormActionButton
                className={classes.actionButton}
                onClick={handleClickOpenDialog}
                buttonText="Delete post"
                color="secondary"
                startIcon={<DeleteForeverIcon />}
              />
            )}
          </div>
        </div>
        <MDEditor value={body} onChange={(value) => setBody(value || '')} height={editorHeight} />
      </form>
      <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openDialog}>
        <DialogTitle id="customized-dialog-title">Delete post &quot;{title}&quot;</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>This post will be deleted permanently. This action is irreversible!</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDelete} color="primary">
            Confirm
          </Button>
          <Button autoFocus onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
