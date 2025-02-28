@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() private testPrivate?: string;
  @Prop() protected testProtected?: string;

  private someFn() {
    return 'test';
  }

  render() {
    return (<div>test</div>);
  }
}
