import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { QuestionsListComponent } from './pages/questions-list/questions-list.component';
import { QuestionDetailComponent } from './pages/question-detail/question-detail.component';
import { AskQuestionComponent } from './pages/ask-question/ask-question.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { InicioComponent } from './pages/inicio/inicio.component'; 
import { AuthGuard } from './services/auth.guard';
import { TagComponent } from './pages/tag/tag.component';

export const appRoutes: Routes = [
  { 
    path: '', 
    component: InicioComponent, 
    title: 'Inicio' 
  },
  { 
    path: 'login', 
    component: LoginComponent, 
    title: 'Login' 
  },
  { 
    path: 'register', 
    component: RegisterComponent, 
    title: 'Registro' 
  },
  { 
    path: 'questions', 
    component: QuestionsListComponent, 
    title: 'Preguntas' // Pública
  },
  { 
    path: 'tag', 
    component: TagComponent, 
    title: 'Etiquetas Globales' // Pública
  },
  { 
    path: 'question/:id', 
    component: QuestionDetailComponent, 
    title: 'Detalle Pregunta' // Pública
  },
  // Rutas protegidas (requieren autenticación)
  { 
    path: 'ask', 
    component: AskQuestionComponent,
    canActivate: [AuthGuard], 
    title: 'Nueva Pregunta'
  },
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard], 
    title: 'Perfil'
  },
  { 
    path: '**', 
    component: NotFoundComponent, 
    title: 'No Encontrado' 
  }
];