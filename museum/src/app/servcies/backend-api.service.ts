import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { metmuseumPath } from 'src/app/servcies/URL'; // إذا كان لديك هذا الاستيراد

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {

  constructor(private http: HttpClient) { }

  // جلب جميع اللوحات الفنية
  getAllPainting(): Observable<any> {
    return this.http.get<any>('https://collectionapi.metmuseum.org/public/collection/v1/search?q=painting&hasImages=true');
  }

  // جلب تفاصيل لوحة معينة حسب رقمها
  getAllPaintingDetails(paintingNumber: number): Observable<any> {
    return this.http.get<any>('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + paintingNumber);
  }

  // جلب عدد اللايكات
  getNumLikes(): Observable<any> {
    return this.http.get<any>('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/likes/');
  }

  // جلب التعليقات الخاصة باللوحة بناءً على رقمها
  getCommentsForPainting(paintingNumber: number): Observable<any> {
    return this.http.get<any>('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/comments?item_id=' + paintingNumber);
  }

  // إضافة تعليق جديد على لوحة معينة
  addComment(paintingNumber: number, newComment: any): Observable<any> {
    // الرابط الذي سيرسل التعليق إليه
    const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/comments`;
    
    // إرسال البيانات باستخدام POST
    return this.http.post<any>(url, {
      item_id: paintingNumber,  // رقم اللوحة
      username: newComment.username,  // اسم المستخدم
      comment: newComment.comment   // نص التعليق
    });

  }
  addLike(obj: any): Observable<any> {
    // const body = { item_id: paintingNumber }; // إرسال رقم اللوحة فقط
    return this.http.post<any>('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/likes/', obj);
  }

  // دالة لإزالة الإعجاب
  // removeLike(paintingNumber: number): Observable<any> {
  //   const body = { item_id: paintingNumber }; // إرسال رقم اللوحة فقط
  //   return this.http.delete<any>('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/pKSoTbGzFhj5RtoeFQif/likes/', { body });
  // }
  
}
