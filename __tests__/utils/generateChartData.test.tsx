import fs from 'fs';
import { parse, Parser } from "csv-parse/.";

const years = ['1990','2000','2005','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019']

describe('#generateChartData', () => {
    it('Should parse the csv file', async () => {
        const parser = fs
            .createReadStream('resources/emissions_per_municipality.csv')
            .pipe(parse({
                from_line: 8,
                delimiter: ';',
            }))

            const data = await generateChartData('Norrbottens län', 'Arjeplog', parser);
            const chartJsData = {
                data: {
                    datasets: { data: data },
                    labels: years
                }
            }

            console.log(JSON.stringify(chartJsData));
    });
});

async function generateChartData(county: string, city: string, parser: Parser, scaleX = 10) {
    for await (const record of parser) {
        if (record[3] == city && record[2] == county) {
            return record.slice(4).map((data:string, i:number) => {
                return [i * scaleX, parseFloat(data.replace(',','.'))]
            }).flat();
        }    
    }
}