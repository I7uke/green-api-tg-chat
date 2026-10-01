export type Styles = {
  'componentContainer': string;
  'contentContainer': string;
  'header': string;
  'headerTitle': string;
  'linkBack': string;
  'logOut': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
