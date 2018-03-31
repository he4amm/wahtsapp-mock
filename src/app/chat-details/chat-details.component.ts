import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.css']
})
export class ChatDetailsComponent implements OnInit, OnChanges {
  @Input('chatDetails') chatDetails: any;
  @Output() mobileBackAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addMessageInChat: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  message: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    // scroll bottom every time chat details change
    if (changes['chatDetails']) {
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  isFirstInRowSender(index) {
    if (!this.chatDetails.messages[index - 1]) { return true; }

    const prevItem = this.chatDetails.messages[index - 1].sender;
    const currentItem = this.chatDetails.messages[index].sender;

    return currentItem !== prevItem;
  }

  isFirstInRowDate(index) {
    if (!this.chatDetails.messages[index - 1]) { return true; }

    const prevItem = this.formatDateFromNow(this.chatDetails.messages[index - 1].date);
    const currentItem = this.formatDateFromNow(this.chatDetails.messages[index].date);

    return currentItem !== prevItem;
  }

  formatDateFromNow(date) {
    return moment(date).calendar(null, {
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      lastWeek: 'dddd',
      nextWeek: 'dddd',
      sameElse: 'L'
    });
  }

  sendMessage() {
    // if message is empty terminate
    if (!this.message) { return; }

    this.addMessageInChat.next([
      {
        sender: 'me',
        date: new Date,
        text: this.message,
        status: 'sent',
        attachment: {
          type: '',
          link: ''
        }
      },
      {
        id: this.chatDetails.id
      }
    ]);

    this.message = '';
  }

  goBack() {
    this.mobileBackAction.next(false);
  }

}
