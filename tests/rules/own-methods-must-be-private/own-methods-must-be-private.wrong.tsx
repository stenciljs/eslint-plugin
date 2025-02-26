@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() readonly test?: string;
  @Prop({ mutable: true }) testMutable?: string;

  internalMethod() {
    return 'ok';
  }

  public internalMethod2() {
    return 'ok';
  }

  @OwnDecorator()
  internalDecoratedMethod() {
    return 'ok';
  };

  @OwnDecorator()
  public internalDecoratedMethod2() {
    return 'ok';
  };

  render() {
    return (<div>test</div>);
  }
}
