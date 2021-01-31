import {
  Component, ViewChild, ElementRef,
  forwardRef, OnDestroy, ViewEncapsulation,
  OnInit, Output, EventEmitter,
  Input, Renderer2, SimpleChanges, OnChanges,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  editable as editablePlugin,
  placeholder as placeholderPlugin
} from 'ngx-editor/plugins';

import { toHTML } from './parsers';
import Editor from './Editor';

@Component({
  selector: 'ngx-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxEditorComponent),
    multi: true
  }],
  encapsulation: ViewEncapsulation.None
})

export class NgxEditorComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  constructor(private renderer: Renderer2) { }

  @ViewChild('ngxEditor', { static: true }) ngxEditor: ElementRef;

  @Input() editor: Editor;
  @Input() outputFormat: 'doc' | 'html';
  @Input() placeholder = 'Type Here...';
  @Input() enabled = true;

  @Output() focusOut = new EventEmitter<void>();
  @Output() focusIn = new EventEmitter<void>();

  private subscriptions: Subscription[] = [];
  private onChange: (value: Record<string, any> | string) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: Record<string, any> | string | null): void {
    if (!this.outputFormat && typeof value === 'string') {
      this.outputFormat = 'html';
    }

    this.editor.setContent(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private handleChange(jsonDoc: Record<string, any>): void {
    if (this.outputFormat === 'html') {
      const html = toHTML(jsonDoc, this.editor.schema);
      this.onChange(html);
      return;
    }

    this.onChange(jsonDoc);
  }

  private setMeta(key: string, value: any): void {
    const { dispatch, state: { tr } } = this.editor.view;
    dispatch(tr.setMeta(key, value));
  }

  private enable(): void {
    this.setMeta('UPDATE_EDITABLE', true);
  }

  private disable(): void {
    this.setMeta('UPDATE_EDITABLE', false);
  }

  private setPlaceholder(placeholder: string): void {
    this.setMeta('UPDATE_PLACEHOLDER', placeholder);
  }

  private registerPlugins(): void {
    this.editor.registerPlugin(editablePlugin(this.enabled));
    this.editor.registerPlugin(placeholderPlugin(this.placeholder));
  }

  ngOnInit(): void {
    if (!this.editor) {
      throw new Error('NgxEditor: Required editor instance');
    }

    this.registerPlugins();

    this.renderer.appendChild(this.ngxEditor.nativeElement, this.editor.el);

    const contentChangeSubscription = this.editor.valueChange.subscribe(jsonDoc => {
      this.handleChange(jsonDoc);
    });

    const blurSubscription = this.editor.blur.subscribe(() => {
      this.focusOut.emit();
      this.onTouched();
    });

    const focusScbscription = this.editor.focus.subscribe(() => {
      this.focusIn.emit();
    });

    this.subscriptions.push(
      contentChangeSubscription,
      blurSubscription,
      focusScbscription
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.placeholder && !changes.placeholder.isFirstChange()) {
      this.setPlaceholder(changes.placeholder.currentValue);
    }

    if (changes?.enabled && !changes.enabled.isFirstChange()) {
      if (!changes.enabled.currentValue) {
        this.disable();
      } else {
        this.enable();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
