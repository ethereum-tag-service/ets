const formatters = {
  en: new Intl.NumberFormat("en-EN"),
  es: new Intl.NumberFormat("es-ES"),
};

module.exports = {
  locales: ['en', 'es'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/404': ['error'],
  },
  interpolation: {
    format: (value, format, lang) => {
      if (format === 'number') return formatters[lang].format(value);
      return value;
    }
  }
}
