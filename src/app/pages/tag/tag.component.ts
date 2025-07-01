import { Component, inject, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { TagService } from '../../tag.service';
import { Tag } from './Tag';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent implements OnInit{
  
  tags: Tag[] = [];
  private formBuilder = inject(FormBuilder);

  ngOnInit(){
    this.loadTags();
  }
  constructor(private tagService : TagService){}

  tag = this.formBuilder.group({
    name: [''],
    description: ['']
  })
  loadTags(){
    this.tagService.getAll().subscribe(data => {
      this.tags = data;
    })
  }
  createTag(){
    let nameX = this.tag.value.name as string;
    let descriptionX = this.tag.value.description as string;
    let tag = {name: nameX, description: descriptionX}
    this.tagService.create(tag).subscribe(data => {
      console.log(data)
    })
  }
 
}
