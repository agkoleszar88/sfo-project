import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BloggerService {

  BLOGGER_API_URL = 'https://www.googleapis.com/blogger/v3/blogs/';

  constructor(private http: HttpClient) { }


  public getBlogs(): Observable<Blogs> {

    console.log ('load blogs at time: '  + new Date().toString());


    let url = 'https://www.googleapis.com/blogger/v3/users/self/blogs';
    console.log(url);
    return this.http.get<Blogs>(url); 
}

public getBlog(id : string): Observable<Blog> {


  console.log ('load blog at time: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+id;
  console.log(url);


  return this.http.get<Blog>(url);
  
}

public getPosts(id : string,maxSize: string): Observable<Posts> {


  console.log ('load posts at time: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+id+'/posts';
  console.log(url);


  return this.http.get<Posts>(url,
    {

    headers: new HttpHeaders(), params : new HttpParams().set('maxResults',maxSize)

  });
  
}

public getPost(blogId : string,postId: string): Observable<PostWithContent> {

 

  console.log ('load post: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+blogId+'/posts/'+postId;
  console.log(url);


  return this.http.get<PostWithContent>(url);
  
}

public updatePost(post: PostWithContent): Observable<PostWithContent> {

  console.log ('update post: '  + new Date().toString());

  console.log (JSON.stringify(post));


  let url = this.BLOGGER_API_URL+post.blog.id+'/posts/'+post.id;
  console.log(url);

  return this.http.put<PostWithContent>(url, JSON.stringify(post), {
    headers: new HttpHeaders({
      'Content-Type':'application/json'

  })
});
  
}

public deletePost(post: PostWithContent): Observable<any> {


  console.log ('delete post id: '  + post.id + ' ' + new Date().toString());

  console.log (JSON.stringify(post));


  let url = this.BLOGGER_API_URL+post.blog.id+'/posts/'+post.id;
  console.log(url);

  return this.http.delete<any>(url, {
    headers: new HttpHeaders({
      'Content-Type':'application/json'

  })
});
  
}

public createPost(post: PostWithContent): Observable<PostWithContent> {

 
  let url = this.BLOGGER_API_URL+post.blog.id+'/posts';
  console.log(url);

  return this.http.post<PostWithContent>(url, `
  {
    "kind": "blogger#post",
    "blog": {
      "id": "${post.blog.id}"
    },
    "title": "${post.title}",
    "content": "${post.content}"
  }
  `,
    {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
  })
});
  
}

 
}

export interface Author {
  id: string;
  displayName : string;
  url: string;
}

export interface Replies
{
  totalItems: number;
  selfLink: string;
}

export interface Post {
  kind: string;
  id: string;
  blog: Blog;
  published : string;
  updated: string;
  url: string;
  selfLink: string;
  title: string;
  author: Author;
  replies: Replies;
  content: string;
}


export interface PostWithContent extends Post {
  content: string;
}

export interface Posts {
  kind: string;
  nextPageToken: string;
  prevPageToken: string;
  totalItems: string;
  items: Post [];

}

export interface Blogs {
  kind: string;
  items: Blog [];
}

export interface Blog {

  kind: string;
  id: string;
  name: string;
  description: string;
  published: string;
  updated: string;
  posts: Posts;

  
}


