import { Component, Input } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Posts} from '../app/service/BloggerService'

@Component({
  selector: 'post-carousel',
  templateUrl: './post-carousel.html',
  providers: [PostCarouselConfig]  // add NgbCarouselConfig to the component providers
})
export class PostCarouselConfig {


    @Input () posts: Posts;
    
  showNavigationArrows = true;
  showNavigationIndicators = true;

  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;

  }
}
