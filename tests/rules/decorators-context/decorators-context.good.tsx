@Component({ tag: 'sample-tag' })
export class SampleTag {

  @Prop() test?: string;

  @Prop() 
  get testGetter() {
    return 'getter';
  }

  @Element() element!: HTMLElement;

  @Method()
  async someMethod() {
    return 'method';
  }

  @Listen('eventSuccess')
  @Watch('test')
  watchForTest() {
    console.log('watch', this.test);
  }

  render() {
    return (<div>test</div>);
  }
}
