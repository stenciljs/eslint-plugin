@Component({ tag: 'sample-tag' })
export class SampleTag {

  @Method() test?: string;

  @Watch() element!: HTMLElement;

  @Component({ tag: 'sample-tag' })
  @Prop()
  async someMethod() {
    return 'method';
  }

  @Element()
  watchForTest() {
    console.log('watch', this.test);
  }

  render() {
    return (<div>test</div>);
  }
}
