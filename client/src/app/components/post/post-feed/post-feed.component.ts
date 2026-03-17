import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { Post } from '../../../models/post.model';

@Component({
    selector: 'app-feed',
    standalone: true,
    imports: [CommonModule, DatePipe, RouterLink],
    templateUrl: './post-feed.component.html',
    styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements OnInit {

    posts: Post[] = [];
    loading = true;
    expandedPosts = new Set<number>();

    constructor(private postService: PostService) { }

    ngOnInit(): void {
        this.loadPosts();
    }

    loadPosts() {
        this.loading = true;

        this.postService.getFeed().subscribe({
            next: res => {
                this.posts = res;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    trackByPost(index: number, post: Post) {
        return post.id;
    }

    toggleExpand(id: number) {
        if (this.expandedPosts.has(id)) {
            this.expandedPosts.delete(id);
        } else {
            this.expandedPosts.add(id);
        }
    }

    isExpanded(id: number) {
        return this.expandedPosts.has(id);
    }

    getRelativeTime(date: string) {
        const now = new Date();
        const past = new Date(date);
        const diff = (now.getTime() - past.getTime()) / 1000;

        if (diff < 60) return "now";
        if (diff < 3600) return Math.floor(diff / 60) + "m";
        if (diff < 86400) return Math.floor(diff / 3600) + "h";
        return Math.floor(diff / 86400) + "d";
    }

}