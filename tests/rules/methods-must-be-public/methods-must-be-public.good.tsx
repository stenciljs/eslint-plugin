@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  async someMethod() {
    return 'method';
  }

  render() {
    return (<div>test</div>);
  }
}
