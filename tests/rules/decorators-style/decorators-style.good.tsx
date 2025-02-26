@Component({ tag: 'sample-tag' })
export class SampleTag {

  @Prop({ mutable: true }) test?: string;

  @Element() element!: HTMLElement;

  @Method()
  async someMethod() {
    return 'method';
  }

  @Listen('eventSuccess')
  @Watch('test')
  @Watch('test2')
  @Watch('test3')
  @Watch('test4')
  watchForTest() {
    console.log('watch', this.test);
  }

  render() {
    return (<div>test</div>);
  }
}
