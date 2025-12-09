import { provideRouter, Routes, withHashLocation } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
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
export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
            { path: 'user/user-edit', component: UserEditComponent },
            { path: 'no-access', component: NoAccessComponent },
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
    { path: 'settings', component: SettingComponent },
    { path: 'explor', component: ExploreComponent },
    { path: 'chat', component: Chat },
    { path: 'navbar', component: NavbarComponent },
    { path: 'footer', component: FooterComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];