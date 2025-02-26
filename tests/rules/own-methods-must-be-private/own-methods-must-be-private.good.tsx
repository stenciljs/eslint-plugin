@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() readonly test?: string;
  @Prop({ mutable: true }) testMutable?: string;

  private internalMethod() {
    return 'ok';
  }

  @OwnDecorator()
  private internalDecoratedMethod() {
    return 'ok';
  };

  render() {
    return (<div>test</div>);
  }
}
