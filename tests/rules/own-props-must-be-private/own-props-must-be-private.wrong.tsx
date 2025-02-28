@Component({ tag: 'sample-tag' })
export class SampleTag {
  internalProp: string;

  public internalProp2 = 1;

  @OwnDecorator()
  public internalDecoratedProp: string;

  @OwnDecorator()
  internalDecoratedProp2: string;

  @Prop() readonly test?: string;

  @Prop({ mutable: true }) testMutable?: string;


  render() {
    return (<div>test</div>);
  }
}
