import getProjectAreas from '@utils/projectAreas';

describe('getProjectAreas', () => {
  it('should return a non-empty array', () => {
    const projectAreas = getProjectAreas();
    expect(Array.isArray(projectAreas)).toBe(true);
    expect(projectAreas.length).toBeGreaterThan(0);
  });

  it('should contain expected project areas with correct keys', () => {
    const projectAreas = getProjectAreas();

    const expectedAreas = [
      ["AS Telinekataja (Event)", "EVENT"],
      ["AS Telinekataja (Scaf)", "SCAF"],
      ["Etelä-Suomi", "AL31"],
      ["Hallinto", "AL90"],
      ["Itä-Suomi", "AL53"],
      ["Kaakkois-Suomi", "AL52"],
      ["Kataja Event", "3100"],
      ["Kattilaryhmä", "AL21"],
      ["Keski-Suomi", "AL51"],
      ["Kilpilahti", "AL32"],
      ["Länsi-Suomi", "AL34"],
      ["Lounais-Suomi", "AL35"],
      ["Pohjanmaa", "AL50"],
      ["Pohjois-Suomi", "AL54"],
      ["Sisä-Suomi", "AL41"],
      ["Tuotemyynti", "AL91"]
    ];

    expectedAreas.forEach((area) => {
      expect(projectAreas).toContainEqual(area);
    });
  });

  it('should have all entries as arrays of length 2', () => {
    const projectAreas = getProjectAreas();

    projectAreas.forEach((area) => {
      expect(Array.isArray(area)).toBe(true);
      expect(area.length).toBe(2);
    });
  });

  it('should not contain duplicate entries', () => {
    const projectAreas = getProjectAreas();

    const uniqueAreas = new Set(projectAreas.map(JSON.stringify));
    expect(uniqueAreas.size).toBe(projectAreas.length);
  });
});
