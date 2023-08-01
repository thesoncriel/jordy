export interface InputChangeArgs {
  name: string;
  value: string;
}
export interface RowInputChangeArgs extends InputChangeArgs {
  index: number;
}
export interface CheckedChangeArgs extends InputChangeArgs {
  checked: boolean;
}
export interface SelectOptionItemUiState {
  value: string;
  text: string;
}
export interface KeywordOptionItemUiState extends SelectOptionItemUiState {
  keywords: string;
}
export interface SimpleDropDownListChangeArgs {
  name: string;
  value: string;
  item: SelectOptionItemUiState;
}
