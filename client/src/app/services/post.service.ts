import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {

    baseUrl = 'http://localhost:5000/api/';

    constructor(private http: HttpClient) { }

    createPost(caption: string): Observable<Post> {
        return this.http.post<Post>(this.baseUrl + 'post', { caption });
    }

    getFeed(): Observable<Post[]> {
        return this.http.get<Post[]>(this.baseUrl + 'post');
    }

    getUserPosts(userId: string): Observable<Post[]> {
        return this.http.get<Post[]>(this.baseUrl + 'post/user/' + userId);
    }

}