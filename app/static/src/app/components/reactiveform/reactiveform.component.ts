import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-reactiveform',
  templateUrl: './reactiveform.component.html',
  styleUrls: ['./reactiveform.component.css']
})
export class ReactiveformComponent implements OnInit {

  mail = new FormControl('hoge@example.com', [
    Validators.required,
    Validators.email
  ]);

  passwd = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  name = new FormControl('名無権兵衛', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(10)
  ]);

  memo = new FormControl('メモ', [
    Validators.maxLength(10)
  ]);

  myForm = this.builder.group(
    {
      mail:this.mail,
      passwd:this.passwd,
      name:this.name,
      memo:this.memo
    }
  )

  constructor(private builder:FormBuilder) { }

  ngOnInit() {
  }


  show(){
      console.log("メールアドレス：" + this.mail.value);
      console.log("パスワード：" + this.passwd.value);
      console.log("名前（漢字)" + this.name.value);
      console.log("備考：" + this.memo.value);
      console.log("全て：");
      console.log(this.myForm.value);
  }

}

