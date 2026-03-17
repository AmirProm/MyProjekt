import { Component } from '@angular/core';
import { PostService } from '../../../services/post.service';
import { FormsModule } from '@angular/forms';

@Component({
    imports: [FormsModule],
    selector: 'app-create-post',
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {

    caption = '';

    constructor(private postService: PostService) { }

    create() {

        if (!this.caption.trim()) return;

        this.postService.createPost(this.caption).subscribe({
            next: () => {
                this.caption = '';
                location.reload();
            }
        });

    }

}