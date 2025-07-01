import { Component, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { TagService } from '../../tag.service';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {
  

  private formBuilder = inject(FormBuilder);

  constructor(private tagService : TagService){}

  tag = this.formBuilder.group({
    name: [''],
    description: ['']
  })

  createTag(){
    let nameX = this.tag.value.name as string;
    let descriptionX = this.tag.value.description as string;
    let tag = {name: nameX, description: descriptionX}
    this.tagService.create(tag).subscribe(data => {
      console.log(data)
    })
  }
 
}
