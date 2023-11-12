export interface IFolder {
  id?: string;
  name: string;
  parent?: string | null;
}

interface IICC {
  version?: string;
  intent?: string;
  cmm?: string;
  deviceClass?: string;
  colorSpace?: string;
  connectionSpace?: string;
  platform?: string;
  creator?: string;
  description?: string;
  copyright?: string;
}

interface IMetadata {
  icc?: IICC;
}

export interface IFile {
  id?: string;
  storage?: string;
  filename_disk?: string;
  filename_download?: string;
  title?: string;
  type?: string;
  folder?: null;
  uploaded_by?: string;
  uploaded_on?: string;
  modified_by?: null;
  modified_on?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: null;
  description?: null;
  location?: null;
  tags?: string[];
  metadata?: IMetadata;
}
