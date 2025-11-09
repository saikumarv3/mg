import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'r-button',
  styleUrl: 'r-button.css',
  shadow: true,
})
export class RButton {
  @Prop() variant: 'primary' | 'secondary' | 'outline' = 'primary';
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';
  @Prop() disabled: boolean = false;
  @Prop() type: 'button' | 'submit' | 'reset' = 'button';

  @Event() rClick!: EventEmitter<MouseEvent>;

  private handleClick = (event: MouseEvent) => {
    if (!this.disabled) {
      this.rClick.emit(event);
    }
  };

  render() {
    const baseClass = 'r-button';
    const variantClass = `${baseClass}--${this.variant}`;
    const sizeClass = `${baseClass}--${this.size}`;

    return (
      <button
        class={`${baseClass} ${variantClass} ${sizeClass}`}
        disabled={this.disabled}
        type={this.type}
        onClick={this.handleClick}
      >
        <slot></slot>
      </button>
    );
  }
}

