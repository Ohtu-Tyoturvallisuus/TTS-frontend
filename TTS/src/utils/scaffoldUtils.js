import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

export const useScaffoldItems = () => {
  const { t } = useTranslation();

  const scaffoldBundle = i18next.getResourceBundle('en', 'translation') || {};
  const scaffoldKeys = Object.keys(scaffoldBundle.scaffoldTypes || {});

  return scaffoldKeys.map((key) => ({
    id: key,
    name: t(`scaffoldTypes.${key}`),
  }));
};

