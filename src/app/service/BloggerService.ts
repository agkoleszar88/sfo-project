import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Video} from '../app-types';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BloggerService {

  BLOGGER_API_URL = 'https://www.googleapis.com/blogger/v3/blogs/';

  constructor(private http: HttpClient) { }


  
  public getBlogs(authtoken: string): Observable<Blogs> {

    if (!authtoken)
    {
      console.log('dont do call is no bearer token');
      return null;
    }

    console.log ('load blogs at time: '  + new Date().toString());


    let url = 'https://www.googleapis.com/blogger/v3/users/self/blogs';
    console.log(url);


    return this.http.get<Blogs>(url, {
      headers: new HttpHeaders({
            Authorization: `Bearer ${authtoken}`
        })
    });
    
}

public getBlog(authtoken: string,id : string): Observable<Blog> {

  if (!authtoken)
  {
    console.log('dont do call is no bearer token');
    return null;
  }

  console.log ('load blog at time: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+id;
  console.log(url);


  return this.http.get<Blog>(url, {
    headers: new HttpHeaders({
          Authorization: `Bearer ${authtoken}`
      })
  });
  
}

public getPosts(authtoken: string,id : string,maxSize: string): Observable<Posts> {

  if (!authtoken)
  {
    console.log('dont do call is no bearer token');
    return null;
  }

  console.log ('load posts at time: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+id+'/posts';
  console.log(url);


  return this.http.get<Posts>(url,
    {

    headers: new HttpHeaders({
          Authorization: `Bearer ${authtoken}`
      } ), params : new HttpParams().set('maxResults',maxSize)

  });
  
}

public getPost(authtoken: string,blogId : string,postId: string): Observable<PostWithContent> {

  if (!authtoken)
  {
    console.log('dont do call is no bearer token');
    return null;
  }

  console.log ('load post: '  + new Date().toString());


  let url = this.BLOGGER_API_URL+blogId+'/posts/'+postId;
  console.log(url);


  return this.http.get<PostWithContent>(url, {
    headers: new HttpHeaders({
          'Authorization':'Bearer '+authtoken

      })
  });
  
}

public updatePost(authtoken: string, post: Post): Observable<PostWithContent> {

  if (!authtoken)
  {
    console.log('dont do call is no bearer token');
    return null;
  }

  console.log ('update post: '  + new Date().toString());

  console.log (JSON.stringify(post));


  let url = this.BLOGGER_API_URL+post.blog.id+'/posts/'+post.id;
  console.log(url);

  return this.http.put<PostWithContent>(url, JSON.stringify(post), {
    headers: new HttpHeaders({
      'Authorization':'Bearer '+authtoken,
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
  items: Blog []
}

export interface Blog {

  kind: string;
  id: string;
  name: string;
  description: string;
  published: string;
  updated: string;
  posts: Posts;

  /*
  "kind": "blogger#blog",
  "id": "2399953",
  "name": "Blogger Buzz",
  "description": "The Official Buzz from Blogger at Google",
  "published": "2007-04-23T22:17:29.261Z",
  "updated": "2011-08-02T06:01:15.941Z",
  "url": "http://buzz.blogger.com/",
  "selfLink": "https://www.googleapis.com/blogger/v3/blogs/2399953",
  "posts": {
    "totalItems": 494,
    "selfLink": "https://www.googleapis.com/blogger/v3/blogs/2399953/posts"
  },
  "pages": {
    "totalItems": 2,
    "selfLink": "https://www.googleapis.com/blogger/v3/blogs/2399953/pages"
  },
  "locale": {
    "language": "en",
    "country": "",
    "variant": ""
  }
  */
}
