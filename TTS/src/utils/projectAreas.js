import { useTranslation } from 'react-i18next';

const getProjectAreas = () => {
    const { t } = useTranslation();

    return [
    [t('projectlist.chooseAll'), ""],
    ["Kataja Event", "3100"],
    ["Kattilaryhmä", "AL21"],
    ["Etelä-Suomi", "AL31"],
    ["Kilpilahti", "AL32"],
    ["Länsi-Suomi", "AL34"],
    ["Lounais-Suomi", "AL35"],
    ["Sisä-Suomi", "AL41"],
    ["Pohjanmaa", "AL50"],
    ["Keski-Suomi", "AL51"],
    ["Kaakkois-Suomi", "AL52"],
    ["Itä-Suomi", "AL53"],
    ["Pohjois-Suomi", "AL54"],
    ["Hallinto", "AL90"],
    ["Tuotemyynti", "AL91"],
    ["AS Telinekataja (Event)", "EVENT"],
    ["AS Telinekataja (Scaf)", "SCAF"]
  ];
};
  
export default getProjectAreas;