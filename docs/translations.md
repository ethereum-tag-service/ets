# Translations

The `apps/app` app uses [next-translate](https://github.com/vinissimus/next-translate) for i18n.

Translation files are located in the `apps/app/locales` directory.

To create a new translation, you'll need to:

- Copy the `en` translation directory inside `apps/app/locales` to the desired language and update the strings to reflect the language.
- Update `apps/app/i18n.js` to include the new locale (update both the locales and formatters)
- Update the `react-timeago` hook inside `apps/app/hooks/useTimeAge.js` to include the new locale from the included `react-timeago` locales or create a new one and import it if the language file does not exist

In order to access different translations of the app, you'll change the URL. For example, if we had Spanish setup (we have an example Spanish translation currently setup), we'd be able to access the Spanish app via [app.ets.xyz/es](https://app.ets.xyz/es). You can read more about internationalized routing in Next.js here: [nextjs.org/docs/advanced-features/i18n-routing](https://nextjs.org/docs/advanced-features/i18n-routing)

The Next.js [Link](https://nextjs.org/docs/api-reference/next/link) component automatically prepends the active locale to links.
