export class DetailedReportDto {
  constructor(
    public id: string,
    public name: string,
    public statement: string,
    public isSolved: boolean,
    public createdDate: string,
    public solveDate: string | null,
    public reportedId: string,
    public reporterId: string,
    public reportedName: string,
    public reporterName: string,
    public contentId: string,
    public content: string,
    public contentTimeStamp: string,
    public reportCategory: string,
  ) {}
}