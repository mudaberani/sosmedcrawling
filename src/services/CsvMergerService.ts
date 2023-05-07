import fs from 'fs';
import path from 'path';
import { parse, ParseResult } from 'papaparse';

class CsvMergerService {
  private static async readAndParseCsv(filePath: string): Promise<ParseResult<object>> {
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });
  }

  public static async mergeCsvFiles(sourceDir: string, name: string, outputDir: string): Promise<void> {
    const csvFiles = (await fs.promises.readdir(sourceDir)).filter((file) => file.startsWith(name) && file.endsWith('.csv'));

    let mergedData: any[] = [];

    for (const file of csvFiles) {
      const filePath = path.join(sourceDir, file);
      const parsedCsv = await this.readAndParseCsv(filePath);
      mergedData = mergedData.concat(parsedCsv.data);
    }

    const uniqueDataMap: Map<string, any> = new Map();
    for (const row of mergedData) {
      const existingRow = uniqueDataMap.get(row.code);
      if (!existingRow || new Date(row.taken_at) > new Date(existingRow.taken_at)) {
        uniqueDataMap.set(row.code, row);
      }
    }

    mergedData = Array.from(uniqueDataMap.values()).sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime());

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    if (mergedData.length > 0) {
      const timestamp = new Date().toISOString().slice(0, 10);
      const outputFilePath = path.join(outputDir, `${name}-${timestamp}.csv`);
      const writeStream = fs.createWriteStream(outputFilePath);

      writeStream.write(Object.keys(mergedData[0]).join(',') + '\n');

      for (const row of mergedData) {
        writeStream.write(Object.values(row).join(',') + '\n');
      }

      writeStream.end();
    }
  }
}

export default CsvMergerService;
