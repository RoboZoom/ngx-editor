import {
  Component, ElementRef, HostBinding,
  HostListener, Input, OnDestroy, OnInit
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { asyncScheduler, fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import Editor from '../../../Editor';
import Icon from '../../../icons';
import { TBItems } from '../../../types';
import { SanitizeHtmlPipe } from '../../../pipes/sanitize/sanitize-html.pipe';
import { ToggleCommands } from '../MenuCommands';

interface BubblePosition {
  bottom: number;
  left: number;
}

@Component({
  selector: 'ngx-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent implements OnInit, OnDestroy {
  @Input() editor: Editor;
  @HostBinding('style') get display(): Partial<CSSStyleDeclaration> {
    if (!this.showMenu) {
      return {
        visibility: 'hidden'
      };
    }

    return {
      visibility: 'visible',
      bottom: this.posBottom + 'px',
      left: this.posLeft + 'px',
    };
  }

  private posLeft = 0;
  private posBottom = 0;
  private showMenu = false;
  private updateSubscription: Subscription;
  private dragging = false;
  private resizeSubscription: Subscription;
  execulableItems: TBItems[] = [];
  activeItems: TBItems[] = [];

  private get view(): EditorView {
    return this.editor.view;
  }

  constructor(private el: ElementRef<HTMLElement>, private sanitizeHTML: SanitizeHtmlPipe) { }

  @HostListener('document:mousedown') onMouseDown(): void {
    this.dragging = true;
  }

  @HostListener('document:keydown') onKeyDown(): void {
    this.dragging = true;
  }

  @HostListener('document:mouseup') onMouseUp(): void {
    this.dragging = false;
    this.useUpdate();
  }

  @HostListener('document:keyup') onKeyUp(): void {
    this.dragging = false;
    this.useUpdate();
  }

  private useUpdate(): void {
    if (!this.view) {
      return;
    }
    this.update(this.view);
  }

  get toolbar(): TBItems[][] {
    return [
      ['bold', 'italic', 'underline', 'strike'],
      ['ordered_list', 'bullet_list', 'blockquote', 'code']
    ];
  }

  get toggleCommands(): TBItems[] {
    return [
      'bold', 'italic', 'underline', 'strike',
      'ordered_list', 'bullet_list', 'blockquote', 'code'
    ];
  }

  getIcon(name: TBItems): SafeHtml {
    const icon = Icon.getPath(name);
    return this.sanitizeHTML.transform(icon);
  }

  private calculateBubblePosition(view: EditorView): BubblePosition {
    const { state: { selection } } = view;
    const { from } = selection;

    const bubble = this.el.nativeElement;

    const start = view.coordsAtPos(from);

    // The box in which the tooltip is positioned, to use as base
    const box = view.dom.getBoundingClientRect();

    let left = start.left - box.left;

    const overflowsRight = (
      box.right < (start.left + bubble.getBoundingClientRect().width) ||
      bubble.getBoundingClientRect().right > box.right
    );

    if (overflowsRight) {
      left = box.width - bubble.getBoundingClientRect().width;
    }

    if (left < 0) {
      left = 0;
    }

    return {
      left,
      bottom: box.bottom - start.top
    };
  }

  private update(view: EditorView): void {
    const { state } = view;
    const { selection } = state;
    const { empty } = selection;

    if (selection instanceof NodeSelection) {
      if (selection.node.type.name === 'image') {
        this.showMenu = false;
        return;
      }
    }

    const hasFocus = this.view.hasFocus();

    if (!hasFocus || empty || this.dragging) {
      this.showMenu = false;
      return;
    }

    const { bottom, left } = this.calculateBubblePosition(this.view);

    this.posLeft = left;
    this.posBottom = bottom;
    this.showMenu = true;
  }

  onClick(e: MouseEvent, commandName: TBItems): void {
    e.preventDefault();
    if (e.button !== 0) {
      return;
    }

    const { state, dispatch } = this.view;

    const command = ToggleCommands[commandName];
    command.toggle()(state, dispatch);

    this.showMenu = false;
  }

  private findActiveAndDisabledItems(view: EditorView): void {
    this.activeItems = [];
    this.execulableItems = [];
    const { state } = view;

    this.toggleCommands.forEach(toolbarItem => {
      const command = ToggleCommands[toolbarItem];

      const isActive = command.isActive(state);
      if (isActive) {
        this.activeItems.push(toolbarItem);
      }

      const canExecute = command.canExecute(state);

      if (canExecute) {
        this.execulableItems.push(toolbarItem);
      }
    });
  }


  ngOnInit(): void {
    this.updateSubscription = this.editor.update
      .subscribe((view) => {
        this.update(view);
        this.findActiveAndDisabledItems(view);
      });

    this.resizeSubscription = fromEvent(window, 'resize').pipe(
      throttleTime(500, asyncScheduler, { leading: true, trailing: true })
    ).subscribe(() => {
      this.useUpdate();
    });
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
    this.resizeSubscription.unsubscribe();
  }
}