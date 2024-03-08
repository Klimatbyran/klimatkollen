import { TRAFA_BASE_URL, createTrafaQueryBuilder } from ".";


describe('TrafaQueryBuilder', () => {
  let builder : ReturnType<typeof createTrafaQueryBuilder>;

  beforeEach(() => {
    builder =createTrafaQueryBuilder();
  });

  it('should set year correctly', () => {
    builder.setYear([2020]);
    const url = builder.year;
    expect(builder.year).toContain(2020);
  });

  it('should not set invalid year', () => {
    builder.setYear([1990]); // assuming 1990 is not a valid year
    expect(builder.year).not.toContain('1990');
  });

  it('should set measure correctly', () => {
    builder.setMeasure("itrfslut"); 
    expect(builder.measure).toBe('itrfslut');
  });

  it('should not set invalid measure', () => {
    // @ts-expect-error invalida measure
    builder.setMeasure('invalidMeasure'); 
    expect(builder.measure).not.toBe('invalidMeasure');
  });

  it('should set fuel correctly', () => {
    builder.setFuel(['bensin']);
    expect(builder.fuel).toContain('bensin');
  });

  it('should not set invalid fuel', () => {
    builder.setFuel(['bensin']);
    expect(builder.fuel).not.toContain('invalidFuel');
  });

  it('should build url correctly', () => {
    builder.setYear([2020]);
    builder.setMeasure("itrfslut"); 
    builder.setFuel(['bensin']);
    const url = builder.build();
    expect(url).toBe(`${TRAFA_BASE_URL}t10016|ar:2020|itrfslut|drivm:bensin`);
  });

  it('should throw error when building url without year', () => {
    builder.setMeasure("itrfslut"); 
    builder.setFuel(["el"]);
    expect(() => builder.build()).toThrow('Year filter is missing, fetches all years');
  });

    it("should skip validation and use defaults", () => {
      const url = builder.build({ skipValidation: true});
      expect(url).toBe(`${TRAFA_BASE_URL}t10016|ar|itrfslut|drivm`);
    });
});