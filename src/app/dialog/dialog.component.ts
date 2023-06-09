import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../sercies/api.service';
import { MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New", "Second Hand", "Refurbished"]
  productForm !: FormGroup;
  actionBtn: string = "Save";
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>) { }
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', Validators.required],
      freshness: ['', Validators.required],
      comment: ['', Validators.required],

    });



    if (this.editData) {
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['comment'].setValue(this.editData.comment);
    }
  }
  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert("Product Added Successfully");
            this.productForm.reset();
            this.dialogRef.close('save');

          },
          error: () => {
            console.log("Error while adding the product");
          }
        })
      }
    }
    else {
      this.updateProduct();
    }
  }
    updateProduct() {
      if (this.productForm.valid) {
        this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
          next: (res) => {
            alert("Product Updated Successfully");
            this.productForm.reset();
            this.dialogRef.close('update');
          },
          error: () => {
            alert("Error while updating the product");
          }
        }
      )
    }
  }
} 