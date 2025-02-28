@Component({ tag: 'sample-tag' })
export class SampleTag {
  constructor() {
    console.log("🚀");
  }

  @Prop() sampleProp?: string;

  @Method() async sampleMethod(): Promise<void> {}

  render() {
    return (<div>test</div>);
  }
}
