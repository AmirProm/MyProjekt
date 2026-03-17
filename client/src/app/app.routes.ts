import { provideRouter, Routes } from '@angular/router';
import { HomeGuestComponent } from './components/home-guest/home-guest.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './guards/auth.guard';
import { authLoggedInGuard } from './guards/auth-logged-in.guard';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { NoAccessComponent } from './components/errors/no-access/no-access.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';
import { Chat } from './components/chat/chat.component';
import { ExploreComponent } from './components/explor/explor.component';
import { SettingComponent } from './components/setting/setting.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MemberProfileComponent } from './components/member-profile/member-profile.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { termsComponent } from './components/terms/terms.component';
import { PostCreateComponent } from './components/post/post-create/post-create.component';
import { PostFeedComponent } from './components/post/post-feed/post-feed.component';

export const routes: Routes = [
    {

        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'members/:username', component: MemberProfileComponent },
            { path: 'user/user-edit', component: UserEditComponent },
            { path: 'terms', component: termsComponent },
            { path: 'no-access', component: NoAccessComponent },
            { path: 'settings', component: SettingComponent },
            { path: 'admin', component: AdminPanelComponent },
            // { path: 'explor', component: ExploreComponent },
            { path: 'members', component: MemberListComponent },
            { path: "explor", component: PostFeedComponent },
            { path: 'post', component: PostCreateComponent },
            { path: 'member-details/:userName', component: MemberDetailsComponent },
            { path: 'chat', component: Chat },
        ]
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authLoggedInGuard],
        children: [
            { path: 'account/login', component: LoginComponent },
            { path: 'account/register', component: RegisterComponent },


        ]
    },


    { path: 'home', component: HomeGuestComponent },
    { path: 'navbar', component: NavbarComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];