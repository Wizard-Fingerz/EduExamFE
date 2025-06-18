import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  MenuItem,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onAdd: (newItem: any) => void;
  onEdit: (editedItem: any) => void;
  onDelete: (item: any) => void;
  addFormFields: {
    id: string;
    label: string;
    type?: string;
    multiline?: boolean;
    options?: { value: any; label: string }[];
  }[];
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  addFormFields,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingItem, setEditingItem] = useState<any>(null);

  const tableData = Array.isArray(data) ? data : [];

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAdd = () => {
    console.log('DataTable handleAdd called with formData:', formData);
    onAdd(formData);
    setFormData({});
    setOpenAddDialog(false);
  };

  const handleEdit = () => {
    onEdit({ ...editingItem, ...formData });
    setFormData({});
    setEditingItem(null);
    setOpenEditDialog(false);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormData(item);
    setOpenEditDialog(true);
  };

  const handleDelete = (item: any) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item);
    }
  };

  const renderMobileView = (row: any, index: number) => (
    <Card key={index} sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          {columns.map((column) => {
            const value = row[column.id];
            return (
              <Box key={column.id}>
                <Typography variant="subtitle2" color="text.secondary">
                  {column.label}
                </Typography>
                <Typography variant="body1">
                  {column.format ? column.format(value, row) : value}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            );
          })}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleOpenEdit(row)} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(row)} size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          fullWidth={isMobile}
        >
          Add New
        </Button>
      </Box>

      {isMobile ? (
        <Stack spacing={2}>
          {tableData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => renderMobileView(row, index))}
        </Stack>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpenEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(row)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Add Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {addFormFields.map((field) => (
              field.type === 'select' ? (
                <TextField
                  key={field.id}
                  select
                  label={field.label}
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      [field.id]: e.target.value 
                    })
                  }
                  fullWidth
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={field.id}
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      [field.id]: field.type === 'checkbox' 
                        ? (e.target as HTMLInputElement).checked 
                        : e.target.value 
                    })
                  }
                  fullWidth
                  multiline={field.type === 'multiline'}
                  rows={field.type === 'multiline' ? 4 : undefined}
                />
              )
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {addFormFields.map((field) => (
              field.type === 'select' ? (
                <TextField
                  key={field.id}
                  select
                  label={field.label}
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      [field.id]: e.target.value 
                    })
                  }
                  fullWidth
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={field.id}
                  label={field.label}
                  type={field.type || 'text'}
                  value={formData[field.id] || ''}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      [field.id]: field.type === 'checkbox' 
                        ? (e.target as HTMLInputElement).checked 
                        : e.target.value 
                    })
                  }
                  fullWidth
                  multiline={field.type === 'multiline'}
                  rows={field.type === 'multiline' ? 4 : undefined}
                />
              )
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 