export interface InputChangeArgs {
  name: string;
  value: string;
}
export interface RowInputChangeArgs extends InputChangeArgs {
  index: number;
}
export interface CheckedChangeArgs {
  name: string;
  checked: boolean;
}
export interface SelectOptionItemModel {
  value: string;
  text: string;
}
export interface KeywordOptionItemModel extends SelectOptionItemModel {
  keywords: string;
}
export interface SimpleDropDownListChangeArgs {
  name: string;
  value: string;
  item: SelectOptionItemModel;
}
