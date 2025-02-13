/*import { Component,inject, OnInit } from '@angular/core';
import { BackendApiService } from 'src/app/servcies/backend-api.service';
import { Router } from '@angular/router';
import {  HostListener } from '@angular/core';
@Component({
  selector: 'app-list-painting',
  templateUrl: './list-painting.page.html',
  styleUrls: ['./list-painting.page.scss'],
  standalone: false,
})
export class ListPaintingPage implements OnInit {
  private backendApiService = inject(BackendApiService);
  private router=inject(Router);
  allPainting: Painting[] = [];
  likes: Likes[] = []; // array type like(interface)

  constructor() { }
  goToDetails(paintingNumber:number){
    this.router.navigate(['/details',{paintingNumber:paintingNumber}])
  }
  ngOnInit() {
    this.backendApiService.getNumLikes().subscribe((likeResult) => {
      this.likes = likeResult as Likes[];
      console.log(this.likes);
    });
    console.log(this.likes);
    this.backendApiService.getAllPainting().subscribe((result) => {
      const allPainting = result.objectIDs;
      for (let painting of allPainting)
        this.backendApiService.getAllPaintingDetails(painting).subscribe((paintingResult) => {
          if(paintingResult.message==="Not a valid object"){}
          else{
            let paintingLike = this.likes.find(like => like.item_id == paintingResult.objectID);
          let paint = {
            objectID: painting,
            title: paintingResult.title,
            image: paintingResult.primaryImage,
            artistName: paintingResult.artistDisplayName,
            date: paintingResult.objectDate,
            like: paintingLike?.likes
          };
          if (paint.image!=="" && paint.title!=="" && paint.like !== undefined) {
            this.allPainting.push(paint);
          }
        }});
    });
    console.log(this.allPainting); // اعرضها في الconsole
  }
  trackPainting(index: number, painting: any): number {
    return painting.objectID; // يحدد كيف يتم تتبع كل عنصر (باستخدام الـ objectID)
  }
  showFooter = false;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const scrollTop = window.scrollY;

    // تغيير الشرط حسب احتياجك
    this.showFooter = scrollTop > 100; // إظهار الفوتر بعد التمرير 100 بكسل
  }
  }

  interface Painting {
    objectID: number;
    title: string;
    image: string;
    artistName: string;
    date: string;
    like: number | undefined;
  }
  
  interface Likes {
    item_id: string;
    likes: number;
  }
  
*/
import { Component, inject, OnInit } from '@angular/core';
import { BackendApiService } from 'src/app/servcies/backend-api.service';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-list-painting',
  templateUrl: './list-painting.page.html',
  styleUrls: ['./list-painting.page.scss'],
  standalone: false,
})
export class ListPaintingPage implements OnInit {
  private backendApiService = inject(BackendApiService);
  private router = inject(Router);
  allPainting: Painting[] = [];
  likes: Likes[] = [];
  isLiked=false;

  constructor() { }

  goToDetails(paintingNumber: number) {
    this.router.navigate(['/details', paintingNumber]); // تم إزالة {} لأن تمرير المعاملات يكون مباشرة كمصفوفة
  }

  ngOnInit() {
    this.backendApiService.getNumLikes().subscribe((likeResult) => {
      this.likes = likeResult as Likes[];
      console.log(this.allPainting);
      console.log(this.likes);
    });

    this.backendApiService.getAllPainting().subscribe((result) => {
      const allPainting = result.objectIDs;
      console.log(result);
      for (let i=0;i<100;i++) {
        this.backendApiService.getAllPaintingDetails(allPainting[i]).subscribe((paintingResult) => {
          if (paintingResult.message !== "Not a valid object") {
            let paintingLike = this.likes.find(like => like.item_id == paintingResult.objectID);
            let paint: Painting = {
              objectID: allPainting[i],
              title: paintingResult.title,
              image: paintingResult.primaryImage,
              artistName: paintingResult.artistDisplayName,
              date: paintingResult.objectDate,
              like: paintingLike?.likes,
              dimensions:paintingResult.dimensions,
              medium:paintingResult.medium
            };
            if (paint.image !== "" && paint.title !== "" && paint.like !== undefined) {
              this.allPainting.push(paint);
            }
          }
        });
      }
    });
  }
  toggleLike(paint: Painting) {
    let painting = this.allPainting.find(p => p.objectID == paint.objectID);
    if (painting) {
      painting.isLiked = !painting.isLiked;
      painting.like = painting.isLiked ? (painting.like || 0) + 1 : (painting.like || 0) - 1;
      const obj = {
        item_id: paint.objectID.toString()
      }

      this.backendApiService.addLike(obj).subscribe();
      console.log()
        //console.log("Comment added successfully!", response);
      // }, error => {
      //   //console.error("Error adding comment", error);
      // });
      // this.backendApiService.addLike(obj).subscribe(response => {
      //   console.log("Like updated successfully!", response);
      //   painting.like = response.likes;
      // }, error => {
      //   console.error("Error updating like", error);
      //   painting.isLiked = !painting.isLiked;
      //   painting.like = painting.isLiked ? (painting.like || 0) + 1 : (painting.like || 0) - 1;
      // });
    }
  }
  
  
  
  
  trackPainting(index: number, painting: Painting): number {
    return painting.objectID;
  }

  showFooter = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.showFooter = window.scrollY > 100;
  }
}

interface Painting {
  objectID: number;
  title: string;
  image: string;
  artistName: string;
  date: string;
  like: number | undefined;
  dimensions:string;
  isLiked?: boolean;
  medium:string;
}

interface Likes {
  item_id: string;
  likes: number;
}