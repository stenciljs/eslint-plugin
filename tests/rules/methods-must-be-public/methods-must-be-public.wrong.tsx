@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  private async someMethod() {
    return 'method';
  }

  @Method()
  protected async someMethod2() {
    return 'method2';
  }

  render() {
    return (<div>test</div>);
  }
}
