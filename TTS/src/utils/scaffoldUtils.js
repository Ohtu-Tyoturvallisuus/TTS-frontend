import { useTranslation } from 'react-i18next';
import scaffoldings from '@constants/scaffoldTypes.json';

export const useScaffoldItems = () => {
  const { t } = useTranslation();

  return scaffoldings.scaffoldTypes.map((key) => ({
    id: key,
    name: t(`scaffoldTypes.${key}`),
  }));
};

