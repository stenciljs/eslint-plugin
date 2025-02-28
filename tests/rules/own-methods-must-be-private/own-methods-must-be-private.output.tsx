@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() readonly test?: string;
  @Prop({ mutable: true }) testMutable?: string;

  private internalMethod() {
    return 'ok';
  }

  private internalMethod2() {
    return 'ok';
  }

  @OwnDecorator()
  private internalDecoratedMethod() {
    return 'ok';
  };

  @OwnDecorator()
  private internalDecoratedMethod2() {
    return 'ok';
  };

  render() {
    return (<div>test</div>);
  }
}
