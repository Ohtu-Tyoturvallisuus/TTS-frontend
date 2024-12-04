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
      ["Etelä-Suomi", "AL31"],
      ["Kilpilahti", "AL32"],
      ["Länsi-Suomi", "AL34"],
      ["Lounais-Suomi", "AL35"],
      ["Sisä-Suomi", "AL41"],
      ["Kaakkois-Suomi", "AL52"],
      ["Keski-Suomi", "AL51"],
      ["Pohjanmaa", "AL50"],
      ["Itä-Suomi", "AL53"],
      ["Pohjois-Suomi", "AL54"],
      ["Kattilaryhmä", "AL21"],
      ["AS Telinekataja SCAF", "SCAF"],
      ["AS Telinekataja EVENT", "EVENT"],
      ["Hallinto", "AL90"],
      ["Kataja Event", "3100"]
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
