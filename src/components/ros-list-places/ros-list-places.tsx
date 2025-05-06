import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ros-list-places',
  styleUrl: 'ros-list-places.css',
  shadow: true,
})
export class RosListPlaces {
  render() {
    return (
      <Host>
        <slot>
          Hey man
        </slot>
      </Host>
    );
  }
}
