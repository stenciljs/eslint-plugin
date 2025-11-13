@Component({ tag: 'test-stencil' })
export class ExampleComponent {
  @Prop({ mutable: true }) value?: string;

  update() {
    this.value = 'next';
  }
}

