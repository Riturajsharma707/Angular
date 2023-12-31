import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  freshnessList = ["Brand New" , "Second Hand", "Referbished"]

  productForm !: FormGroup;
  actionButton: string ="Save"
  constructor(private FormBuilder : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData : any,
     private api : ApiService, private dialogRef : MatDialogRef<DialogComponent>) {}
  ngOnInit(): void{
    this.productForm = this.FormBuilder.group({
      productName : ['',Validators.required],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price :['',Validators.required],
      comment :['',Validators.required],
      date :['',Validators.required]

    });
    if(this.editData){
      this.actionButton = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);

    }
  }
  addProduct(){
     if(!this.editData){
      if(this.productForm.valid)
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next:(res)=>{
          alert("Product added successfully");
          this.productForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
            alert("Error while adding the product!")
        }
      })
     }else{this.updateProduct()}
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Product update successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the record!");
      }
    })
  }
}
