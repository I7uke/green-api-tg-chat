export type Styles = {
  'buttonContainer': string;
  'chatContainer': string;
  'chatMessage': string;
  'chatMessageIncoming': string;
  'chatMessageOutgoing': string;
  'chatMessages': string;
  'inputContainer': string;
  'inputMessage': string;
  'messageContainer': string;
  'messageContainerIncoming': string;
  'messageContainerOutgoing': string;
  'messageDateContainer': string;
  'sendButton': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
