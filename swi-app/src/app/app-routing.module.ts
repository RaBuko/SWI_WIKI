import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthorsComponent } from './authors/authors.component';


const routes: Routes = [
  { path: 'advanced', component: ResultsComponent },
  { path: '', component: MainPageComponent },
  { path: 'simple', component: MainPageComponent },
  { path: 'authors', component: AuthorsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
