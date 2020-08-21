import {
  formatDate,
  formatTime,
  formatRelative,
  formatNumber,
  formatPlural,
  formatMessage,
  formatHTMLMessage
} from 'umi-plugin-react/locale';

function i18nMessage(message: string, values?: { [key: string]: string | number }): string {
  return formatMessage({id: message}, values);
}

export {
  i18nMessage,
};
