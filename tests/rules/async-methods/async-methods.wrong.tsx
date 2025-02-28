@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  someMethod() {
    return 'method';
  }

  render() {
    return (<div>test</div>);
  }
}
