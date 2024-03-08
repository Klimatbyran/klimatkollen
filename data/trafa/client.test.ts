import { TRAFA_BASE_URL, TrafaClientImpl } from "./client";

describe('TrafaClientImpl', () => {
  let client: TrafaClientImpl;

  beforeEach(() => {
    client = new TrafaClientImpl();
  });


  it('should set year correctly', () => {
    expect(client.year).toEqual([]);
  });

  it('should set measure correctly', () => {
    expect(client.measure).toBe('itrfslut');
  });

  it('should set fuel correctly', () => {
    expect(client.fuel).toEqual([]);
  });

  it('should set target correctly', () => {
    expect(client.target).toBe('t10016');
  });

  it('should set year using setYear method', () => {
    client.setYear('2020,2021');
    console.log(client.year);
    expect(client.year).toEqual([2020, 2021]);
  });

  it('should set measure using setMeasure method', () => {
    client.setMeasure("avregunder");
    expect(client.measure).toBe('avregunder');
  });

  it('should set fuel using setFuel method', () => {
    client.setFuel(["bensin", 'el']);
    expect(client.fuel).toEqual(['bensin', 'el']);
  });

  it('should set target using setTarget method', () => {
    client.setTarget("Personbilar(LÄN)");
    expect(client.target).toBe('t10026'); // Assuming 'Some Target' maps to 't10026'
  });

  it('should build URL correctly without fuel', () => {
    const url = client.build();
    expect(url).toBe(`${TRAFA_BASE_URL}t10016|ar|itrfslut`	);
  });

  it('should build URL correctly with fuel', () => {
    client.setFuel(["el"]);
    const url = client.build();
    expect(url).toBe(`${TRAFA_BASE_URL}t10016|ar|itrfslut|drivm:el`);	
  });

  it('should throw error when building URL with invalid target and fuel', () => {
    client.setTarget("Personbilar(LÄN)");
    client.setFuel(["el"]);
    expect(() => client.build()).toThrow('fuel types cannot be used with chosen target');
  });
});