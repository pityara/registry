import React, { useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { ENCOUNTERS_QUERY } from '../queries/encounters';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LocalizationContext from '../contexts/LocalizationContext';
import useStyles from './EncountersPage.styles';
import LinkButton from './controls/LinkButton';
import { CANCEL_ENCOUNTER } from '../mutations/cancelEncounter';

export default function EncountersPage() {
  const { data } = useQuery(ENCOUNTERS_QUERY);
  const [handleCancel, { data: cancelData }] = useMutation(CANCEL_ENCOUNTER);
  const styles = useStyles({});
  const { onGetTranslation } = useContext(LocalizationContext);

  useEffect(() => {
    if (!cancelData) {
      return;
    }

    if (cancelData.cancelEncounter && cancelData.cancelEncounter.success) {
      window.location.reload();
    }
  }, [cancelData]);

  return (
    <div className={styles.container}>
      <LinkButton
        label="book"
        href="/doctors"
        className={styles.button}
        variant="contained"
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{onGetTranslation('opponent')}</TableCell>
            <TableCell>{onGetTranslation('time')}</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.encounters && data.encounters.encounters && data.encounters.encounters.map(e => {
            const { opponent } = e;
            const cancelEncounter = () => {
              handleCancel({ variables: { encounterId: e.id } });
            }
            return (
              <TableRow>
                <TableCell>{`${opponent.firstName} ${opponent.lastName}`}</TableCell>
                <TableCell>{format(e.timestamp * 1000, 'dd-MM-yyyy HH:mm')}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={cancelEncounter}
                  >
                    {onGetTranslation('cancel')}
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
