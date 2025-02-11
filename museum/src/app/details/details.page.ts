/*import { Component,inject, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BackendApiService } from '../servcies/backend-api.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false 
})
export class DetailsPage implements OnInit {
  private route = inject (ActivatedRoute);
  private router=inject(Router);
  private backendApiServices=inject(BackendApiService)
  paintingNumber!:number;
  paintingDetails!:any;
  constructor() { }

  ngOnInit() {
    this.route.params.subscribe(param=>{
      this.paintingNumber=param['paintingNumber'];
    })
    console.log(this.paintingNumber)

    this.backendApiServices.getAllPaintingDetails(this.paintingNumber).subscribe({next:(painting)=>{
    this.paintingDetails=painting;
    console.log(this.paintingDetails)
    },error:()=>{console.log("error")}});

  }

  }

*/
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendApiService } from '../servcies/backend-api.service';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private backendApiService = inject(BackendApiService);
  
  paintingNumber!: number;
  paintingDetails: any = null; 
  comments: Comment[] = []; 
  showAllComments = false;
  likes: Likes[] = [];
  // الخصائص الجديدة
  showReviewForm: boolean = false; // لتحديد إذا كان يجب إظهار نموذج إضافة التعليق
  reviewName: string = ''; // لتخزين اسم المستخدم
  reviewText: string = ''; // لتخزين نص التعليق الجديد

  constructor() { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.paintingNumber = Number(params.get('paintingNumber'));
      console.log("Received Painting Number:", this.paintingNumber);

      if (!isNaN(this.paintingNumber)) {
        this.fetchPaintingDetailsAndComments();
      }
    });
  }

  /**
   *  جلب تفاصيل اللوحة والتعليقات معًا لتقليل الطلبات المنفصلة
   */
  private fetchPaintingDetailsAndComments() {
    forkJoin({
      painting: this.backendApiService.getAllPaintingDetails(this.paintingNumber).pipe(
        catchError(error => {
          console.error("Error fetching painting details", error);
          return [];
        })
      ),
      comments: this.backendApiService.getCommentsForPainting(this.paintingNumber).pipe(
        catchError(error => {
          console.error("Error fetching comments", error);
          return [];
        })
      )
    }).subscribe(({ painting, comments }) => {
      this.paintingDetails = painting;
      console.log(" Painting details:", this.paintingDetails);

      this.comments = comments.map((comment: any) => ({
        comment: comment.comment,
        creation_date: comment.creation_date,
        username: comment.username,
        formattedDate: this.formatDate(comment.creation_date),
      }));

      console.log(" Comments:", this.comments);
    });
  }

  /**
   *  عرض أول 3 تعليقات فقط، أو جميعها عند الطلب
   */
  get displayComments(): Comment[] {
    return this.showAllComments ? this.comments : this.comments.slice(0, 3);
  }

  /**
   *  تبديل حالة عرض جميع التعليقات
   */
  toggleComments() {
    this.showAllComments = !this.showAllComments;
  }

  /**
   *  تنسيق التاريخ بطريقة أكثر أمانًا
   */
  private formatDate(dateString: string | null): string {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid Date' 
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  /**
   *  دالة لإضافة التعليق الجديد
   */
  addReview() {
    if (this.reviewName.trim() && this.reviewText.trim()) {
      const newComment = {
        comment: this.reviewText,
        creation_date: new Date().toISOString(),
        username: this.reviewName,
        formattedDate: this.formatDate(new Date().toISOString())
      };

      // إضافة التعليق الجديد إلى القائمة
      this.comments.push(newComment);

      // إرسال التعليق إلى الخادم إذا كان لديك API
      //عدل هنا
      this.backendApiService.addComment(this.paintingNumber, newComment).subscribe(response => {
        console.log("Comment added successfully!", response);
      }, error => {
        console.error("Error adding comment", error);
      });

      // إعادة تعيين القيم في النموذج
      this.reviewName = '';
      this.reviewText = '';
      this.showReviewForm = false; 
    } else {
      console.log("Name and Comment cannot be empty!");
    }
  }
}

interface Comment {
  comment: string;
  creation_date: string;
  username: string;
  formattedDate?: string;
}
interface Likes {
  item_id: string;
  likes: number;
}
