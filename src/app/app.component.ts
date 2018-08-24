import { Component, ViewChild} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  GoogleApiService, GoogleAuthService, 

} from "ng-gapi";

import { UserService } from './service/gapi-service';
import { BloggerService,Blogs,Blog,Post, PostWithContent } from './service/BloggerService';
import { MatTableDataSource, MatPaginator, MatSort} from '@angular/material';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  panel =
    { blog: "Blog", post: "Post" };

  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }


  displayColumns : string [] = ["title","author","published"];

  dataSource: MatTableDataSource <Post>;

  _blogs: Blogs;
  selectedBlog: string;
  blog: Blog;
  post: PostWithContent;
  postContent: SafeHtml;
  
  
  get blogs(): Blogs {

    if (!this._blogs)
    {

      this.getBlogs();
    }

    return this._blogs;

  }

  set blogs(blogs: Blogs)
  {
    this._blogs = blogs;
  }



  constructor(private userService: UserService,
    private gapiService: GoogleApiService,private bs : BloggerService, private googleAuthService: GoogleAuthService,private sanitizer: DomSanitizer){
  // First make sure gapi is loaded can be in AppInitilizer
  this.gapiService.onLoad().subscribe();
  this.dataSource = new MatTableDataSource(null);
 
  
  }

  selectedRowIndex: number = -1;

  highlight(row){
    console.log('clicked on: '+row.id);
    this.selectedRowIndex = row.id;
    this.getPost(this.blog.id,  row.id);
  }

  public isLoggedIn(): boolean {
    
    return this.userService.isUserSignedIn();
  
  }


  public doLogin() {
    console.log('logging in');
    this.userService.signIn();
 
  }

  public doLogout() {
    this.blogs = null;
    this.dataSource.data = null;

    console.log ('logging out');
    this.userService.signOut();
  }

  public selectBlogEvent($event) {
    console.log($event);
 
    console.log('loading blog for: '+$event.value);
    this.blog = this.getBlog($event.value);
    this.post = null;
    this.getPosts (this.blog.id,this.blog.posts.totalItems);
  }

  public getBlogs() {


      console.log ('loading blogs');
     this.bs.getBlogs(this.userService.getToken()).subscribe ((res)=>{
        this._blogs = res;
      
      });

  }

  public getPosts(id: string, maxSize: string) {

  
        console.log ('loading posts');
       this.bs.getPosts(this.userService.getToken(),id,maxSize).subscribe ((res)=>{
   

         console.log ('size: '+res.items.length);
         
          this.dataSource = new MatTableDataSource(res.items);
        });

    }

    public sanitizePostContent(content: string): SafeHtml {

      console.log ('sanitizing content');
      let res: SafeHtml  = this.sanitizer.bypassSecurityTrustHtml (content);
      return res;

    }

    public getPost(id: string,postId: string) {


    
          console.log ('loading post');
           this.bs.getPost(this.userService.getToken(),id,postId).subscribe ((res)=>{
            this.post = res;
            this.postContent = this.sanitizePostContent (res.content);
            this.panel.post = res.title;
            this.panel.blog = this.blog.name;

          
          });
    
    
      }

    public getBlog(id: string) {

    
          console.log ('loading blog');



          for (let blog of this._blogs.items)
          {
            if (blog.id == id)
            {
              console.log ('found blog: '+blog.id);
              return blog;
            }

          }
           
          return null;
    
      }

        /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = null;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }
}



