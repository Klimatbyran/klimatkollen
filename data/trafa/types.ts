interface Header {
  Column: Column[]
  Description: null
}

interface Column {
  Name: string
  Type: string
  DataType: string
  Filters: any[] | null
  Value: string
  Unit: null | string
  Description: string
  UniqueId: string
}

interface Row {
  Cell: Cell[]
  IsTotal: boolean
}

interface Cell {
  Name: string
  IsMeasure: boolean
  Description: string
  Column: string
  Value: string
  FormattedValue: string
  Level: string
  Gis: string
  UniqueId: string
  NoteIds: number[]
  Versions: Version[]
}

interface Version {
  Key: Date
  Value: string
}


export interface TrafaResponseObject {
    Header: Header
    Rows: Row[]
    Errors: any[]
    Description: string
    Name: string
    OriginalName: string
    Notes: { [key: string]: string }
    NextPublishDate: Date
  }