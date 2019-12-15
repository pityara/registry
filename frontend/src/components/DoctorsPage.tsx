import React, { useContext, useState, useEffect, useMemo } from 'react';
import { getUnixTime } from 'date-fns';
import { USERS_QUERY } from '../queries/users';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LocalizationContext from '../contexts/LocalizationContext';
import useStyles from './DoctorsPage.styles';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent } from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import { BOOK_ENCOUNTER } from '../mutations/bookEncounter';

export default function DoctorsPage() {
  const { data, } = useQuery(USERS_QUERY, { variables: { role: 'doctor' } });
  const [handleBook, { data: bookData }] = useMutation(BOOK_ENCOUNTER);
  const [error, setError] = useState(null);
  const { onGetTranslation } = useContext(LocalizationContext);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const current = useMemo(() => {
    const current = new Date();
    current.setSeconds(0);
    current.setMilliseconds(0);

    return current;
  }, []);
  const [selectedDate, setSelectedDate] = useState(current);

  const handleClearSelectedDoctor = () => {
    setSelectedDoctor(null);
  };

  const styles = useStyles({});

  const handleBookDoctor = () => {
    handleBook({
      variables: {
        doctorId: selectedDoctor.id,
        timestamp: getUnixTime(selectedDate),
      }
    });
  }

  useEffect(() => {
    if (!bookData || !bookData.bookEncounter) {
      return;
    }
    const { bookEncounter: { success, message } } = bookData;

    if (success) {
      window.location.href = '/';
    }

    if (!success) {
      setError(message);
    }
  }, [bookData]);

  return (
    <div className={styles.container}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>{onGetTranslation('id')}</TableCell>
            <TableCell>{onGetTranslation('firstName')}</TableCell>
            <TableCell>{onGetTranslation('lastName')}</TableCell>
            <TableCell>{onGetTranslation('email')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.users && data.users.map(u => {
            const handleSelectDoctor = () => {
              setSelectedDoctor(u);
            };

            return (
              <TableRow>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.firstName}</TableCell>
                <TableCell>{u.lastName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={handleSelectDoctor}
                  >
                    {onGetTranslation('book')}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog
        open={Boolean(selectedDoctor)}
        onClose={handleClearSelectedDoctor}
      >
        <DialogTitle>
          {`${onGetTranslation('book-to')} ${selectedDoctor && selectedDoctor.firstName} ${selectedDoctor && selectedDoctor.lastName}`}
        </DialogTitle>
        <DialogContent className={styles.timeSelection}>
          <DateTimePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minDate={new Date()}
            minutesStep={30}
            autoOk
          />
          <Button
            variant="contained"
            onClick={handleBookDoctor}
          >
            {onGetTranslation('select')}
          </Button>
        </DialogContent>
      </Dialog>
      {error && (
        <Dialog
          open={Boolean(error)}
          onClose={() => setError(null)}
        >
          <DialogTitle>
            {onGetTranslation('error-occurs')}
          </DialogTitle>
          <DialogContent>
            {onGetTranslation(error)}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
