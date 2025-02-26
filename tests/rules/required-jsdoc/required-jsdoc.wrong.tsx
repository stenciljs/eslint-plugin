@Component({ tag: 'sample-tag' })
export class SampleTag {

  // This is not a comment
  @Prop() readonly test?: string;

  /**
   * This is an invalid comment
   * @type string
   */
  @Prop() readonly test2?: string;

  /**
   * This is an invalid comment
   * @memberOf SampleTag
   */
  @Prop() readonly test3?: string;

  @Method()
  async testMethod(test?: string) {
    return test;
  }

  @Method()
  async testMethod2() {
    return 'test';
  }

  @Event() myEvent!: CustomEvent;

  render() {
    return (<div>test</div>);
  }
}
