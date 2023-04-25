import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { ISettings, ITicket } from '@app/models';
import { DialogService, FireStoreService, NotifyService, TranslationService } from '@app/services';
import { ManageReservationComponent } from '../reservation/manage-reservation/manage-reservation.component';
import { Constants } from '@app/constants';

@Component({
  templateUrl: './primary.component.html'
})
export class PrimaryComponent implements OnInit {

  total = 0;
  reservationPrice = 0;
  displayedColumns: string[] = ['name', 'adultsCount', 'childrenCount', 'roomId',
  'bookingType', 'bookingDate', 'totalCost', 'paid', 'remaining', 'userNotes', 'bookingStatus', 'actions'];
  dataSource: MatTableDataSource<Partial<ITicket>> = new MatTableDataSource<Partial<ITicket>>([]);
  
  constructor(
    private fireStoreService: FireStoreService,
    private dialogService: DialogService,
    private notifyService: NotifyService,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.getSettings();
    this.getPrimaryTickets();
  }

  update(item: Partial<ITicket>): void {
    this.dialogService.openAddEditDialog(ManageReservationComponent, 'lg', true, item).afterClosed()
    .subscribe((res: {fireRefresh: boolean}) => {
      if (res.fireRefresh) {
        this.updateTableRow(item);
      }
    });
  }

  delete(item: Partial<ITicket>): void {
    if (item.name) {
      this.dialogService.openConfirmDeleteDialog(item.name).afterClosed().subscribe((res: {confirmDelete: boolean}) => {
        if (res && res.confirmDelete && item.id) {
          this.fireStoreService.getPrimaryWithRelatedParticipants(item.id).subscribe(list => {
            const ids = list.map(item => item.id);
            if (ids && ids.length > 0) {
              this.fireStoreService.deleteReservation(ids).subscribe(() => {
                this.notifyService.showNotifier(this.translationService.instant('notifications.removedSuccessfully'));
                this.removeRow(item);
              });
            }
          });
        }
      });
    }
  }

  private getPrimaryTickets(takeCount = 1): void {
    this.fireStoreService.getPrimarySubscription(takeCount).subscribe(res => {
      this.dataSource.data = res;
      this.total = res.length;
    });
  }

  private getSettings(): void {
    this.fireStoreService.getAll<ISettings>(Constants.RealtimeDatabase.settings).subscribe(data => {
      if (data && data.length > 0) {
        this.reservationPrice = data[0].reservationPrice;
      }
    });
  }

  private updateTableRow(item: Partial<ITicket>): void {
    this.fireStoreService.getById(`${Constants.RealtimeDatabase.tickets}/${item.id}`).subscribe((res) => {
      if (res) {
        const index = this.dataSource.data.findIndex(t => t.id === item.id);
        if (index > -1) {
          this.dataSource.data[index] = res;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
  }

  private removeRow(item: Partial<ITicket>): void {
    const index = this.dataSource.data.findIndex(t => t.id === item.id);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
      this.total -= 1;
    }
  }
}
