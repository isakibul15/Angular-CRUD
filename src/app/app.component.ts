import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './sercies/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'; 


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CRUD-Operation';
  displayedColumns: string[] = ['productName', 'category', 'date', 'price', 'freshness', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog, private api : ApiService) {}

  ngOnInit() {
    this.getAllProduct();
  } 
  openDialog() {
    this.dialog.open(DialogComponent, {
    width: '30%',
    }).afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getAllProduct();
      }
    }
    ) 
  }

  
  getAllProduct() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        console.log("Error while getting the product");
      }
    })
  }

  editProduct(row : any) {
        this.dialog.open(DialogComponent, {
          width: '30%',
          data: row
        }).afterClosed().subscribe(result => {
          if (result === 'update') {
            this.getAllProduct();
          }
        })
  }

  deleteProduct(id : number) {
    if(confirm("Are you sure to delete ")) {
      this.api.deleteProduct(id).subscribe({
        next: (res) => {
          alert("Product Deleted Successfully");
          this.getAllProduct();
        },
        error: () => {
          console.log("Error while deleting the product");
        }
      })
    }
  } 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
