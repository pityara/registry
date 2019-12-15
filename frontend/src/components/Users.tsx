import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Table, TableBody, TableRow, TableCell, TableHead, Button } from '@material-ui/core';
import { USERS_QUERY } from '../queries/users';
import LocalizationContext from '../contexts/LocalizationContext';
import useStyles from './Users.styles';
import CreateDoctorDialog from './CreateDoctorDialog';
import useDialogSwitch from '../hooks/useDialogSwitch';

export default function UsersPage() {
  const { data, } = useQuery(USERS_QUERY);
  const { onGetTranslation } = useContext(LocalizationContext);
  const [
    createDoctorDialogVisible,
    onOpenCreateDoctorDialog,
    onCloseCreateDoctorDialog,
  ] = useDialogSwitch();
  const styles = useStyles({});

  return (
    <div className={styles.container}>
      <Button
        variant="contained"
        className={styles.button}
        onClick={onOpenCreateDoctorDialog}
      >
        {onGetTranslation('create-doctor')}
      </Button>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>{onGetTranslation('id')}</TableCell>
            <TableCell>{onGetTranslation('firstName')}</TableCell>
            <TableCell>{onGetTranslation('lastName')}</TableCell>
            <TableCell>{onGetTranslation('email')}</TableCell>
            <TableCell>{onGetTranslation('role')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.users && data.users.map(u => (
            <TableRow>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.firstName}</TableCell>
              <TableCell>{u.lastName}</TableCell>
              <TableCell>{u.email}</TableCell>
              <TableCell>{onGetTranslation(u.role)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {createDoctorDialogVisible &&
        <CreateDoctorDialog
          onClose={onCloseCreateDoctorDialog}
        />}
    </div>
  )
}
