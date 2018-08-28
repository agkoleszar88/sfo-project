import { Component, Inject, EventEmitter, ViewChild} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  GoogleApiService, GoogleAuthService, 

} from "ng-gapi";

import { UserService } from './service/gapi-service';
import { BloggerService,Blogs,Blog,Post,Posts, PostWithContent } from './service/BloggerService';
import { MatSnackBar,MatTableDataSource, MatPaginator, MatSort, MatMenuTrigger} from '@angular/material';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

export interface DialogData {
  action: string;
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  openMyMenu() {
    this.trigger.openMenu();
  } 
  closeMyMenu() {
    this.trigger.closeMenu();
  }  

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

  viewMode: boolean = true;

  _editCurrentPost: boolean = false;

  mode: string = "View";
  postIndex: number = 0;

  showNavigationArrows = false;
  showNavigationIndicators = false;

  _blogs: Blogs;
  selectedBlog: string;
  blog: Blog;
  post: PostWithContent;
  safePostContent : SafeHtml;
  posts: Posts;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '5rem',
    placeholder: 'Type something. Test the Editor... ヽ(^。^)丿',
    translate: 'no'
  };

  constructor(public dialog: MatDialog,public snackBar: MatSnackBar,private userService: UserService,
    private gapiService: GoogleApiService,private bs : BloggerService, private googleAuthService: GoogleAuthService,private sanitizer: DomSanitizer){
  // First make sure gapi is loaded can be in AppInitilizer
  this.gapiService.onLoad().subscribe();
  this.dataSource = new MatTableDataSource(null);
 
  }

  openSaveDialog(): void {
    const dialogRef = this.dialog.open(PerformActionDialog, {
      data :{'action':'Save'},
      width: '250px'
    });


    const sub = dialogRef.componentInstance.onPerformAction.subscribe(() => {

    console.log ('must save post');
    this.updatePost(this.post);

  });

  dialogRef.afterClosed().subscribe(() => {
    dialogRef.componentInstance.onPerformAction.unsubscribe();

    this._editCurrentPost = false;
  // unsubscribe onAdd
  });

  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(PerformActionDialog, {
      data :{'action':'Delete'},
      width: '250px'
    });


    const sub = dialogRef.componentInstance.onPerformAction.subscribe(() => {

    console.log ('must cancel post');
    this.deletePost(this.post);

  });

  dialogRef.afterClosed().subscribe(() => {
    dialogRef.componentInstance.onPerformAction.unsubscribe();
  // unsubscribe onAdd
  });

  }
  
  
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
    this.blog = null;
    this.post = null;
    this.dataSource.data = null;

    console.log ('logging out');
    this.userService.signOut();
  }

  public selectBlog(id : string) {

 
    console.log('loading blog for: '+id);
    this.blog = this.getBlog(id);
    this.post = null;
    this.postIndex = 0;
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

         this.posts = res;
         
          this.dataSource = new MatTableDataSource(res.items);

            this.bs.getPost(this.userService.getToken(),id,this.posts.items[0].id).subscribe ((res1)=> {
              console.log('loaded post: '+res1.id);
              this.post = res1;
              this.postIndex = 0;
              this.safePostContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);

            })
        });

    }

    public gotoPreviousPost ()
    {
      if (this.postIndex>0)
      {
        console.log('previous post');
        this.postIndex -=1;
        this.bs.getPost(this.userService.getToken(),this.blog.id,this.posts.items[this.postIndex].id).subscribe ((res1)=> {
          console.log('loaded post: '+res1.id);
          this.post = res1;
          this.safePostContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);

        })
      }

    }

    public gotoNextPost ()
    {
      if (this.postIndex < this.posts.items.length)
      {
        console.log('next post');
        this.postIndex +=1;
        this.bs.getPost(this.userService.getToken(),this.blog.id,this.posts.items[this.postIndex].id).subscribe ((res1)=> {
          console.log('loaded post: '+res1.id);
          this.post = res1;
          this.safePostContent = this.sanitizer.bypassSecurityTrustHtml(this.post.content);

        })
      }

    }

    swipeCard(action: string) {
      
      console.log ('swiping '+action);

      if (action === this.SWIPE_ACTION.RIGHT) {
         this.gotoNextPost();
      }

      // swipe left, previous avatar
      if (action === this.SWIPE_ACTION.LEFT) {
          this.gotoPreviousPost();
      }

      this._editCurrentPost = false;

  }

  editCurrentPost ()
  {
    console.log ('editing current post');
    this._editCurrentPost = true;
    
  }

    public updatePost (post: PostWithContent) {

      if (this.post.id != null && this.post.id !=  "")
      {

      console.log('starting to update post: '+post.id);
      
      this.bs.updatePost(this.userService.getToken(),post).subscribe((res=>{
        this.snackBar.open('succesfully updated post', null, {
          duration: 2000,
        });
        console.log(res);
  

        this.getPosts (this.blog.id,this.blog.posts.totalItems);

      }));
      }
      else
      {

        console.log('starting to create new post: ');
      
        this.bs.createPost(this.userService.getToken(),post).subscribe((res=>{
        this.snackBar.open('succesfully created post', null, {
          duration: 2000,
        });
        console.log(res);
  

        this.getPosts (this.blog.id,this.blog.posts.totalItems);

      }));

      }

      
    }

    public deletePost (post : PostWithContent) {

     
      console.log('starting to delete post: '+post.id);
      
      this.bs.deletePost(this.userService.getToken(),post).subscribe((res=>{
        this.snackBar.open('succesfully deleted post', null, {
          duration: 2000,
        });
        console.log(res);
  
        this.post = null;
        this.getPosts (this.blog.id,this.blog.posts.totalItems);

      }));
      
    }

    public getPost(id: string,postId: string) {

          console.log ('loading post');
           this.bs.getPost(this.userService.getToken(),id,postId).subscribe ((res)=>{
            this.post = res;
            console.log (this.post);
     
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

      public createNewPost ()
      {

        this.post = {
          author: {id:"",
          displayName:"",
          url:""},
          id: "",
          published:"",
          updated:"",
          url:"",
          selfLink:"",
          kind: "blogger#post",
          title: "",
          content: "" ,
          replies: {totalItems:0,selfLink:""},
          blog: <Blog>{id:this.blog.id}
          };

          this.selectedRowIndex = -1;

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

@Component({
  selector: 'dialog-modify-post',
  templateUrl: 'dialog-modify-post.html',
})
export class PerformActionDialog {

  action: string;

  constructor(

    private dialogRef: MatDialogRef<AppComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.action = data.action;

  }

    onPerformAction = new EventEmitter();

    cancelAction(): void {
      console.debug ('not performing action');
      this.dialogRef.close();
    }

    performAction(): void {
      console.debug ('performing action');
      this.onPerformAction.emit();
      this.dialogRef.close();
    
  }

}




