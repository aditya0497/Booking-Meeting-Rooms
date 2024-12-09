import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from './components/booking/booking.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MeetingService } from './services/meeting.service';
import { HttpClientModule } from '@angular/common/http';
import { TitleCasePipe } from '../title-case.pipe';


@NgModule({
  declarations: [
    AppComponent,
    BookingComponent,
    DashboardComponent,
    LoginComponent,
    TitleCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [
    BookingComponent,
    DashboardComponent,
    LoginComponent
  ],
  providers: [MeetingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
